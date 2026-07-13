/**
 * Resume metadata.
 *
 * Drives:
 *   - the `resume` intent in knowledge/router.js so AI queries like
 *     "download resume", "show me your CV", "can I get your resume?"
 *     produce a ResumeCard (Phase 6 component, registered later).
 *   - a "Download Resume" CTA in the ContactCard once Phase 7 lands.
 *
 * ⚠️  FILE-EXISTS WORKFLOW — READ BEFORE FLIPPING fileExists
 * ─────────────────────────────────────────────────────────────
 *  Phase 26 — the resume PDF now lives at the project-root of the
 *  public/ folder (one file, no subdirectory) and is downloaded via
 *  a GitHub raw URL pinned to the current feature branch.
 *
 *  Primary deliverable path (per user's explicit destination):
 *      frontend/public/resume.pdf
 *  Vite copies everything in public/ verbatim to dist/, so the same
 *  file is also reachable locally on any deploy:
 *      http://localhost:5173/resume.pdf (after `npm run dev`)
 *      https://<your-domain>/resume.pdf (after deploy)
 *
 *  The PRIMARY download link in the AI chat's ResumeCard surfaces
 *  the GitHub raw URL by design (user's deliberate choice for the
 *  "use the GitHub download link" requirement — stable on GitHub
 *  without depending on the deployed site):
 *      https://raw.githubusercontent.com/aanujkhurana/cardProfile/
 *      feature/ai-portfolio-production-upgrade/frontend/public/resume.pdf
 *
 *  Until the asset is uploaded, KEEP `fileExists: false` — the
 *  ResumeCard then hides the download link and offers a mailto
 *  fallback ("PDF being refreshed — ping me for the latest copy").
 *
 *  ⚠️  Do NOT flip `fileExists` to `true` until you have:
 *      1. Dropped resume.pdf into frontend/public/
 *      2. Confirmed the raw URL returns 200 by running either:
 *           curl -I https://raw.githubusercontent.com/aanujkhurana/cardProfile/feature/ai-portfolio-production-upgrade/frontend/public/resume.pdf
 *               (expect: HTTP/2 200)
 *           curl -I http://localhost:5173/resume.pdf
 *               (after `npm run dev`)
 *
 *  Flipping the flag without the asset re-introduces the original 404
 *  for every recruiter who clicks the AI's primary CTA — the exact
 *  first-impression failure the production audit was trying to fix.
 */

export const resume = {
  fullName: "Anuj Khurana",
  title: "Full Stack Developer",
  fileName: "resume.pdf",
  fileUrl:
    "https://raw.githubusercontent.com/aanujkhurana/cardProfile/feature/ai-portfolio-production-upgrade/frontend/public/resume.pdf",
  /**
   * Human-readable PDF size, e.g. "192 KB".
   * Set to the real measured value (the actual bytes / 1024) at
   * the same time you flip `fileExists` to true — do not invent a
   * number. ResumeCard.vue's `<span v-if="data.fileSize">` only
   * renders this meta bullet when non-null.
   */
  fileSize: "192 KB",
  fileExists: true,
  lastUpdated: "2026-07-01",
  summary:
    "Full Stack Developer with 3+ years building production web applications — frontend-heavy, comfortable across the stack, and actively deepening AI/LLM engineering. Last updated to reflect my current focus on AI portfolio engineering and Vue 3 + TypeScript work at GoDesta.",
  highlights: [
    "Led Vue 2 → Vue 3 migration at GoDesta with measured 15% performance improvement.",
    "Shipped FindMyLease (Vue 3 + AWS Cognito + Prisma + Mapbox) end-to-end.",
    "Built LangChain + Gemini-powered conversational portfolio assistant with server-side proxy.",
    "Shipped interactive D3 + Vue 3 OrgChart UI for hierarchical data.",
    "Reduced report-generation errors by 2% during internship at Gilmour Space.",
  ],
  contact: {
    email: "aanujkhurana@gmail.com",
    linkedin: "https://linkedin.com/in/aanujkhurana",
    github: "https://github.com/anujkhurana",
  },
};

export function getResume() {
  return resume;
}
