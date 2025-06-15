export const contextData = {
  profile: {
    name: "Anuj Khurana",
    title: "Full Stack Developer",
    summary: `I’m a Full Stack Developer with 2+ years of experience building web applications with a strong focus on frontend performance
              and user experience. I’ve led frontend migrations, optimized applications for speed and accessibility, and built clean,
              responsive interfaces. I’m comfortable working across the stack, with a solid foundation in data structures and system design.
              I enjoy solving real-world problems with code and am always learning and love picking up new skills`,
    location: "Queensland, Australia",
    contact: {
      phone: "+61 48 12 50 988",
      email: "aanujkhurana@gmail.com",
      website: "/",
      linkedin: "https://linkedin.com/in/aanujkhurana",
      github: "https://github.com/anujkhurana"
    },
    currentFocus: [
      "AI & LLM App Engineering",
      "Vue 3 + TypeScript",
      "Real-time Systems (WebRTC)"
    ],
    pages: {
      home: "/",
      projects: "/projects",
      experience: "/experience",
      contact: "/contact"
    },
    TechStack: ["Python", "Vue 3", "Typescript", "Node.js", "Express.js", "LangChain", "PostgreSQL", "AWS", "MongoDB", "Javascript", "HTML", "CSS"],
  },

  skills: [
    {
      name: "Vue.js & Composition API",
      level: "Advanced",
      description: "Led migration from Vue 2 to Vue 3, implemented modular components with Composition API in multiple projects.",
      projects: ["FindMyLease", "OrgChart UI", "GoDesta Migration"],
      contextTags: ["frontend", "vue", "composition api"],
      learned: "2+ years building SPAs with scalable state management (Pinia) and performance tuning."
    },
    {
      name: "Data Visualization",
      level: "Intermediate",
      description: "Created dynamic tree chart visualizations for complex hierarchical data at Gilmour and OrgChart UI.",
      projects: ["Reflection Tree Chart", "OrgChart UI"],
      contextTags: ["datavisual", "frontend", "dynamic", "d3.js"]
    },
    {
      name: "Node.js & Express",
      level: "Advanced",
      description: "Built back-end APIs, microservices, and lambda functions for multiple applications, including FindMyLease and personal tools.",
      projects: ["Express Microservices", "Portfolio backend", "TreeChart API"],
      contextTags: ["backend", "api", "node.js", "express"]
    },
    {
      name: "LangChain & AI Chatbots",
      level: "Intermediate",
      description: "Developed AI-powered portfolio chatbot using LangChain vector store for context-aware Q&A.",
      projects: ["Portfolio Chatbot"],
      contextTags: ["ai", "langchain", "vector retrieval", "astradb"]
    }
  ],

  projects: {
    WebsiteSummarizer: {
      name: "Website Summarizer Open AI Web App",
      description: "Web application integrated Open AI model via, facilitating effortless website summarization with a single click. Implemented advanced features of Redux Toolkit to optimize data fetching and management.",
      url: "/projects/website-summarizer",
      repo: "https://github.com/aanujkhurana/AI_ArticleSummary-React",
      tech: ["React", "Typescript", "Node.js", "Rapid API"],
      highlights: [
        "Integrated OpenAI API for content summarization",
        "Used Redux Toolkit for scalable state management",
        "Built sleek one-click interface for summarizing URLs"
      ],
      challenges: [
        "Managing rate limits from external APIs",
        "Maintaining consistent formatting across varying webpage structures"
      ],
      role: "Fullstack Developer",
      collaboration: "Solo project",
      contextTags: ["ai", "openai", "summarizer"]
    },
    FindMyLease: {
      name: "FindMyLease",
      description: "Enterprise-grade rental management platform with secure auth, map-based search, and Prisma ORM.",
      url: "/projects/find-my-lease",
      repo: "https://github.com/anujkhurana/findmylease",
      tech: ["Vue 3", "Node.js", "AWS Cognito", "Mapbox", "PostgreSQL", "Prisma", "API Gateway"],
      highlights: [
        "Implemented role-based authentication with AWS Cognito",
        "Integrated map-based filtering and search using Mapbox",
        "Optimized data models with Prisma and RDS"
      ],
      challenges: [
        "Ensuring real-time filtering performance with large datasets",
        "Managing secure multi-role workflows in Cognito"
      ],
      role: "Fullstack Developer",
      collaboration: "Solo project",
      contextTags: ["real estate", "mapbox", "auth"]
    },
    "OrgChart UI": {
      name: "OrgChart UI",
      description: "Interactive organizational chart editor built with Vue 3 and D3.js for complex data visualization.",
      url: "/projects/org-chart",
      repo: "https://github.com/aanujkhurana/TreeChart-Vue.js",
      tech: ["Vue 3", "D3.js", "TypeScript", "Pinia"],
      highlights: [
        "Created custom collapsible tree layouts and animated transitions",
        "Built search and node interaction features",
        "Migrated codebase from JavaScript to TypeScript"
      ],
      challenges: [
        "Designing efficient tree-splitting algorithms",
        "Maintaining performance with large node counts"
      ],
      role: "Frontend Developer",
      collaboration: "Solo project",
      contextTags: ["d3.js", "vue", "typescript"]
    },
    "Portfolio Chatbot": {
      name: "Portfolio Chatbot",
      description: "LLM-powered chatbot integrated into portfolio site for contextual Q&A about skills and projects.",
      url: "/projects/chatbot",
      repo: "https://github.com/aanujkhurana/cardProfile",
      tech: ["LangChain", "OpenAI", "typescript", "Node.js"],
      highlights: [
        "Implemented context-aware retrieval with AstraDB",
        "Structured prompt builder for dynamic AI responses",
        "Streaming chat UX in Vue component"
      ],
      challenges: [
        "Balancing prompt size and relevance",
        "Ensuring consistent conversational context"
      ],
      role: "Fullstack Developer",
      collaboration: "Solo project",
      contextTags: ["ai", "chatbot", "contextual"]
    }
  },

  experience: [
    {
      role: "Front-End Developer",
      company: "GoDesta",
      location: "Brisbane, Australia",
      period: "May 2024 – Present",
      responsibilities: [
        "Led migration from Vue 2 to Vue 3, improving performance by 15%",
        "Optimized state management with Pinia and real-time updates via WebSockets",
        "Implemented comprehensive QA and UAT processes"
      ],
      contextTags: ["vue","Typescript", "migration", "websockets", "pinia", "frontend development"]
    },
    {
      role: "Software Developer Intern",
      company: "Gilmour Space Technologies",
      location: "Gold Coast, Australia",
      period: "Jul 2023 – Oct 2023",
      responsibilities: [
        "Built dynamic Tree chart for satellite assembly data using D3 and Vue",
        "Enhanced UX and reduced errors by 2%"
      ],
      contextTags: ["internship", "vue.js", "typescript", "d3.js", "tailwind css", "datavisual"]
    }
  ],

  education: [
    {
      degree: "Master of Information Technology",
      specialization: "Software Development and Support",
      institution: "Griffith University",
      location: "Gold Coast, Australia",
      year: 2024
    },
    {
      degree: "Bachelor of Arts",
      institution: "GGSIP University",
      location: "Delhi, India",
      year: 2019
    }
  ],

  certifications: [
    { name: "Back End Development and API", issuer: "FreeCodeCamp", year: 2024 },
    { name: "Python", issuer: "HackerRank", year: 2024 },
    { name: "SQL", issuer: "HackerRank", year: 2023 },
    { name: "User Experience Essentials", issuer: "Udemy", year: 2019 }
  ],

  technicalSkills: {
    programming: ["Python", "Swift", "JavaScript", "TypeScript", "PHP", "SQL", "HTML", "CSS"],
    frameworks: ["Vue", "React", "Laravel", "Express.js", "Node.js", "Flutter", "React Native", "Tailwind"],
    databases: ["PostgreSQL", "MySQL", "MongoDB"],
    devOps: ["Docker", "Kubernetes", "AWS", "GitHub", "GitLab", "Jira", "CI/CD", "Postman"],
    other: ["RESTful APIs", "GraphQL", "Mapbox", "Figma", "Linux CLI"]
  }
};
