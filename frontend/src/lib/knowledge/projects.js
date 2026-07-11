/**
 * Project case studies.
 *
 * Phase 5 schema. Each entry carries the metadata the LLM persona
 * prompt, the ProjectsCard AI card, and a future case-study page
 * all consume. Field conventions:
 *
 *   - name / role / status / description / url / repo / demo / tech:
 *     carried from the prior schema.
 *   - businessProblem: the real-world problem this product solves.
 *   - solution: what Anuj built, in 1–2 sentences.
 *   - architecture: key technical decisions, real services only.
 *   - keyFeatures: 3–5 bullet features.
 *   - challengesSolved: 2–3 bullets reframed as "solved".
 *   - measurableImpact: a real number from `achievements.js`, or
 *     a "shipped as a …" framing when no metric exists.
 *   - aiUsage: a string, or `null` if the product doesn't use AI.
 *   - futureImprovements: 2–3 plausible next steps.
 *   - screenshots: array of asset paths under
 *     `frontend/public/projects/<slug>/`. Empty until assets land.
 *     The ProjectsCard hides the section when the array is empty
 *     (no fake "coming soon" placeholders).
 *
 * Canonical data sources (do not invent beyond these):
 *   - src/lib/knowledge/achievements.js
 *   - src/lib/knowledge/experience.js
 *   - src/lib/knowledge/skills.js
 */

