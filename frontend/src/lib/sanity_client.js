import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url';

// Project ID + dataset are NOT secret (they appear in CDN image URLs), so
// they stay client-side for building image URLs. The API token lives ONLY
// on the server in `SANITY_TOKEN` — authenticated reads and the contact
// write go through `/api/sanity` (see fetchSanity / createContact below).
const client = createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
    // token intentionally omitted — never shipped to the browser.
})

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);

/**
 * Thin wrapper around the /api/sanity serverless proxy. Throws on non-2xx
 * so callers keep their existing try/catch + error handling.
 */
async function sanityRequest(body) {
  const response = await fetch('/api/sanity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const err = new Error(payload?.error || `HTTP_${response.status}`);
    err.status = response.status;
    throw err;
  }
  return payload.data;
}

/** Read an allowlisted resource ("experiences" | "works" | "worksAll"). */
export function fetchSanity(resource) {
  return sanityRequest({ action: 'fetch', resource });
}

/** Submit the contact form (server-side `client.create`). */
export function createContact({ name, email, message }) {
  return sanityRequest({
    action: 'create',
    document: { _type: 'contact', name, email, message },
  });
}
