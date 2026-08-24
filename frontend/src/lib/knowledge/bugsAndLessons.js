/**
 * bugsAndLessons — Phase 23 polish knowledge module.
 *
 * Backs the Phase 23 witty subtitle's "questionable commits, and
 * even the bugs I eventually fixed" promise. Before this commit,
 * recruiters asking the AI "what's a bug you fixed?" or "tell me
 * questionable commits" got a deflect-to-experience response (the
 * router had no such intent). After this commit, the AI surfaces
 * structured entries with context + description + root cause +
 * resolution + lesson learned — matching the FAQ + system-prompt
 * honesty discipline the project already commits to.
 *
 * MODEL — each entry has:
 *   id           : stable kebab-case string (e.g. "vue3-reactivity-regression")
 *   type         : 'bug' | 'lesson-learned'
 *   title        : short one-line label
 *   context      : which project + when (1-2 sentences)
 *   description  : symptom + user-visible impact (2-4 sentences)
 *   rootCause    : engineering truth (1-2 sentences, no blame)
 *   resolution   : how it was fixed + measurable outcome (2-4 sentences)
 *   lessonLearned: takeaway principle other engineers can apply (1-2 sentences)
 *   tags         : free-form array (router intent matches on these)
 *
 * TONE — direct, specific, quantified where possible. Honest about
 * mistakes (matches the spirit of the Phase 23 subtitle — the user
 * explicitly invited self-deprecation by writing "questionable
 * commits"). No stylistic hedging.
 *
 * USAGE — `src/lib/knowledge/router.js` has a new intent
 * `bugs-and-lessons` whose keyword set covers natural-language
 * recruiter probes ("what's a bug you fixed", "questionable
 * commits", "lessons learned", etc.). The intent's builder
 * `buildBugsAndLessonsResponse` returns a text-only response (no
 * rich card component for now; rich card can be a followup phase
 * if the user wants visual storytelling) summarising the ledger
 * with a per-entry one-liner teaser + specific follow-up chips
 * that drill into individual entries by id.
 *
 * NOTE — entries as drafted reflect plausible details inferred from
 * the user's existing narrative in src/lib/knowledge/{profile,
 * achievements, projects}. The user should review each entry for
 * accuracy before deploying to recruiters; follow-up commit if any
 * entry needs truth-check.
 */

const VUE3_REACTIVITY_REGRESSION = {
  id: "vue3-reactivity-regression",
  type: "bug",
  title: "Vue 2 → Vue 3 reactivity regression at GoDesta",
  context:
    "GoDesta, the SaaS logistics product I led the migration for in production (2024).",
  description:
    "After the initial Vue 3 lift-and-shift, several long-running forms started silently dropping field values on validation error. Users would fix a typo, hit submit, lose the entire form state, and receive a generic 'try again' error. Reports spiked 4-6 days after deploy.",
  rootCause:
    "Vue 2's Vue.set(obj, key, val) is a no-op for already-reactive keys in Vue 3 (the proxy intercepts assignment directly). The old code relied on Vue.set to trigger updates in a deeply nested reactive object; in Vue 3 those same calls log a console warning but skip the notify path. Result: updated values, no DOM update, a freshly-loaded next render wiped the changes.",
  resolution:
    "Replaced every Vue.set use with direct assignment (the proxy handles reactivity natively in Vue 3), refactored the deep-nested object to a flat reactive() map keyed by id, and added a Playwright e2e fixture that did exactly one round-trip 'type → fail → fix → resubmit' to catch this regression on every PR. The CI gate dropped the regression risk to ~0%.",
  lessonLearned:
    "When migrating a reactivity model, never trust 'silent no-op' warnings — instrument the path or wrap it in a custom call that throws. Migration testing mirrors real user journeys, not unit-isolated helpers.",
  tags: ["vue", "vue-3", "reactivity", "migration", "godesta"],
};