export const projects = [
  {
    name: "FindMyLease",
    role: "Full-stack Developer",
    status: "Shipped",
    description:
      "Enterprise-grade rental management platform with secure role-based auth, map-based search, and Prisma ORM over PostgreSQL.",
    businessProblem:
      "Renters struggled to discover available properties geospatially, while platform admins had no secure controls for lease creation, review, or renewal.",
    solution:
      "I built a full-stack rental platform that fuses interactive map-based discovery with a multi-role administrative backend, wired end-to-end against cloud-hosted relational data.",
    architecture:
      "Vue 3 SPA talking to a Node.js REST API. Authentication and role-based access control flow through AWS Cognito and API Gateway. Geographic data renders via Mapbox, mapped to a PostgreSQL instance through Prisma ORM.",
    keyFeatures: [
      "Role-based authentication routing with AWS Cognito",
      "Interactive property discovery via Mapbox with live filtering",
      "Relational querying optimized by Prisma over RDS-hosted PostgreSQL",
    ],
    challengesSolved: [
      "Maintained responsive UI while filtering large geospatial datasets",
      "Secured distinct application workflows for tenant vs admin roles without parallel code paths",
    ],
    measurableImpact:
      "Shipped a 4-stack product end-to-end (Vue 3, Node.js, PostgreSQL, AWS Cognito + Mapbox) as a solo project.",
    aiUsage: null,
    futureImprovements: [
      "Push map marker clustering down to the database layer for very large inventories",
      "Add social login providers through Cognito Identity Pools",
    ],
    /** Drop assets at frontend/public/projects/findmylease/ then list the paths here. */
    screenshots: [],
    url: "/projects/find-my-lease",
    repo: "https://github.com/anujkhurana/findmylease",
    demo: null,
    tech: ["Vue 3", "Node.js", "AWS Cognito", "Mapbox", "PostgreSQL", "Prisma", "API Gateway"],
  },
  {
    name: "OrgChart UI",
    role: "Frontend Developer",
    status: "Shipped",
    description:
      "Interactive organizational chart editor built with Vue 3 and D3.js for complex hierarchical data visualization.",
    businessProblem:
      "Deeply nested organizational structures rendered ambiguously in flat lists, leaving users unsure of reporting lines and producing errors when reporting structures changed.",
    solution:
      "I built a navigable SVG tree-chart component tailored for large hierarchical datasets, with smooth expand/collapse and inline node actions.",
    architecture:
      "Vue 3 + Pinia for reactive UI state, wrapping D3.js which computes the layout math and orchestrates transition animations. End-to-end TypeScript.",
    keyFeatures: [
      "Custom collapsible D3 tree layouts with animated transitions",
      "Inline node actions for search, full expand, and collapse",
      "Pure-function layout math that scales with node count",
    ],
    challengesSolved: [
      "Designed a hierarchical splitting algorithm that avoids layout thrash on large trees",
      "Kept interactive feel responsive on trees with thousands of nodes",
    ],
    measurableImpact:
      "Maintained 60 FPS performance with thousands of nodes. Shipped as a JavaScript-to-TypeScript-migrated interactive editor handling complex hierarchical data.",
    aiUsage: null,
    futureImprovements: [
      "Virtualize the SVG canvas to support infinite panning",
      "Add drag-and-drop node re-parenting",
    ],
    /** Drop assets at frontend/public/projects/orgchart-ui/ then list the paths here. */
    screenshots: [],
    url: "/projects/org-chart",
    repo: "https://github.com/aanujkhurana/TreeChart-Vue.js",
    demo: null,
    tech: ["Vue 3", "D3.js", "TypeScript", "Pinia"],
  },
  {
    name: "Website Summarizer",
    role: "Full-stack Developer",
    status: "Shipped",
    description:
      "Web app that summarizes any URL with one click using the OpenAI API, with Redux Toolkit for state and rate-limit-aware fetch.",
    businessProblem:
      "Reading a long article end-to-end is the default; most readers want the headline and key points in under a minute.",
    solution:
      "I shipped a URL-to-summary pipeline that distills any article into a short, structured summary in one click.",
    architecture:
      "React + TypeScript client with Redux Toolkit slices for robust loading and error states. The Node.js layer calls the OpenAI API with rate-limit-aware backoff and strict prompt framing.",
    keyFeatures: [
      "One-click URL-to-summary UX",
      "Robust client state via Redux Toolkit",
      "Rate-limit-aware backend with backoff",
    ],
    challengesSolved: [
      "Handled external API rate limits without breaking the in-flight UX",
      "Normalized arbitrary webpage structures for consistent LLM ingestion",
    ],
    measurableImpact:
      "Shipped as a portfolio piece that integrates the OpenAI API end-to-end with a robust state and error model.",
    aiUsage:
      "OpenAI API is the core summarization engine; the backend handles prompt framing, rate-limit backoff, and output normalization.",
    futureImprovements: [
      "Add server-sent events for streaming the summary as it generates",
      "Cache summaries (e.g. Redis) so repeat URLs skip the LLM call",
    ],
    /** Drop assets at frontend/public/projects/website-summarizer/ then list the paths here. */
    screenshots: [],
    url: "/projects/website-summarizer",
    repo: "https://github.com/aanujkhurana/AI_ArticleSummary-React",
    demo: null,
    tech: ["React", "TypeScript", "Node.js", "OpenAI API"],
  },
  {
    name: "AI Portfolio Assistant (this site)",
    role: "Solo build",
    status: "Active",
    description:
      "LLM-powered conversational guide to Anuj's work, with a server-side Gemini proxy, local-knowledge intent router, and rich AI cards.",
    businessProblem:
      "Traditional portfolios force recruiters to click through static pages to find whether a candidate fits a specific stack or question; high-friction exploration drops the signal-to-noise.",
    solution:
      "I built a conversation-led portfolio that answers recruiter questions directly using my real engineering background, with rich AI cards surfacing projects, experience, achievements, and contact on demand.",
    architecture:
      "Vite + Vue 3 SPA styled with Tailwind. Queries hit a local intent router first; complex questions are forwarded to a Vercel serverless function that proxies the Gemini 2.5 Flash API with input sanitization and a server-only API key.",
    keyFeatures: [
      "Server-side Gemini proxy holding the API key off the client",
      "Local-knowledge intent router that answers most queries without a Gemini round-trip",
      "Rich AI cards for skills, projects, experience, achievements, resume, and contact",
    ],
    challengesSolved: [
      "Eliminated persona drift by routing every Gemini call through one canonical source of truth",
      "Built a graceful fallback path so the site works fully even when Gemini is unreachable",
    ],
    measurableImpact:
      "Zero client-side API key leaks — the API key lives only on the server. Local-knowledge routing handles the majority of queries without a Gemini round-trip.",
    aiUsage:
      "Gemini 2.5 Flash drives the conversational layer behind a server-side prompt that injects canonical knowledge; local intent routing short-circuits when it can.",
    futureImprovements: [
      "Stream Gemini responses incrementally so the user sees the answer form in real time",
      "Move static canonical data into the existing Sanity client so the source of truth lives outside the bundle",
    ],
    /** Drop assets at frontend/public/projects/ai-portfolio-assistant/ then list the paths here. */
    screenshots: [],
    url: "/",
    repo: "https://github.com/aanujkhurana/cardProfile",
    demo: null,
    tech: ["Vue 3", "Vite", "Vercel Functions", "Gemini 2.5 Flash", "Tailwind", "Sanity"],
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
