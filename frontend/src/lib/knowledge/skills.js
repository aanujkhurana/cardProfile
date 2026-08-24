/**
 * Skills + technical toolkit.
 *
 * `learned` and `projects` are first-class on each skill so the system
 * prompt and AI cards can paint the same picture from one source.
 * The legacy contextData.js duplicated this and has now been retired.
 */

export const skills = [
  {
    name: "Vue.js & Composition API",
    level: "Advanced",
    category: "Frontend",
    description:
      "Led migration from Vue 2 to Vue 3, implemented modular components with Composition API in multiple production apps.",
    learned:
      "2+ years building SPAs with scalable state management (Pinia), lazy routes, and performance tuning.",
    projects: ["FindMyLease", "OrgChart UI", "GoDesta Migration"],
  },
  {
    name: "Data Visualization",
    level: "Intermediate",
    category: "Frontend",
    description:
      "Built dynamic tree-chart visualizations for complex hierarchical data at Gilmour Space and in the OrgChart UI project.",
    learned:
      "A couple of production D3 projects, including satellite-assembly data and reusable component layouts.",
    projects: ["OrgChart UI"],
  },
  {
    name: "Node.js & Express",
    level: "Advanced",
    category: "Backend",
    description:
      "Built back-end APIs, microservices, and serverless functions for production apps including FindMyLease and tooling for this portfolio.",
    learned:
      "Years building REST and GraphQL services with Express, deployed on AWS Lambda, Vercel Functions, and standalone Docker containers.",
    projects: ["FindMyLease", "this portfolio"],
  },
  {
    name: "LangChain & AI Chatbots",
    level: "Intermediate",
    category: "AI",
    description:
      "Developed LLM-powered portfolio assistant using LangChain-style prompt engineering, structured context injection, and Gemini API integration.",
    learned:
      "Hands-on with retrieval-augmented patterns, prompt templating, and streaming UI for chat experiences.",
    projects: ["this portfolio"],
  },
];

export const technicalSkills = {
  programming: ["Python", "Swift", "JavaScript", "TypeScript", "PHP", "SQL", "HTML", "CSS"],
  frameworks: ["Vue", "React", "Laravel", "Express.js", "Node.js", "Flutter", "React Native", "Tailwind"],
  databases: ["PostgreSQL", "MySQL", "MongoDB"],
  devOps: ["Docker", "Kubernetes", "AWS", "GitHub", "GitLab", "Jira", "CI/CD", "Postman"],
  other: ["RESTful APIs", "GraphQL", "Mapbox", "Figma", "Linux CLI"],
};

export function getSkillsByCategory() {
  const grouped = {};
  for (const skill of skills) {
    if (!grouped[skill.category]) grouped[skill.category] = [];
    grouped[skill.category].push(skill);
  }
  return grouped;
}

export function getSkillByName(name) {
  if (!name) return null;
  const lower = name.toLowerCase();
  return skills.find((s) => s.name.toLowerCase().includes(lower)) || null;
}