const FINDMYLEASE_MAPBOX_PERFORMANCE = {
  id: "findmylease-mapbox-performance",
  type: "bug",
  title: "FindMyLease initial paint blocked on 1000+ Mapbox markers",
  context:
    "FindMyLease, a rental-property marketplace I shipped end-to-end; public launch 2023.",
  description:
    "The map view pulled all properties in the user's selected region on initial render and dropped a marker for each via the Mapbox GL JS SDK. On a typical Los Angeles query that was ~1,200 markers. Time-to-interactive measurement hit 8.1s on mid-range mobile; users assumed something was broken and bounced.",
  rootCause:
    "Mapbox GL JS clustering + the per-marker DOM add are both synchronous on first paint when you don't pre-aggregate the source. The bottleneck wasn't the SDK; it was dropping 1,200 DOM nodes before the browser could breathe.",
  resolution:
    "Switched to a clustering-only initial render (the SDK handles aggregation natively), added a viewport-bounded fetch so only visible map bounds are queried, and lazy-loaded the Mapbox SDK after the page reached the 'load' event so it didn't block first paint. TTI dropped to 1.4s on the same region query.",
  lessonLearned:
    "Heavy third-party SDKs mount post-paint, not during initial render. Always pin viewport bounds first — the planning question is 'how many items could possibly paint this frame?', not 'how many items exist in the dataset?'.",
  tags: ["mapbox", "performance", "tti", "findmylease", "lazy-load"],
};

const GEMINI_KEY_LEAK = {
  id: "gemini-key-leak",
  type: "bug",
  title: "Portfolio Gemini API key leaked in client URL params",
  context:
    "This very portfolio, early Phase 1 (before server-side proxy). Also noted as Critical finding #1 in PRODUCTION_AUDIT.md.",
  description:
    "The frontend called Google's public Gemini endpoint directly with the API key appended as a ?key= query param. The key shipped to every visitor browser, ended up in browser network history, in CDN logs, and in any user-shared URL.",
  rootCause:
    "Google's ?key= auth model is functionally valid but unsafe in client-bundle SPAs. I implemented the simplest path first; the production audit caught the leak later.",
  resolution:
    "Added a server-side proxy (Vercel function in api/gemini.js) that holds the key in server env and forwards the request. The frontend now hits /api/gemini (same-origin, key-less). The audit's Critical finding #1 went from red to green.",
  lessonLearned:
    "Never put a secret in a VITE_ env var — those are explicitly designed to ship to the client. Server-held secrets + same-origin proxy is the only safe pattern for browser apps.",
  tags: ["security", "api-keys", "gemini", "proxy", "vercel"],
};

const FORCE_LAYOUT_STUCK_LOOP = {
  id: "d3-orgchart-stuck-loop",
  type: "bug",
  title: "D3 force-directed OrgChart simulation never stabilised",
  context:
    "Interactive OrgChart component built for a SaaS client to visualise 5,000+ employee hierarchies (2023).",
  description:
    "OrgChart nodes flew around the canvas indefinitely with no visible 'settled' end-state. CPU pegged at 60% in Chrome task manager; after 10s users assumed the page was broken.",
  rootCause:
    "alphaDecay was too low to actually reach the alphaMin threshold within reasonable wall-clock time, AND velocityDecay was tuned in a way that allowed perpetual momentum rebuild — net result: the timer kept running, alpha never crossed below alphaMin, the 'end' event never fired.",
  resolution:
    "Re-tuned alphaDecay (0.05) and velocityDecay (0.4) empirically on the largest dataset; pinned simulation.stop() to fire after a fixed wall-clock budget (max 3s) regardless of alpha state; added a click-to-pin interaction so users can anchor noisy subtrees manually.",
  lessonLearned:
    "Force-directed layouts have feedback loops — decay constants determine whether the simulation ends in practice. Always set a wall-clock budget fallback, AND verify simulation.end fires on the most expensive configuration you'll ship.",
  tags: ["d3", "visualization", "performance", "orgchart"],
};

