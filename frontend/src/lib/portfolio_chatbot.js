contextData.js
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

// systemPrompt.js
import { contextData } from './contextData.js';

export function buildSystemPrompt() {
  const skillSummary = contextData.skills.map(skill => {
    const projLinks = skill.projects
      .map(p => `[${p}](${contextData.projects[p]?.url || '#'})`)
      .join(', ');
    
    return `**${skill.name}** (${skill.level}): ${skill.description}
Used in: ${projLinks}
Experience: ${skill.learned}`;
  }).join('\n\n');

  const projectSummary = Object.entries(contextData.projects).map(([name, project]) => {
    const techStack = project.tech.join(', ');
    const highlights = project.highlights.map(h => `• ${h}`).join('\n');
    const challenges = project.challenges.map(c => `• ${c}`).join('\n');
    
    return `**${name}** (${project.status})
${project.description}
Tech Stack: ${techStack}
Key Achievements:
${highlights}
Challenges Solved:
${challenges}
Learn more: ${project.url}`;
  }).join('\n\n');

  return `You are Anuj Khurana's portfolio assistant - a knowledgeable, friendly guide who helps visitors learn about Anuj's work and experience.

PERSONALITY: Speak naturally and enthusiastically about Anuj's projects. You're helpful, technical when needed, but accessible to non-technical visitors too. Always relate questions back to real projects and concrete examples.

ANUJ'S PROFILE:
${contextData.profile.summary}
📍 Location: ${contextData.profile.location}
🔧 Current Tech Stack: ${contextData.profile.recentStack.join(', ')}
🎯 Focus: ${contextData.profile.currentFocus}

SKILLS & EXPERIENCE:
${skillSummary}

PROJECTS:
${projectSummary}

INSTRUCTIONS:
1. Only answer based on the context provided above
2. When discussing skills, always mention which projects demonstrate that skill
3. Include relevant project links when appropriate
4. If asked about something not in your context, politely redirect to a relevant section or suggest contacting Anuj directly
5. Be specific about technologies and achievements - use the exact details provided
6. If someone asks about a project, highlight both the achievements and the technical challenges solved

EXAMPLE RESPONSES:
- For "What's your experience with Vue?" → Mention Vue 3 usage in FindMyLease and OrgChart UI, the composition API migration, and specific features built
- For "Tell me about your projects" → Give overview of all projects with their unique value propositions
- For "How do you handle authentication?" → Reference the Cognito implementation in FindMyLease with role-based workflows

Remember: You represent Anuj's professional work, so be confident about his abilities while staying accurate to the provided context.`;
}

// chatbot.js - Main chatbot logic
import express from 'express';
import OpenAI from 'openai';
import { buildSystemPrompt } from './systemPrompt.js';

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY
});

// In-memory conversation history (use Redis/DB for production)
const conversations = new Map();

app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationId = 'default' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create conversation history
    let history = conversations.get(conversationId) || [];
    
    // Build messages array
    const messages = [
      { role: 'system', content: buildSystemPrompt() },
      ...history,
      { role: 'user', content: message }
    ];

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;

    // Update conversation history (keep last 10 exchanges)
    history.push(
      { role: 'user', content: message },
      { role: 'assistant', content: aiResponse }
    );
    
    if (history.length > 20) {
      history = history.slice(-20);
    }
    
    conversations.set(conversationId, history);

    res.json({ 
      response: aiResponse,
      conversationId: conversationId
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an error. Please try again.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Portfolio chatbot running on port ${PORT}`);
  console.log(`System prompt generated: ${buildSystemPrompt().length} characters`);
});

// test.js - Simple test script
import { buildSystemPrompt } from './systemPrompt.js';

// Test the system prompt generation
console.log('=== SYSTEM PROMPT TEST ===');
console.log(buildSystemPrompt());
console.log('\n=== PROMPT STATS ===');
console.log(`Length: ${buildSystemPrompt().length} characters`);
console.log(`Estimated tokens: ~${Math.ceil(buildSystemPrompt().length / 4)}`);

// Test questions
const testQuestions = [
  "What are Anuj's main skills?",
  "Tell me about the FindMyLease project",
  "How did you use Vue 3?",
  "What challenges did you face with the org chart?",
  "Where can I see your work?"
];

console.log('\n=== SAMPLE QUESTIONS ===');
testQuestions.forEach((q, i) => {
  console.log(`${i + 1}. ${q}`);
});

// package.json content
const packageJson = {
  "name": "portfolio-chatbot",
  "version": "1.0.0",
  "type": "module",
  "description": "AI-powered portfolio chatbot for Anuj Khurana",
  "main": "chatbot.js",
  "scripts": {
    "start": "node chatbot.js",
    "dev": "node --watch chatbot.js",
    "test": "node test.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "openai": "^4.24.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
};

console.log('\n=== PACKAGE.JSON ===');
console.log(JSON.stringify(packageJson, null, 2));