/**
 * Gemini client for the AI portfolio assistant.
 *
 * The API key lives exclusively on the server in `GEMINI_API_KEY`. The browser
 * now talks to our own `/api/gemini` serverless function (see `frontend/api/gemini.js`).
 *
 * Responsibilities of this module:
 *   1. Forward the chat history and the persona system prompt to /api/gemini.
 *   2. Run a small in-memory response cache to absorb duplicate queries.
 *   3. Retry with exponential backoff on transient transport failures.
 *   4. Skip retry on 4xx (server already classified the failure).
 *   5. Surface human-readable error messages via `getGeminiErrorMessage`.
 *
 * Security note:
 *   Until Phase 14 (streaming polish), responses are returned as a single JSON
 *   blob. The server holds the API key, so this module never sees it.
 */

import { buildSystemPrompt } from "../chatbox/systemPrompt.js";

const ENDPOINT = "/api/gemini";

/* ------------------------------------------------------------------ */
/*  Response cache — avoid redundant network calls                    */
/* ------------------------------------------------------------------ */

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_MAX_ENTRIES = 50;

function getCacheKey(messages) {
  const last = messages[messages.length - 1];
  return last?.content?.toLowerCase().trim() || "";
}

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.value;
  cache.delete(key);
  return null;
}

function setCache(key, value) {
  if (cache.size > CACHE_MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
  cache.set(key, { value, ts: Date.now() });
}

/* ------------------------------------------------------------------ */
/*  Network layer — retry with exponential backoff                    */
/* ------------------------------------------------------------------ */

async function postJson(messages) {
  // The persona lives client-side because it depends on the same
  // local-knowledge data the router uses. Sending it inline keeps the
  // proxy stateless and avoids duplicating the prompt across runtimes.
  const body = {
    messages,
    systemInstruction: buildSystemPrompt(),
  };

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    // 30s soft cap. Vercel's plan-level hard cap is 10s (hobby) / 60s (pro).
    // Raising this won't extend the cap; it just stops the user seeing a
    // hung spinner if the server is slow to surface its 5xx.
    signal: AbortSignal.timeout(30_000),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const code = payload?.errorCode || `HTTP_${response.status}`;
    const err = new Error(code);
    err.status = response.status;
    err.friendly = payload?.message;
    throw err;
  }
  return payload;
}

async function withRetry(fn, maxRetries = 3) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      // Don't retry on auth / client errors — they will only fail again.
      if (err.status && err.status >= 400 && err.status < 500) {
        throw err;
      }

      if (attempt < maxRetries) {
        const delay = Math.min(1000 * 2 ** attempt, 8000);
        const jitter = delay * (0.5 + Math.random() * 0.5);
        await new Promise((r) => setTimeout(r, jitter));
      }
    }
  }
  throw lastError;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Send a chat history to Gemini via our server-side proxy.
 * @param {Array<{role: string, content: string}>} messages
 * @returns {Promise<{ text: string, source: 'gemini', cached?: boolean }>}
 */
export async function sendToGemini(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("EMPTY_RESPONSE");
  }

  const cacheKey = getCacheKey(messages);
  const cached = getCached(cacheKey);
  if (cached) {
    return { text: cached, source: "gemini", cached: true };
  }

  const result = await withRetry(() => postJson(messages));

  if (!result?.text || !result.text.trim()) {
    throw new Error("EMPTY_RESPONSE");
  }

  setCache(cacheKey, result.text.trim());
  return { text: result.text.trim(), source: "gemini" };
}

/**
 * Map a Gemini error to a human-readable message.
 * The AI landing view appends this string to the chat when something fails.
 */
export function getGeminiErrorMessage(error) {
  const code = (error?.code || error?.message || "").toString();
  const status = error?.status;

  if (status === 404 || code.includes("MISSING_API_KEY")) {
    return "The Gemini API key isn't configured on the server. I'll keep answering from my built-in knowledge.";
  }
  if (status === 429 || code.includes("RATE_LIMITED")) {
    return "Too many requests. Please wait a moment and try again.";
  }
  if (status === 403 || code.includes("INVALID_API_KEY")) {
    return "The Gemini API key on the server is invalid. I'll keep answering from my built-in knowledge.";
  }
  if (code.includes("EMPTY_RESPONSE")) {
    return "Gemini returned an empty response. Please try rephrasing your question.";
  }
  if (
    code.includes("AbortError") ||
    code.includes("SERVER_ERROR") ||
    code.includes("timeout")
  ) {
    return "Gemini is taking too long right now. I'll answer from my built-in knowledge for this turn.";
  }
  if (code.includes("NETWORK_ERROR") || status === 0) {
    return "Network error. Please check your connection and try again.";
  }

  return "I'm having trouble reaching the AI service. I can still answer questions using my built-in knowledge.";
}
