/**
 * Project case studies.
 *
 * Each entry carries enough metadata for the LLM persona prompt,
 * the ProjectsCard AI card, and a future detail page (Phase 6 cards).
 *
 * `url` is an optional in-site case-study route; `demo` is an optional
 * live demo link; `repo` is the canonical GitHub URL.
 * The system prompt and the AI card both reference these so we
 * terminate the legacy contextData/<projects> duplicate that lived
 * in src/lib/chatbox/contextData.js.
 */

export const projects = [
  {
    name: "FindMyLease",
    role: "Full-stack Developer",
    status: "Shipped",
    description:
      "Enterprise-grade rental management platform with secure role-based auth, map-based search, and Prisma ORM over PostgreSQL.",
    url: "/projects/find-my-lease",
    repo: "https://github.com/anujkhurana/findmylease",
    demo: null,
    tech: ["Vue 3", "Node.js", "AWS Cognito", "Mapbox", "PostgreSQL", "Prisma", "API Gateway"],
    highlights: [
      "Implemented role-based authentication with AWS Cognito",
      "Integrated map-based filtering and search with Mapbox",
      "Optimized data models with Prisma and RDS",
    ],
    challenges: [
      "Ensuring real-time filtering performance with large datasets",
      "Managing secure multi-role workflows in Cognito",
    ],
  },
  {
    name: "OrgChart UI",
    role: "Frontend Developer",
    status: "Shipped",
    description:
      "Interactive organizational chart editor built with Vue 3 and D3.js for complex hierarchical data visualization.",
    url: "/projects/org-chart",
    repo: "https://github.com/aanujkhurana/TreeChart-Vue.js",
    demo: null,
    tech: ["Vue 3", "D3.js", "TypeScript", "Pinia"],
    highlights: [
      "Custom collapsible tree layouts with animated transitions",
      "Search, expand/collapse, and inline node interaction",
      "Migrated the codebase from JavaScript to TypeScript",
    ],
    challenges: [
      "Designing efficient tree-splitting algorithms",
      "Maintaining 60 FPS with thousands of nodes",
    ],
  },
  {
    name: "Website Summarizer",
    role: "Full-stack Developer",
    status: "Shipped",
    description:
      "Web app that summarizes any URL with one click using the OpenAI API, with Redux Toolkit for state and rate-limit-aware fetch.",
    url: "/projects/website-summarizer",
    repo: "https://github.com/aanujkhurana/AI_ArticleSummary-React",
    demo: null,
    tech: ["React", "TypeScript", "Node.js", "OpenAI API"],
    highlights: [
      "Integrated OpenAI API for URL summarization",
      "Redux Toolkit for scalable state management",
      "Polished one-click URL-to-summary UX",
    ],
    challenges: [
      "Managing rate limits from external APIs",
      "Maintaining consistent formatting across varied page structures",
    ],
  },
  {
    name: "AI Portfolio Assistant (this site)",
    role: "Solo build",
    status: "Active",
    description:
      "LLM-powered conversational guide to Anuj's work, with a server-side Gemini proxy, local-knowledge intent router, and rich AI cards.",
    url: "/",
    repo: "https://github.com/aanujkhurana/cardProfile",
    demo: null,
    tech: ["Vue 3", "Vite", "Vercel Functions", "Gemini 2.5 Flash", "Tailwind", "Sanity"],
    highlights: [
      "Server-side Gemini proxy holding the API key server-side (no client leak)",
      "Local-knowledge intent router that answers most queries instantly",
      "Rich AI cards for skills, projects, experience, contact",
    ],
    challenges: [
      "Avoiding persona drift across multiple data sources",
      "Streaming UX with graceful fallback when Gemini is unreachable",
    ],
  },
];

export function getProjectByName(name) {
  if (!name) return null;
  const lower = name.toLowerCase();
  return projects.find((p) => p.name.toLowerCase().includes(lower)) || null;
}

export function getProjectsByTech(tech) {
  if (!tech) return [];
  const lower = tech.toLowerCase();
  return projects.filter((p) =>
    p.tech.some((t) => t.toLowerCase().includes(lower))
  );
}
