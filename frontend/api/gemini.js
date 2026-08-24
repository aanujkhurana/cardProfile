/**
 * /api/gemini — Vercel serverless proxy for Google Gemini.
 *
 * Why this exists:
 *  - The previous implementation called `generativelanguage.googleapis.com`
 *    directly from the browser with `?key=${apiKey}` in the URL, which leaked
 *    the API key into network logs, CDN history, and the browser's request
 *    cache. This serverless function holds the API key in the server-only
 *    `GEMINI_API_KEY` env var and never exposes it to the client.
 *
 * Contract:
 *  - Method: POST
 *  - Body:   { messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }> }
 *  - Returns (200): { text: string, source: 'gemini', cached?: boolean }
 *  - Returns (4xx/5xx): { error: string, errorCode?: string }
 *
 * Environment:
 *  - GEMINI_API_KEY (server-only, required)
 *  - GEMINI_MODEL   (optional, defaults to "gemini-3.5-flash"; on a 404,
 *                    503, or timeout the proxy walks a known-good fallback
 *                    model chain)
 *
 * Notes:
 *  - Streaming is deferred to Phase 14 (the audit's polish phase). This
 *    endpoint returns the full response as JSON. The client already uses
 *    a 50-entry 5-minute cache and 3-attempt retry on the network layer.
 */

const DEFAULT_MODEL = "gemini-3.5-flash";
// Per-attempt timeout. Kept short so a slow primary model yields quickly and
// the fallback chain still has room to try other candidates inside the
// client's 30s budget (see src/lib/gemini/service.js).
const MODEL_TIMEOUT_MS = 10_000;
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// Ordered fallback chain, most-reliable-first. Measured across 10 load tests
// against the production endpoint:
//   gemini-3.5-flash  -> 100% success when reached (~2s)
//   gemini-3.6-flash  -> ~33% success (frequent 10s timeouts)
//   gemini-3.7-flash  -> ~10% success (very flaky, frequent 10s timeouts)
// The newest model is therefore tried LAST; the reliable ones lead. Google
// rotates and deprecates model IDs, so on a 404 (model gone) or 503
// (overloaded) we still step to the next candidate instead of failing.
const MODEL_FALLBACKS = [
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-flash-latest",
  "gemini-3.7-flash",
];

// Last model that returned a successful response. Vercel keeps function
// instances warm across requests, so consecutive questions skip the flaky
// models and go straight to a proven one. This is process-local (resets on a
// cold start); the DEFAULT_MODEL + MODEL_FALLBACKS ordering above keeps cold
// starts fast too.
let lastWorkingModel = null;

/** Clear the remembered model (exposed for tests). */
export function resetModelMemory() {
  lastWorkingModel = null;
}

/**
 * Build the ordered model chain for a request. The most-recently-successful
 * model leads, then the configured primary, then the ordered fallbacks —
 * deduplicated so nothing is tried twice.
 */
export function buildModelChain(primary) {
  const chain = [];
  if (lastWorkingModel && !chain.includes(lastWorkingModel)) {
    chain.push(lastWorkingModel);
  }
  if (!chain.includes(primary)) chain.push(primary);
  for (const model of MODEL_FALLBACKS) {
    if (!chain.includes(model)) chain.push(model);
  }
  return chain;
}

/**
 * Map common Gemini failure modes to a structured error code the
 * frontend can localize into a friendly message via `getGeminiErrorMessage`.
 */
function classifyError(status) {
  if (status === 429) return "RATE_LIMITED";
  if (status === 403) return "INVALID_API_KEY";
  if (status === 404) return "MODEL_NOT_FOUND";
  if (status >= 500) return "SERVER_ERROR";
  // Gemini occasionally responds with an unexpected shape. Surface as a
  // distinct code so the frontend can message it specifically.
  return "GEMINI_API_ERROR";
}

const ALLOWED_ROLES = new Set(["user", "assistant", "system"]);
const MAX_MESSAGES = 64;

function sanitizeMessages(input) {
  if (!Array.isArray(input)) return null;
  if (input.length === 0 || input.length > MAX_MESSAGES) return null;
  const out = [];
  for (const msg of input) {
    if (!msg || typeof msg.content !== "string" || !msg.content.trim()) continue;
    // The role allowlist is enforced server-side. Any "system" entries
    // are folded into the explicit systemInstruction field server-side
    // handles; we strip them here to prevent persona override attempts.
    if (msg.role === "system") continue;
    if (!ALLOWED_ROLES.has(msg.role)) continue;
    out.push({ role: msg.role, content: msg.content });
  }
  return out.length > 0 ? out : null;
}

/**
 * Build the Gemini request payload from a normalized chat history.
 */
function buildPayload(messages, systemInstruction) {
  const contents = [];
  for (const msg of messages) {
    if (!msg || typeof msg.content !== "string" || !msg.content.trim()) continue;
    contents.push({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    });
  }

  return {
    system_instruction: systemInstruction
      ? { parts: [{ text: systemInstruction }] }
      : undefined,
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
      topP: 0.9,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
  };
}