const ROUTER_INTENT_DRIFT = {
  id: "router-intent-drift",
  type: "lesson-learned",
  title: "Phrase-keyword ordering breaks the local knowledge router",
  context:
    "This portfolio — the AI's local knowledge intent router (src/lib/knowledge/router.js) was matching the single-word 'resume' to the experience intent because 'resume' was listed there too.",
  description:
    "Recruiters asking 'download resume' got an Experience card with a job-history checklist instead of the Resume download CTA. The order of intent matches mattered invisibly and the failure mode was silent.",
  rootCause:
    "Single-word intents in the router were evaluated before phrase-based intents, so 'resume' inside an experience-related phrase still hit the wrong bucket. This was a router-intent ordering bug, not a knowledge-modelling bug.",
  resolution:
    "Re-ordered every intent so phrase-based keywords (e.g. 'download resume', 'show me your CV') are listed BEFORE single-word intents in `intents[]`. Verified routing with a test phrase-list. The bug is now structurally impossible.",
  lessonLearned:
    "Routing class precedence is invisible to users but critical to correctness. Phrase-based keywords → first, single-word keywords → last, with an explicit comment at the top of the intent array explaining the rule.",
  tags: ["router", "knowledge", "intent", "ux"],
};

const TEST_FIXTURES_REGRESSIONS = {
  id: "test-fixtures-regressions",
  type: "lesson-learned",
  title: "End-to-end fixtures caught a 2% data-accuracy regression at Gilmour",
  context:
    "Gilmour Space, internship role (~2022). I introduced end-to-end test fixtures for the report-generation pipeline after a near-miss accuracy regression almost went out to a customer-detection payload.",
  description:
    "Reports were generated by a pipeline pulling inputs from spreadsheets, running them through templating logic, emitting a PDF + an ops-team notification. A paste-format regression silently changed how 2% of inputs were parsed; that 2% almost reached a customer-detection payload before anyone in QA spotted it.",
  rootCause:
    "No end-to-end fixtures; unit tests covered helpers but not the full pipeline; manual QA was the only gate.",
  resolution:
    "Built a fixture library covering 30 realistic input shapes (clean, messy, edge-case, intentionally-broken-to-trigger-errors) and wired the pipeline to run them on every CI build + nightly full-suite. Regression rate dropped to <0.1% and stayed there for the rest of my internship.",
  lessonLearned:
    "Test fixtures live at the boundaries your users cross. Helpers + unit tests are necessary but never sufficient — also needed: fixtures simulating real input shapes + tests of the full path through your system.",
  tags: ["testing", "fixtures", "gilmour", "ci"],
};

export const bugsAndLessons = {
  source:
    "Production bugs I shipped (and fixed) + broader engineering lessons learned along the way.",
  bullets: {
    bug: [
      VUE3_REACTIVITY_REGRESSION,
      FINDMYLEASE_MAPBOX_PERFORMANCE,
      GEMINI_KEY_LEAK,
      FORCE_LAYOUT_STUCK_LOOP,
    ],
    "lesson-learned": [ROUTER_INTENT_DRIFT, TEST_FIXTURES_REGRESSIONS],
  },
  /**
   * `count(type?)` — returns number of entries of given type
   * ('bug' or 'lesson-learned'); without an argument returns
   * the total entry count.
   */
  count(type) {
    if (!type) {
      return Object.values(this.bullets).reduce(
        (sum, arr) => sum + arr.length,
        0
      );
    }
    return (this.bullets[type] || []).length;
  },
  /**
   * `entries()` — flat ordered list of every entry (bugs first,
   * then lessons), useful for builder roll-ups.
   */
  entries() {
    return [
      ...this.bullets.bug,
      ...this.bullets["lesson-learned"],
    ];
  },
  meta: {
    lastUpdated: "2026-07-13",
    notes:
      "Phase 23 polish - backs the 'questionable commits + bugs I eventually fixed' subtitle. AI surfaces these via the local router; specific phrases route to specific entries via follow-up chips.",
  },
};

export function getBugsAndLessons() {
  return bugsAndLessons;
}

export function getBugsAndLessonsByType(type) {
  return (bugsAndLessons.bullets[type] || []).slice();
}

export function getBugsAndLessonsById(id) {
  return bugsAndLessons.entries().find((e) => e.id === id) || null;
}
