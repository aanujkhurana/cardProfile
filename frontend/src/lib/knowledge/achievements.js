/**
 * Achievements: quantified wins, awards, and milestones.
 *
 * Drives:
 *   - the `achievements` intent in knowledge/router.js so AI queries
 *     like "what impact have you made?", "any awards?", "highlights"
 *     produce a structured response.
 *   - a future AchievementCard component (Phase 8 — rich UI cards).
 *
 * Shape (kept deliberately consistent so the card can render uniformly):
 *   - id: stable slugs the router can reference
 *   - title: short headline
 *   - metric: quantified outcome, e.g. "+15% perf"
 *   - context: where / why (1–2 lines)
 *   - period: 'May 2024 – Present' style
 *   - tags: typed so the router can filter ("performance", "ai", etc.)
 */

export const achievements = [
  {
    id: "vue3-migration-perf",
    title: "Led Vue 2 → Vue 3 migration at GoDesta",
    metric: "+15% performance",
    context:
      "Owned the migration end-to-end across a production storefront, hardening the build, fixing reactivity gotchas, and validating the 15% speed-up against Lighthouse and Core Web Vitals.",
    period: "May 2024 – Present",
    tags: ["frontend", "vue", "performance", "leadership"],
  },
  {
    id: "error-reduction-gilmour",
    title: "Reduced report-generation errors at Gilmour Space",
    metric: "−2% user errors",
    context:
      "Owned UX edge cases in the satellite-assembly tree chart during internship; ship-tested fixes for ambiguous label rendering and out-of-order expansion.",
    period: "Jul 2023 – Oct 2023",
    tags: ["frontend", "ux", "datavisual", "internship"],
  },
  {
    id: "findmylease-ship",
    title: "Shipped FindMyLease end-to-end",
    metric: "4-stack product",
    context:
      "Vue 3 + Node.js + PostgreSQL + AWS Cognito + Mapbox. Real-time map filtering, multi-role auth, and Prisma ORM over RDS.",
    period: "Independent build",
    tags: ["fullstack", "vue", "aws", "shipping"],
  },
  {
    id: "ai-portfolio-assistant",
    title: "Built server-side LLM portfolio proxy",
    metric: "0 client-side key leaks",
    context:
      "Vercel serverless function holding the Gemini API key server-side, with input sanitization, role allowlist, and a graceful local-knowledge fallback.",
    period: "2026",
    tags: ["ai", "security", "shipping", "leadership"],
  },
  {
    id: "mit-griffith",
    title: "Master of IT, Griffith University",
    metric: "Specialization in Software Development",
    context:
      "Master's-level coursework in distributed systems, software engineering practice, and applied AI.",
    period: "Graduated 2024",
    tags: ["education"],
  },
  {
    id: "fcc-backend",
    title: "Back End Development and APIs — FreeCodeCamp",
    metric: "Certified 2024",
    context:
      "Project-based certification covering Node.js, Express, MongoDB, and REST API design patterns.",
    period: "2024",
    tags: ["certification", "backend"],
  },
];

export function getAchievements() {
  return achievements;
}

export function getAchievementsByTag(tag) {
  if (!tag) return achievements;
  const lower = tag.toLowerCase();
  return achievements.filter((a) =>
    a.tags.some((t) => t.toLowerCase().includes(lower))
  );
}
