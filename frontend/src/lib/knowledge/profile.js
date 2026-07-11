/**
 * About Me — the canonical persona for Anuj Khurana.
 *
 * Field shape (Phase 4):
 *   - name        : display name
 *   - title       : job title used in cards and the persona prompt
 *   - headline    : one-line elevator pitch; rendered above the
 *                   narrative in ProfileCard and as the AI card's
 *                   primary signal
 *   - narrative   : 3–4 sentence structured introduction
 *                   (journey → focus → impact → goals). Rendered as
 *                   the AI card body
 *   - summary     : longer-form paragraph(s) consumed by the LLM
 *                   persona prompt so Gemini can speak in Anuj's
 *                   voice
 *   - location, currentFocus, visaStatus, contact, techStack
 *                 : unchanged from the previous iteration
 *
 * All other About-Me surfaces (Card.vue about-text, ProfileCard.vue)
 * mirror this copy. Card.vue keeps its own copy for layout reasons but
 * the intent and metrics are identical — drift between the two is a
 * bug to file, not an editorial decision.
 */

export const profile = {
  // Keep `title` as the conventional job title (recruiter search filters
  // typically exact-match on "Full Stack Developer"). AI/LLM focus is
  // carried by `headline`, `narrative`, and `currentFocus` below —
  // surfacing it in `title` overstates the current scope.
  name: "Anuj Khurana",
  title: "Full Stack Developer",
  headline:
    "Three years shipping production web and AI applications across Vue 3, TypeScript, and Node.js.",
  narrative:
    "Started as an intern at Gilmour Space Technologies, building a D3 + Vue tree chart for satellite-assembly data and learning that great UI is half correctness, half empathy. Three years on, I'm at GoDesta leading a Vue 2 → Vue 3 migration that produced a measured 15% performance gain against Lighthouse and Core Web Vitals. Currently deepening AI/LLM engineering and real-time systems (WebRTC) — and shipping this conversational portfolio assistant as a working demonstration of the work.",
  summary: `I started as a frontend engineer building data-viz tools for satellite-assembly data at Gilmour Space Technologies, and I've spent the three years since shipping production web and AI applications across Vue 3, TypeScript, and Node.js. At GoDesta I led the Vue 2 → Vue 3 migration end-to-end — hardening the build, fixing reactivity regressions, and validating a 15% performance improvement against Lighthouse and Core Web Vitals.

Most of my work sits at the intersection of frontend performance, product thinking, and AI. I've shipped FindMyLease (Vue 3, AWS Cognito, Prisma, Mapbox) end-to-end, an interactive D3 OrgChart UI, a one-click URL summarizer built on the OpenAI API, and this very portfolio — a server-side Gemini proxy that holds the API key off the client and a local-knowledge intent router that handles most queries without a Gemini round-trip.

Comfortable across the stack — frontend, API design, Postgres, serverless — and equally comfortable on the product side. I'd rather ship a smaller thing that someone uses than a larger thing that ships late. Currently deepening real-time systems (WebRTC) and AI/LLM engineering, and looking for a team that values craft and shipping measured impact.`,
  // Note: Card.vue (static portfolio) and the AI ProfileCard share the
  // intent and metrics of this copy. Card.vue keeps its own text for
  // layout reasons — if you edit `narrative` or `summary` here, mirror
  // the change in src/components/Card.vue's <section class="about-text">.
  location: "Queensland, Australia",
  currentFocus: [
    "AI & LLM App Engineering",
    "Vue 3 + TypeScript",
    "Real-time Systems (WebRTC)",
  ],
  visaStatus: "VISA 485 with full working rights in Australia, valid until 2029",
  /**
   * Human-readable availability statement surfaced in:
   *   - the ContactCard badge (Phase 7, with a live pulse dot)
   *   - the persona prompt so Gemini can answer "are you open to
   *     opportunities?" directly
   *   - the buildContactResponse and buildAvailabilityResponse
   *     data envelopes in src/lib/knowledge/router.js
   *
   * ⚠️  When you change this string, mirror the change in any card
   *     that renders the full note (ContactCard's badge) so the
   *     visible copy matches the persona prompt.
   */
  availabilityNote:
    "Currently open to opportunities · Responds within 24 hours",
  contact: {
    phone: "+61 48 12 50 988",
    email: "aanujkhurana@gmail.com",
    website: "/",
    linkedin: "https://linkedin.com/in/aanujkhurana",
    github: "https://github.com/anujkhurana",
  },
  techStack: [
    "Python",
    "Vue 3",
    "TypeScript",
    "Node.js",
    "Express.js",
    "LangChain",
    "PostgreSQL",
    "AWS",
    "MongoDB",
    "JavaScript",
    "HTML",
    "CSS",
  ],
};