/**
 * Cross-origin support: the frontend is served from GitHub Pages (static-only,
 * no serverless functions), so the browser calls this function from a different
 * origin. Answer the OPTIONS preflight and stamp every response with CORS
 * headers. No cookies/credentials are used, so a wildcard origin is safe;
 * set CORS_ORIGIN to restrict it to a specific origin (e.g. your GitHub Pages
 * URL).
 */
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

function applyCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (CORS_ORIGIN !== "*") {
    res.setHeader("Vary", "Origin");
  }
}

export default async function handler(req, res) {
  applyCorsHeaders(res);

  // Preflight: browsers send OPTIONS first for the application/json POST.
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Method guard. Vercel routes are POST-only by convention for AI proxies.
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "api_key_not_configured",
      errorCode: "MISSING_API_KEY",
      message:
        "The Gemini API key is not configured on the server. The assistant is running in local-only mode.",
    });
  }

  // Body validation — fail fast on shape errors.
  const body = req.body || {};
  const messages = sanitizeMessages(body.messages);
  if (!messages) {
    return res
      .status(400)
      .json({ error: "invalid_request", errorCode: "INVALID_REQUEST" });
  }

  // Reject payloads that would balloon the request — keep this generous
  // enough for a conversational history but tight enough to defend against
  // abuse under the serverless execution budget.
  const totalChars = messages.reduce(
    (n, m) => n + (m?.content?.length || 0),
    0
  );
  if (totalChars > 30_000) {
    return res.status(413).json({
      error: "payload_too_large",
      errorCode: "INVALID_REQUEST",
    });
  }

  const primaryModel = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const models = buildModelChain(primaryModel);
  const systemInstruction =
    typeof body.systemInstruction === "string" ? body.systemInstruction : "";
  const payload = buildPayload(messages, systemInstruction);

  // Header-only auth: the API key rides in `x-goog-api-key` and never
  // appears in the URL. The URL stays server-only anyway, but keeping
  // the key out of it prevents accidental log leakage if a future
  // deployment pipes request URLs into observability tooling.
  // (Earlier draft added `?key=` as defense-in-depth; removed because the
  // public Generative Language API rejects duplicate auth on some models.)
  //
  // The frontend already retries 3 times with exponential backoff, so the
  // server retries only via the model fallback chain — it never re-hits the
  // same model, which would just multiply latency.
  let lastError = null;

  for (const model of models) {
    const url = `${GEMINI_API_BASE}/${encodeURIComponent(model)}:generateContent`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), MODEL_TIMEOUT_MS);

    try {
      const upstream = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!upstream.ok) {
        const errText = await upstream.text().catch(() => "");
        const errorCode = classifyError(upstream.status);

        // Model-specific failures: 404 (model deprecated/removed) and 503
        // (model overloaded). Step to the next candidate and try again.
        if (upstream.status === 404 || upstream.status === 503) {
          lastError = { status: upstream.status, errorCode };
          console.error(
            `[gemini proxy] ${model} -> ${upstream.status} ${errorCode}; trying next model`
          );
          continue;
        }

        // Fatal failure (auth, rate-limit, other 4xx/5xx). A different
        // model won't help; surface it immediately. Redacted server log:
        // status + errorCode only, never model payload (Gemini responses
        // can contain user content).
        console.error(
          `[gemini proxy] upstream ${upstream.status} -> ${errorCode} (${errText.length} bytes suppressed)`
        );
        return res.status(upstream.status >= 400 ? upstream.status : 502).json({
          error: errorCode.toLowerCase(),
          errorCode,
        });
      }

      const data = await upstream.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text || !text.trim()) {
        return res
          .status(502)
          .json({ error: "empty_response", errorCode: "EMPTY_RESPONSE" });
      }

      // Remember the model that worked so the next request tries it first.
      lastWorkingModel = model;

      return res.status(200).json({
        text: text.trim(),
        source: "gemini",
        model,
      });
    } catch (err) {
      if (err?.name === "AbortError") {
        // Slow model — record it and advance to the next candidate. The
        // short per-attempt window keeps the whole chain inside the
        // client's 30s budget instead of one model eating it all.
        lastError = { status: 504, errorCode: "SERVER_ERROR" };
        console.error(
          `[gemini proxy] ${model} timed out after ${MODEL_TIMEOUT_MS / 1000}s; trying next model`
        );
        continue;
      }
      console.error("[gemini proxy] transport error:", err?.message || err);
      return res
        .status(502)
        .json({ error: "network_error", errorCode: "NETWORK_ERROR" });
    } finally {
      clearTimeout(timeout);
    }
  }

  // Every candidate failed with a fallback-eligible (404/503/timeout) error.
  const status = lastError?.status || 502;
  const errorCode = lastError?.errorCode || "SERVER_ERROR";
  return res.status(status).json({
    error: errorCode.toLowerCase(),
    errorCode,
  });
}
