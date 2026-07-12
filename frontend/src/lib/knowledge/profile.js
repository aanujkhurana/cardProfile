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
   * Canonical availability signal (Phase 8).
   *
   * Drives the ContactCard badge colour + label AND the persona
   * prompt's availability line AND the buildAvailabilityResponse
   * AI text. To flip the signal — e.g., when Anuj starts a new
   * role — change this single enum value. `getAvailability()`
   * resolves it to a structured object (tone, label, subtext,
   * narrative) that the card and prompt both consume.
   *
   * Valid values:
   *   - "open"               → actively exploring (green badge)
   *   - "employed"           → not actively looking (blue badge)
   *   - "selectively-open"   → passive candidate (amber badge)
   *
   * Unrecognised values gracefully fall back to "open" so a typo
   * can't hide the highest-signal state from recruiters.
   */
  availabilityStatus: "open",
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

/* ------------------------------------------------------------------ */
/*  Availability state machine (Phase 8)                              */
/* ------------------------------------------------------------------ */

/**
 * Per-state presentation + narrative. Single source of truth for
 * everything the AI or cards surface about Anuj's availability.
 *
 * Shape per state:
 *   - tone      : CSS tone class (positive / informational / cautious)
 *   - label     : primary headline shown on the ContactCard badge
 *   - subtext   : short detail line shown after the "·" on the badge
 *   - narrative : 1-sentence signal the LLM persona uses in
 *                 buildAvailabilityResponse and instruction 10
 */
const AVAILABILITY_STATES = {
  open: {
    tone: "positive",
    label: "Currently open to opportunities",
    subtext: "Responds within 24 hours",
    narrative: "Currently open to opportunities",
  },
  employed: {
    tone: "informational",
    label: "Currently working at GoDesta",
    subtext: "Not actively looking",
    narrative: "Currently employed and not actively looking",
  },
  "selectively-open": {
    tone: "cautious",
    label: "Selectively open to opportunities",
    subtext: "Open to the right fit",
    narrative: "Selectively open to the right opportunities",
  },
};

/**
 * Resolves `profile.availabilityStatus` into a structured object.
 *
 * Always returns a valid state (graceful fallback to "open" on an
 * unrecognised value). The returned object also carries `status`
 * (the raw enum) and `fullText` (label · subtext, the single
 * string the ContactCard renders and the systemPrompt persona
 * line shows).
 */
export function getAvailability() {
  const state =
    AVAILABILITY_STATES[profile.availabilityStatus] || AVAILABILITY_STATES.open;
  return {
    status: profile.availabilityStatus in AVAILABILITY_STATES
      ? profile.availabilityStatus
      : "open",
    tone: state.tone,
    label: state.label,
    subtext: state.subtext,
    narrative: state.narrative,
    fullText: `${state.label} · ${state.subtext}`,
  };
}
