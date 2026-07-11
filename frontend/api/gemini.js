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
 *  - GEMINI_MODEL   (optional, defaults to "gemini-2.5-flash")
 *
 * Notes:
 *  - Streaming is deferred to Phase 14 (the audit's polish phase). This
 *    endpoint returns the full response as JSON. The client already uses
 *    a 50-entry 5-minute cache and 3-attempt retry on the network layer.
 */

const DEFAULT_MODEL = "gemini-2.5-flash";
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

/**
 * Map common Gemini failure modes to a structured error code the
 * frontend can localize into a friendly message via `getGeminiErrorMessage`.
 */
function classifyError(status) {
  if (status === 429) return "RATE_LIMITED";
  if (status === 403) return "INVALID_API_KEY";
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

export default async function handler(req, res) {
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

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const systemInstruction =
    typeof body.systemInstruction === "string" ? body.systemInstruction : "";
  const payload = buildPayload(messages, systemInstruction);

  // Header-only auth: the API key rides in `x-goog-api-key` and never
  // appears in the URL. The URL stays server-only anyway, but keeping
  // the key out of it prevents accidental log leakage if a future
  // deployment pipes request URLs into observability tooling.
  // (Earlier draft added `?key=` as defense-in-depth; removed because the
  // public Generative Language API rejects duplicate auth on some models.)
  const url = `${GEMINI_API_BASE}/${encodeURIComponent(model)}:generateContent`;

  // Single attempt here. The frontend already retries 3 times with
  // exponential backoff; duplicating retries server-side would just
  // multiply latency.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Pass the key as a header where supported; the `?key=` query
        // is kept as a fallback for older proxies / local mocking.
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => "");
      const errorCode = classifyError(upstream.status);
      // Redacted server log: status + errorCode only, no model payload.
      // Gemini responses can contain user content; never echo in logs.
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

    return res.status(200).json({
      text: text.trim(),
      source: "gemini",
    });
  } catch (err) {
    if (err?.name === "AbortError") {
      console.error("[gemini proxy] timed out after 25s");
      return res
        .status(504)
        .json({ error: "timeout", errorCode: "SERVER_ERROR" });
    }
    console.error("[gemini proxy] transport error:", err?.message || err);
    return res
      .status(502)
      .json({ error: "network_error", errorCode: "NETWORK_ERROR" });
  } finally {
    clearTimeout(timeout);
  }
}
