/**
 * /api/sanity — Vercel serverless proxy for the Sanity CMS.
 *
 * Why this exists:
 *  - The previous implementation shipped `VITE_SANITY_TOKEN` to the browser
 *    so `@sanity/client` could read (and write) directly. A `VITE_`-prefixed
 *    token is inlined into the client bundle — a confirmed leak surface.
 *    This function holds the token in the server-only `SANITY_TOKEN` env var
 *    and never exposes it to the client.
 *
 * Contract:
 *  - Method: POST
 *  - Body:
 *      { action: "fetch", resource: "experiences" | "works" | "worksAll" }
 *      { action: "create", document: { _type: "contact", name, email, message } }
 *  - Returns (200): { data: ... }
 *  - Returns (4xx/5xx): { error: string }
 *
 * The client can only request the named resources below — it never sends
 * raw GROQ, so a caller cannot run arbitrary queries against the dataset.
 *
 * Environment (server-only):
 *  - SANITY_PROJECT_ID (required)
 *  - SANITY_TOKEN       (required)
 */

import { createClient } from "@sanity/client";

const DATASET = "production";
const API_VERSION = "2024-01-01";

// Allowlisted GROQ queries, keyed by a name the client requests. Adding a
// new read means adding a row here — never accepting a query from the body.
const QUERIES = {
  experiences: '*[_type == "experiences"] | order(year desc)',
  works: '*[_type == "works"] | order(_updatedAt desc)',
  worksAll: '*[_type == "works" && "All" in tags] | order(_updatedAt desc)',
};

function getClient() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const token = process.env.SANITY_TOKEN;
  if (!projectId || !token) return null;
  return createClient({
    projectId,
    dataset: DATASET,
    apiVersion: API_VERSION,
    useCdn: true,
    token,
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const client = getClient();
  if (!client) {
    return res.status(503).json({
      error: "sanity_not_configured",
      errorCode: "MISSING_SANITY_CONFIG",
    });
  }

  const body = req.body || {};

  try {
    if (body.action === "fetch") {
      const query = QUERIES[body.resource];
      if (!query) {
        return res.status(400).json({ error: "invalid_resource" });
      }
      const data = await client.fetch(query);
      return res.status(200).json({ data });
    }

    if (body.action === "create") {
      const doc = body.document;
      if (!doc || doc._type !== "contact") {
        return res.status(400).json({ error: "invalid_document" });
      }
      // Normalize + cap fields server-side before writing.
      const name = String(doc.name || "").trim().slice(0, 200);
      const email = String(doc.email || "").trim().slice(0, 200);
      const message = String(doc.message || "").trim().slice(0, 5000);
      if (!name || !email || !message) {
        return res.status(400).json({ error: "missing_fields" });
      }
      const created = await client.create({
        _type: "contact",
        name,
        email,
        message,
      });
      return res.status(200).json({ data: created });
    }

    return res.status(400).json({ error: "unknown_action" });
  } catch (err) {
    // Redacted log — never echo tokens or document content.
    console.error("[sanity proxy] error:", err?.message || err);
    return res.status(502).json({ error: "sanity_error" });
  }
}
