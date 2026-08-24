import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url';

// Project ID + dataset are NOT secret (they appear in CDN image URLs), so
// they stay client-side. The dataset is PUBLIC, so reads run straight against
// the Sanity CDN with NO token — this is why projects/experience load on a
// static frontend host that has no serverless functions. Only the contact-form
// WRITE needs the token, so createContact() still posts to /api/sanity.
const client = createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
    // token intentionally omitted — never shipped to the browser.
})

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);

// Allowlisted reads, mirroring api/sanity.js so behavior is identical. Adding
// a new read means adding a row here (and optionally to api/sanity.js).
const QUERIES = {
  experiences: '*[_type == "experiences"] | order(year desc)',
  works: '*[_type == "works"] | order(_updatedAt desc)',
  worksAll: '*[_type == "works" && "All" in tags] | order(_updatedAt desc)',
};

/** Read an allowlisted resource ("experiences" | "works" | "worksAll"). */
export function fetchSanity(resource) {
  const query = QUERIES[resource];
  if (!query) {
    return Promise.reject(new Error(`invalid_resource: ${resource}`));
  }
  return client.fetch(query);
}

/**
 * Submit the contact form. This is the ONLY call that needs the Sanity token,
 * so it goes through the /api/sanity serverless proxy (requires a host with
 * serverless functions, e.g. Vercel — it will not work on a pure static host).
 */
export async function createContact({ name, email, message }) {
  const apiBase = import.meta.env.VITE_API_BASE || "";
  const response = await fetch(`${apiBase}/api/sanity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create',
      document: { _type: 'contact', name, email, message },
    }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const err = new Error(payload?.error || `HTTP_${response.status}`);
    err.status = response.status;
    throw err;
  }
  return payload.data;
}
