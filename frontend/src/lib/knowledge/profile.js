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
  /**
   * Phase 10 — last-updated timestamp (ISO 8601 date).
   *
   * Set at deploy time so the chip + persona prompt can show
   * recruiters how fresh the availability signal is. Update this
   * field whenever the signal above changes (e.g. when Anuj
   * starts a new role). The `formatLastChecked()` helper turns
   * this ISO string into a human relative phrase ("Today",
   * "Yesterday", "3 days ago", "Jul 12, 2026") at render time
   * so the relative phrase stays accurate without a rebuild.
   *
   * Today: this build was deployed on 2026-07-12.
   */
  availabilityLastChecked: "2026-07-12",
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
 *   - tone     : CSS tone class (positive / informational / cautious)
 *   - label    : primary headline shown on the ContactCard badge
 *   - subtext  : short detail line shown after the "·" on the badge
 *
 * The badge, persona prompt line, and router AI text all read the
 * resolved `fullText` (label · subtext) so a recruiter sees the
 * exact same signal on the badge AND in the AI's spoken reply.
 */
const AVAILABILITY_STATES = {
  open: {
    tone: "positive",
    label: "Currently open to opportunities",
    subtext: "Responds within 24 hours",
  },
  employed: {
    tone: "informational",
    label: "Currently working at GoDesta",
    subtext: "Not actively looking",
  },
  "selectively-open": {
    tone: "cautious",
    label: "Selectively open to opportunities",
    subtext: "Open to the right fit",
  },
};

/**
 * Resolves `profile.availabilityStatus` into a structured object.
 *
 * Always returns a valid state (graceful fallback to "open" on an
 * unrecognised value). The returned object carries:
 *   - status               : the raw enum (for ad-hoc logic)
 *   - tone / label / subtext: per-state presentation (Phase 8)
 *   - fullText             : "label · subtext" — the single string
 *                            the ContactCard / persona prompt read
 *   - lastChecked          : raw ISO date from profile.js (or null)
 *   - lastCheckedFormatted : relative phrase ("Today", "3 days ago",
 *                            or absolute for > 30 days) — the
 *                            ContactCard + static chip display this
 *   - lastCheckedAbsolute  : always-absolute phrase ("Jul 12, 2026")
 *                            — the persona prompt uses this for
 *                            "as of [date]" mentions
 *
 * `formatLastChecked(isoDate, { now, style })` is exported alongside
 * so tests can inject a fixed `now` value and exercise edge cases
 * (future dates from clock skew, invalid strings, multi-year
 * intervals) deterministically.
 */
export function getAvailability() {
  const state =
    AVAILABILITY_STATES[profile.availabilityStatus] || AVAILABILITY_STATES.open;
  const now = new Date();
  const lastChecked = profile.availabilityLastChecked || null;
  return {
    status: profile.availabilityStatus in AVAILABILITY_STATES
      ? profile.availabilityStatus
      : "open",
    tone: state.tone,
    label: state.label,
    subtext: state.subtext,
    fullText: `${state.label} · ${state.subtext}`,
    lastChecked,
    lastCheckedFormatted: formatLastChecked(lastChecked, { now }),
    lastCheckedAbsolute: formatLastChecked(lastChecked, {
      now,
      style: "absolute",
    }),
  };
}

/* ------------------------------------------------------------------ */
/*  Phase 10 — last-updated formatter                                 */
/* ------------------------------------------------------------------ */

/**
 * Formats an ISO-8601 date string into a human phrase.
 *
 *   style = "relative" (default) — "Today" / "Yesterday" /
 *            "3 days ago" / "2 weeks ago" / "Jul 12" / "Jul 12, 2025"
 *   style = "absolute"           — always "Jul 12, 2026"
 *
 * Edge cases:
 *   - null / empty / unparseable input  → returns null (callers hide
 *                                          the timestamp element)
 *   - future date (clock skew)          → "Today" (clamped to today)
 *   - same calendar day                 → "Today"
 *   - previous calendar day             → "Yesterday"
 *   - older than 30 days                → falls back to absolute-ish
 *                                          format ("Jul 12" this year,
 *                                          "Jul 12, 2025" otherwise)
 *
 * `now` defaults to `new Date()` and is injectable so unit tests
 * can pin the reference date and assert the exact output without
 * mocking the global clock.
 */
export function formatLastChecked(
  isoDate,
  { now = new Date(), style = "relative" } = {}
) {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return null;

  const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const month = MONTHS[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const absoluteFormatted = `${month} ${day}, ${year}`;

  if (style === "absolute") return absoluteFormatted;

  // UTC day math avoids timezone surprises: a "Jul 12" stored at
  // 23:00 UTC shouldn't read as "Jul 13" for a recruiter in a
  // timezone east of UTC who loads the page at 09:00 their time.
  const dateDay = Date.UTC(year, date.getMonth(), day);
  const nowDay = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const diffDays = Math.floor((nowDay - dateDay) / (1000 * 60 * 60 * 24));

  // Future date (clock skew) — treat as today rather than rendering
  // a confusing "in -2 days" phrase.
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }

  // Older than 30 days: short month-day, plus year only if it
  // doesn't match the current year. Keeps the chip compact while
  // still giving the recruiter enough context to know it's stale.
  return year === now.getFullYear() ? `${month} ${day}` : absoluteFormatted;
}
