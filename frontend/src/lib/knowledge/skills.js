export const skills = [
  {
    name: "Vue.js & Composition API",
    level: "Advanced",
    category: "Frontend",
    description:
      "Led migration from Vue 2 to Vue 3, implemented modular components with Composition API in multiple projects.",
    projects: ["FindMyLease", "OrgChart UI", "GoDesta Migration"],
    learned: "2+ years building SPAs with scalable state management (Pinia) and performance tuning.",
  },
  {
    name: "Data Visualization",
    level: "Intermediate",
    category: "Frontend",
    description:
      "Created dynamic tree chart visualizations for complex hierarchical data at Gilmour and OrgChart UI.",
    projects: ["Reflection Tree Chart", "OrgChart UI"],
  },
  {
    name: "Node.js & Express",
    level: "Advanced",
    category: "Backend",
    description:
      "Built back-end APIs, microservices, and lambda functions for multiple applications, including FindMyLease and personal tools.",
    projects: ["Express Microservices", "Portfolio backend", "TreeChart API"],
  },
  {
    name: "LangChain & AI Chatbots",
    level: "Intermediate",
    category: "AI",
    description:
      "Developed AI-powered portfolio chatbot using LangChain vector store for context-aware Q&A.",
    projects: ["Portfolio Chatbot"],
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
