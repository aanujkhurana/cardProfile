export const contextData = {
  profile: {
    summary: `Anuj Khurana is a fullstack developer focused on AI and real-time systems.`,
    location: "Queensland, Australia",
    recentStack: ["Vue 3", "D3.js", "Node.js", "Sanity CMS", "AstraDB", "AWS"],
    currentFocus: "Building AI-powered applications and real-time systems"
  },
  skills: [
    {
      name: "Vue 3",
      description: "Modern JS framework for building reactive user interfaces",
      projects: ["FindMyLease", "OrgChart UI"],
      learned: "Migrated legacy Vue 2 apps and built complex component systems with composition API. Mastered reactive patterns and state management.",
      level: "Advanced"
    },
    {
      name: "D3.js",
      description: "Data visualization library for creating interactive charts and graphs",
      projects: ["OrgChart UI"],
      learned: "Created dynamic organizational chart visualizations with custom animations and interactions.",
      level: "Intermediate"
    },
    {
      name: "Node.js",
      description: "JavaScript runtime for building scalable backend services",
      projects: ["FindMyLease", "Portfolio Chatbot"],
      learned: "Built RESTful APIs, implemented authentication systems, and integrated with various databases.",
      level: "Advanced"
    },
    {
      name: "AWS",
      description: "Cloud platform for scalable application deployment",
      projects: ["FindMyLease"],
      learned: "Deployed fullstack applications using EC2, S3, RDS, and Cognito for authentication.",
      level: "Intermediate"
    },
    {
      name: "AstraDB",
      description: "Vector database for AI and ML applications",
      projects: ["Portfolio Chatbot"],
      learned: "Implemented vector storage for semantic search and AI-powered chat functionality.",
      level: "Beginner"
    }
  ],
  projects: {
    "FindMyLease": {
      description: "A comprehensive real-estate platform connecting tenants and landlords with advanced search capabilities.",
      tech: ["Vue 3", "Node.js", "AWS", "PostgreSQL", "Cognito", "Prisma", "Mapbox"],
      url: "/projects/find-my-lease",
      status: "Completed",
      highlights: [
        "Implemented secure tenant/landlord workflows with role-based authentication",
        "Used Prisma for database modeling and migrations",
        "Integrated Mapbox for location-based property search",
        "Deployed on AWS with auto-scaling and load balancing"
      ],
      challenges: [
        "Handling complex property search filters and geolocation queries",
        "Managing user authentication across multiple user types",
        "Optimizing database queries for large property datasets"
      ]
    },
    "OrgChart UI": {
      description: "Interactive organizational chart visualization with Vue 3 and D3.js integration.",
      tech: ["Vue 3", "D3.js", "TypeScript", "CSS3"],
      url: "/projects/org-chart",
      status: "Completed",
      highlights: [
        "Custom collapsible tree structures with smooth animations",
        "Real-time node search and filtering capabilities",
        "Responsive design that works on mobile and desktop",
        "Converted from JavaScript to TypeScript using script setup syntax"
      ],
      challenges: [
        "Integrating D3.js with Vue's reactive system",
        "Performance optimization for large organizational structures",
        "Creating intuitive user interactions for complex data"
      ]
    },
    "Portfolio Chatbot": {
      description: "AI-powered chatbot that answers questions about Anuj's experience and projects.",
      tech: ["Node.js", "AstraDB", "OpenAI API", "Express"],
      url: "/projects/portfolio-chatbot",
      status: "In Development",
      highlights: [
        "Semantic search using vector embeddings",
        "Context-aware responses about projects and skills",
        "Integration with portfolio website",
        "Structured context system for accurate responses"
      ],
      challenges: [
        "Maintaining context accuracy without hallucinations",
        "Optimizing response time for real-time chat",
        "Balancing detailed information with concise answers"
      ]
    }
  }
};
