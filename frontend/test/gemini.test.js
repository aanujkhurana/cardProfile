import test, { beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import handler, { buildModelChain } from "../api/gemini.js";

/* ------------------------------------------------------------------ */
/*  buildModelChain unit tests                                         */
/* ------------------------------------------------------------------ */

test("buildModelChain: primary first, then the ordered fallbacks", () => {
  assert.deepEqual(buildModelChain("gemini-3.7-flash"), [
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-flash-latest",
  ]);
});

test("buildModelChain: dedupes when the primary is already a fallback", () => {
  assert.deepEqual(buildModelChain("gemini-flash-latest"), [
    "gemini-flash-latest",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
  ]);
});

test("buildModelChain: prepends a custom primary not in the fallback list", () => {
  assert.deepEqual(buildModelChain("gemini-custom-model"), [
    "gemini-custom-model",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-flash-latest",
  ]);
});

/* ------------------------------------------------------------------ */
/*  Handler fallback-logic tests (mocked fetch)                        */
/* ------------------------------------------------------------------ */

const realFetch = globalThis.fetch;

beforeEach(() => {
  process.env.GEMINI_API_KEY = "test-key";
  delete process.env.GEMINI_MODEL; // exercise DEFAULT_MODEL = gemini-3.7-flash
});

afterEach(() => {
  globalThis.fetch = realFetch;
  delete process.env.GEMINI_MODEL;
  delete process.env.GEMINI_API_KEY;
});

function okResponse(text) {
  return {
    ok: true,
    status: 200,
    async json() {
      return { candidates: [{ content: { parts: [{ text }] } }] };
    },
  };
}

function errorResponse(status) {
  return {
    ok: false,
    status,
    async text() {
      return `upstream error ${status}`;
    },
  };
}

/** Build a fetch mock keyed by model name; records the call order. */
function makeFetch(handlers) {
  const calls = [];
  const fn = async (url) => {
    const match = url.match(/\/models\/([^:]+):generateContent/);
    const model = match ? decodeURIComponent(match[1]) : url;
    calls.push(model);
    const makeResponse = handlers[model];
    if (!makeResponse) throw new Error(`no mock handler for model "${model}"`);
    return makeResponse();
  };
  fn.calls = calls;
  return fn;
}

async function invokeHandler() {
  const req = {
    method: "POST",
    body: {
      messages: [{ role: "user", content: "hello" }],
      systemInstruction: "test persona",
    },
  };
  const res = {
    statusCode: null,
    jsonBody: null,
    setHeader() {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.jsonBody = payload;
      return this;
    },
  };
  await handler(req, res);
  return res;
}

test("falls back to the next model when the primary returns 404", async () => {
  const fetch = makeFetch({
    "gemini-3.7-flash": () => errorResponse(404),
    "gemini-3.6-flash": () => okResponse("hello from 3.6"),
  });
  globalThis.fetch = fetch;

  const res = await invokeHandler();

  assert.equal(res.statusCode, 200);
  assert.equal(res.jsonBody.text, "hello from 3.6");
  assert.equal(res.jsonBody.model, "gemini-3.6-flash");
  assert.deepEqual(fetch.calls, ["gemini-3.7-flash", "gemini-3.6-flash"]);
});

test("falls back to the next model when the primary returns 503", async () => {
  const fetch = makeFetch({
    "gemini-3.7-flash": () => errorResponse(503),
    "gemini-3.6-flash": () => okResponse("hello from 3.6"),
  });
  globalThis.fetch = fetch;

  const res = await invokeHandler();

  assert.equal(res.statusCode, 200);
  assert.equal(res.jsonBody.model, "gemini-3.6-flash");
  assert.deepEqual(fetch.calls, ["gemini-3.7-flash", "gemini-3.6-flash"]);
});

test("keeps walking the chain through mixed 404/503 until a model succeeds", async () => {
  const fetch = makeFetch({
    "gemini-3.7-flash": () => errorResponse(404),
    "gemini-3.6-flash": () => errorResponse(503),
    "gemini-3.5-flash": () => okResponse("hello from 3.5"),
  });
  globalThis.fetch = fetch;

  const res = await invokeHandler();

  assert.equal(res.statusCode, 200);
  assert.equal(res.jsonBody.model, "gemini-3.5-flash");
  assert.deepEqual(fetch.calls, [
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
  ]);
});

test("surfaces the last error when every model returns 404/503", async () => {
  const fetch = makeFetch({
    "gemini-3.7-flash": () => errorResponse(404),
    "gemini-3.6-flash": () => errorResponse(503),
    "gemini-3.5-flash": () => errorResponse(404),
    "gemini-flash-latest": () => errorResponse(503),
  });
  globalThis.fetch = fetch;

  const res = await invokeHandler();

  assert.equal(res.statusCode, 503);
  assert.equal(res.jsonBody.errorCode, "SERVER_ERROR");
  assert.equal(fetch.calls.length, 4);
});

test("surfaces MODEL_NOT_FOUND when every model returns 404", async () => {
  const fetch = makeFetch({
    "gemini-3.7-flash": () => errorResponse(404),
    "gemini-3.6-flash": () => errorResponse(404),
    "gemini-3.5-flash": () => errorResponse(404),
    "gemini-flash-latest": () => errorResponse(404),
  });
  globalThis.fetch = fetch;

  const res = await invokeHandler();

  assert.equal(res.statusCode, 404);
  assert.equal(res.jsonBody.errorCode, "MODEL_NOT_FOUND");
});

test("does not fall back on a fatal 403 — surfaces it immediately", async () => {
  const fetch = makeFetch({
    "gemini-3.7-flash": () => errorResponse(403),
    "gemini-3.6-flash": () => okResponse("should never be called"),
  });
  globalThis.fetch = fetch;

  const res = await invokeHandler();

  assert.equal(res.statusCode, 403);
  assert.equal(res.jsonBody.errorCode, "INVALID_API_KEY");
  assert.deepEqual(fetch.calls, ["gemini-3.7-flash"]);
});

test("does not fall back on rate limiting (429)", async () => {
  const fetch = makeFetch({
    "gemini-3.7-flash": () => errorResponse(429),
  });
  globalThis.fetch = fetch;

  const res = await invokeHandler();

  assert.equal(res.statusCode, 429);
  assert.equal(res.jsonBody.errorCode, "RATE_LIMITED");
  assert.deepEqual(fetch.calls, ["gemini-3.7-flash"]);
});
