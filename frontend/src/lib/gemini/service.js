import { buildSystemPrompt } from "../chatbox/systemPrompt.js";

/* ------------------------------------------------------------------ */
/*  Response cache — avoid redundant Gemini calls                      */
/* ------------------------------------------------------------------ */

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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
  if (cache.size > 50) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
  cache.set(key, { value, ts: Date.now() });
}

/* ------------------------------------------------------------------ */
/*  Retry with exponential backoff                                     */
/* ------------------------------------------------------------------ */

async function withRetry(fn, maxRetries = 3) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

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
/*  Gemini API — direct browser call (no proxy needed)                 */
/* ------------------------------------------------------------------ */

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Build the prompt messages for Gemini's format.
 */
function buildGeminiPayload(messages, systemPrompt) {
  const contents = [];

  for (const msg of messages) {
    if (msg.role === "system") continue;
    contents.push({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    });
  }

  return {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
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

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Send a message to Gemini with full error handling.
 * @param {Array} messages - Conversation history [{role, content}]
 * @param {string} apiKey - Google Gemini API key
 * @returns {{ text: string, source: "gemini" }}
 */
export async function sendToGemini(messages, apiKey) {
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  const cacheKey = getCacheKey(messages);
  const cached = getCached(cacheKey);
  if (cached) {
    return { text: cached, source: "gemini", cached: true };
  }

  const systemPrompt = buildSystemPrompt();
  const payload = buildGeminiPayload(messages, systemPrompt);

  const result = await withRetry(async () => {
    const url = `${GEMINI_API_URL}?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      if (response.status === 429) throw new Error("RATE_LIMITED");
      if (response.status === 403) throw new Error("INVALID_API_KEY");
      if (response.status >= 500) throw new Error("SERVER_ERROR");
      throw new Error(`GEMINI_API_ERROR: ${response.status} ${body}`);
    }

    const data = await response.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text || text.trim().length === 0) {
      throw new Error("EMPTY_RESPONSE");
    }

    return text.trim();
  });

  setCache(cacheKey, result);
  return { text: result, source: "gemini" };
}

/**
 * Human-readable error messages.
 */
export function getGeminiErrorMessage(error) {
  const msg = error?.message || "";

  if (msg.includes("MISSING_API_KEY")) {
    return "Gemini API key is not configured. The assistant is running in local-only mode.";
  }
  if (msg.includes("RATE_LIMITED")) {
    return "Too many requests. Please wait a moment and try again.";
  }
  if (msg.includes("INVALID_API_KEY")) {
    return "The Gemini API key is invalid. Please check the configuration.";
  }
  if (msg.includes("SERVER_ERROR")) {
    return "Gemini is temporarily unavailable. I can still answer using my built-in knowledge.";
  }
  if (msg.includes("EMPTY_RESPONSE")) {
    return "Gemini returned an empty response. Please try rephrasing your question.";
  }
  if (msg.includes("network") || msg.includes("fetch")) {
    return "Network error. Please check your connection and try again.";
  }

  return "I'm having trouble reaching the AI service. I can still answer questions using my built-in knowledge.";
}

export { buildSystemPrompt };
