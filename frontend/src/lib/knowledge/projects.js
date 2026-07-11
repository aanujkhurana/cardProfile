export const projects = [
  {
    name: "Website Summarizer",
    description:
      "Web application integrated OpenAI model, facilitating effortless website summarization with a single click. Implemented advanced features of Redux Toolkit to optimize data fetching and management.",
    repo: "https://github.com/aanujkhurana/AI_ArticleSummary-React",
    tech: ["React", "TypeScript", "Node.js", "Rapid API"],
    highlights: [
      "Integrated OpenAI API for content summarization",
      "Used Redux Toolkit for scalable state management",
      "Built sleek one-click interface for summarizing URLs",
    ],
    role: "Fullstack Developer",
    collaboration: "Solo project",
  },
  {
    name: "FindMyLease",
    description:
      "Enterprise-grade rental management platform with secure auth, map-based search, and Prisma ORM.",
    repo: "https://github.com/anujkhurana/findmylease",
    tech: ["Vue 3", "Node.js", "AWS Cognito", "Mapbox", "PostgreSQL", "Prisma", "API Gateway"],
    highlights: [
      "Implemented role-based authentication with AWS Cognito",
      "Integrated map-based filtering and search using Mapbox",
      "Optimized data models with Prisma and RDS",
    ],
    role: "Fullstack Developer",
    collaboration: "Solo project",
  },
  {
    name: "OrgChart UI",
    description:
      "Interactive organizational chart editor built with Vue 3 and D3.js for complex data visualization.",
    repo: "https://github.com/aanujkhurana/TreeChart-Vue.js",
    tech: ["Vue 3", "D3.js", "TypeScript", "Pinia"],
    highlights: [
      "Created custom collapsible tree layouts and animated transitions",
      "Built search and node interaction features",
      "Migrated codebase from JavaScript to TypeScript",
    ],
    role: "Frontend Developer",
    collaboration: "Solo project",
  },
  {
    name: "Portfolio Chatbot",
    description:
      "LLM-powered chatbot integrated into portfolio site for contextual Q&A about skills and projects.",
    repo: "https://github.com/aanujkhurana/cardProfile",
    tech: ["LangChain", "OpenAI", "TypeScript", "Node.js"],
    highlights: [
      "Implemented context-aware retrieval with AstraDB",
      "Structured prompt builder for dynamic AI responses",
      "Streaming chat UX in Vue component",
    ],
    role: "Fullstack Developer",
    collaboration: "Solo project",
  },
];

export function getProjectByName(name) {
  const lower = name.toLowerCase();
  return projects.find((p) => p.name.toLowerCase().includes(lower));
}

export function getProjectsByTech(tech) {
  const lower = tech.toLowerCase();
  return projects.filter((p) =>
    p.tech.some((t) => t.toLowerCase().includes(lower))
  );
}
