/**
 * Resume metadata.
 *
 * Drives:
 *   - the `resume` intent in knowledge/router.js so AI queries like
 *     "download resume", "show me your CV", "can I get your resume?"
 *     produce a ResumeCard (Phase 6 component, registered later).
 *   - a "Download Resume" CTA in the ContactCard once Phase 7 lands.
 *
 * Asset note:
 *   `fileUrl` resolves under /public so the PDF should be dropped at
 *   `frontend/public/resume/Anuj_Khurana_Resume.pdf`. Until then the
 *   router still surfaces the structured summary + highlights, so the
 *   feature degrades gracefully.
 */

export const resume = {
  fullName: "Anuj Khurana",
  title: "Full Stack Developer",
  fileName: "Anuj_Khurana_Resume.pdf",
  fileUrl: "/resume/Anuj_Khurana_Resume.pdf",
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
