/**
 * Portfolio intent router.
 *
 * Lightweight keyword matching. The router runs before we ever call
 * Gemini: anything that can be answered locally renders as a rich AI
 * card in <1s; anything else is forwarded to Gemini for reasoning.
 *
 * Order matters: `RULES` is scanned top-down and the first keyword
 * hit wins. Phrase-based keywords come before single words so
 * "download resume" doesn't get caught by the experience intent.
 */

import {
  profile,
  skills,
  technicalSkills,
  getSkillsByCategory,
  projects,
  experience,
  education,
  certifications,
  contact,
  faq,
  resume,
  achievements,
} from "../knowledge/index.js";

/* ------------------------------------------------------------------ */
/*  Intent detection                                                   */
/* ------------------------------------------------------------------ */

const INTENT_RULES = [
  {
    intent: "resume",
    // Specific phrases that should always route to the resume card.
    // Single-word "resume" stays in the experience intent so that
    // "what does your resume show about your experience?" still hits
    // the work-history card.
    keywords: [
      "download resume",
      "download cv",
      "show resume",
      "show cv",
      "view resume",
      "view cv",
      "view my resume",
      "send resume",
      "send cv",
      "resume pdf",
      "cv pdf",
      "your resume pdf",
      "get resume",
      "get cv",
      "your resume",
    ],
  },
  {
    intent: "achievements",
    keywords: [
      "achievement",
      "achievements",
      "key wins",
      "measurable",
      "quantified",
      "impact",
      "results",
      "outcomes",
      "milestones",
    ],
  },
  {
    intent: "skills",
    keywords: [
      "skill",
      "technology",
      "technologies",
      "tech stack",
      "techstack",
      "stack",
      "proficient",
      "good at",
      "know",
    ],
  },
  {
    intent: "projects",
    keywords: [
      "project",
      "built",
      "work",
      "portfolio",
      "app",
      "application",
      "product",
    ],
  },
  {
    intent: "experience",
    keywords: [
      "experience",
      "work history",
      "resume",
      "career",
      "job",
      "employed",
      "company",
      "worked at",
    ],
  },
  {
    intent: "education",
    keywords: [
      "education",
      "degree",
      "university",
      "college",
      "studied",
      "graduated",
      "school",
      "master",
      "bachelor",
    ],
  },
  {
    intent: "certifications",
    keywords: [
      "certification",
      "certificate",
      "certified",
      "credential",
      "course",
    ],
  },
  {
    intent: "contact",
    keywords: [
      "contact",
      "email",
      "phone",
      "reach",
      "linkedin",
      "github",
      "get in touch",
      "call",
    ],
  },
  {
    intent: "availability",
    keywords: [
      "available",
      "hire",
      "opportunity",
      "freelance",
      "contract",
      "visa",
      "right to work",
    ],
  },
  {
    intent: "profile",
    keywords: [
      "who are you",
      "about",
      "tell me about",
      "introduce",
      "summary",
      "who is anuj",
      "background",
    ],
  },
  {
    intent: "ai_projects",
    keywords: [
      "ai project",
      "ai",
      "llm",
      "chatbot",
      "langchain",
      "openai",
      "machine learning",
      "artificial intelligence",
    ],
  },
];

function detectIntent(query) {
  const lower = query.toLowerCase().trim();

  for (const rule of INTENT_RULES) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) return rule.intent;
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Local response builders                                            */
/* ------------------------------------------------------------------ */

function buildSkillsResponse() {
  const grouped = getSkillsByCategory();
  return {
    type: "local",
    component: "skills-card",
    text: `Anuj has expertise across ${skills.length} core areas. Here's a breakdown by category.`,
    data: {
      groups: Object.entries(grouped).map(([category, items]) => ({
        category,
        skills: items.map((s) => ({
          name: s.name,
          level: s.level,
          description: s.description,
          projects: s.projects,
        })),
      })),
      technicalSkills,
    },
    followUp: [
      "Show me your projects",
      "What impact have you made?",
      "Why should we hire you?",
    ],
  };
}

function buildProjectsResponse(query) {
  const lower = (query || "").toLowerCase();
  const isAi =
    lower.includes("ai") ||
    lower.includes("llm") ||
    lower.includes("chatbot");
  const list = isAi
    ? projects.filter((p) =>
        p.tech.some((t) =>
          ["langchain", "openai", "gemini"].includes(t.toLowerCase())
        ) ||
          p.name.toLowerCase().includes("chatbot") ||
          p.name.toLowerCase().includes("portfolio assistant")
      )
    : projects;

  return {
    type: "local",
    component: "projects-card",
    text: isAi
      ? "Here are Anuj's AI-focused case studies."
      : `Here are ${list.length} case studies of Anuj's recent work.`,
    data: {
      projects: list.map((p) => ({
        name: p.name,
        role: p.role,
        status: p.status,
        description: p.description,
        businessProblem: p.businessProblem,
        solution: p.solution,
        architecture: p.architecture,
        keyFeatures: p.keyFeatures,
        challengesSolved: p.challengesSolved,
        measurableImpact: p.measurableImpact,
        aiUsage: p.aiUsage,
        futureImprovements: p.futureImprovements,
        screenshots: p.screenshots,
        tech: p.tech,
        repo: p.repo,
        demo: p.demo,
        url: p.url,
      })),
    },
    followUp: isAi
      ? [
          "Tell me about your skills",
          "What technologies do you use?",
          "How can I contact you?",
        ]
      : [
          "Tell me about your skills",
          "Show AI projects",
          "What's your work experience?",
        ],
  };
}

function buildExperienceResponse() {
  return {
    type: "local",
    component: "experience-card",
    text: `Anuj has ${experience.length} professional roles. Here's the timeline.`,
    data: {
      timeline: experience.map((e) => ({
        role: e.role,
        company: e.company,
        location: e.location,
        period: e.period,
        description: e.description,
        tech: e.tech,
      })),
    },
    followUp: [
      "What impact have you made?",
      "Show me your projects",
      "How can I contact you?",
    ],
  };
}

function buildEducationResponse() {
  return {
    type: "local",
    component: "education-card",
    text: "Anuj's educational background and certifications.",
    data: {
      education: education.map((e) => ({
        degree: e.degree,
        specialization: e.specialization,
        institution: e.institution,
        location: e.location,
        year: e.year,
      })),
      certifications: certifications.map((c) => ({
        name: c.name,
        issuer: c.issuer,
        year: c.year,
      })),
    },
    followUp: [
      "Tell me about your skills",
      "What's your work experience?",
      "Show me your projects",
    ],
  };
}

function buildCertificationsResponse() {
  return {
    type: "local",
    component: "certifications-card",
    text: "Anuj's professional certifications.",
    data: {
      certifications: certifications.map((c) => ({
        name: c.name,
        issuer: c.issuer,
        year: c.year,
      })),
    },
    followUp: [
      "What's your education?",
      "Tell me about your skills",
      "How can I contact you?",
    ],
  };
}

function buildContactResponse() {
  return {
    type: "local",
    component: "contact-card",
    text: "Here's how to reach Anuj.",
    data: {
      ...contact,
      visaStatus: profile.visaStatus,
      availabilityNote:
        "Anuj is currently open to opportunities and responds within 24 hours.",
    },
    followUp: [
      "Show me your projects",
      "Download your resume",
      "Why should we hire you?",
    ],
  };
}

function buildAvailabilityResponse() {
  return {
    type: "local",
    component: "contact-card",
    text: `Anuj is currently open to opportunities. ${profile.visaStatus}. Feel free to reach out!`,
    data: { ...contact },
    followUp: [
      "Tell me about your skills",
      "Show me your projects",
      "Download your resume",
    ],
  };
}

function buildProfileResponse() {
  return {
    type: "local",
    component: "profile-card",
    text: profile.narrative,
    data: {
      name: profile.name,
      title: profile.title,
      headline: profile.headline,
      narrative: profile.narrative,
      location: profile.location,
      currentFocus: profile.currentFocus,
      techStack: profile.techStack,
      visaStatus: profile.visaStatus,
    },
    followUp: [
      "Tell me about your skills",
      "Show me your projects",
      "Download your resume",
    ],
  };
}

function buildAiProjectsResponse() {
  return buildProjectsResponse("ai projects");
}

function buildResumeResponse() {
  return {
    type: "local",
    component: "resume-card",
    text: `Here's Anuj's resume (last updated ${resume.lastUpdated}). You can download the PDF or read the summary below.`,
    data: {
      fileName: resume.fileName,
      fileUrl: resume.fileUrl,
      fileSize: resume.fileSize,
      fileExists: resume.fileExists,
      lastUpdated: resume.lastUpdated,
      summary: resume.summary,
      highlights: resume.highlights,
      fullName: resume.fullName,
      title: resume.title,
      contact: resume.contact,
    },
    followUp: [
      "What's your work experience?",
      "Show me your projects",
      "How can I contact you?",
    ],
  };
}

function buildAchievementsResponse() {
  return {
    type: "local",
    component: "achievements-card",
    text: `Here are ${achievements.length} quantified wins, awards, and milestones from Anuj's work so far.`,
    data: {
      achievements: achievements.map((a) => {
        // Look up the optional sourceProject (exact match on projects.js
        // name). When absent (GoDesta work, internship, education, certs)
        // we still ship the achievement but with null cross-link fields
        // so the card hides the "View Project" link AND the inline
        // case-study drilldown toggle.
        const matchedProject = a.sourceProject
          ? projects.find((p) => p.name === a.sourceProject)
          : null;
        // Inline case-study payload (Phase 6.5). Only attached when a
        // matching project exists; the AchievementCard uses it to power
        // a click-to-expand drilldown that shows the project's
        // problem / solution / challenges inline.
        const caseStudy = matchedProject
          ? {
              name: matchedProject.name,
              url: matchedProject.url || null,
              businessProblem: matchedProject.businessProblem || null,
              solution: matchedProject.solution || null,
              challengesSolved: matchedProject.challengesSolved || [],
            }
          : null;
        return {
          id: a.id,
          title: a.title,
          metric: a.metric,
          context: a.context,
          period: a.period,
          tags: a.tags,
          sourceProjectName: matchedProject ? matchedProject.name : null,
          sourceProjectUrl: matchedProject ? matchedProject.url : null,
          caseStudy,
        };
      }),
    },
    followUp: [
      "Tell me about your skills",
      "What's your work experience?",
      "Download your resume",
    ],
  };
}

function buildFaqResponse(query) {
  const lower = query.toLowerCase();
  for (const item of faq) {
    for (const kw of item.keywords) {
      if (lower.includes(kw)) {
        return {
          type: "local",
          component: "text",
          text: item.answer,
          followUp: [
            "Tell me about your skills",
            "Show me your projects",
            "How can I contact you?",
          ],
        };
      }
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Main router                                                        */
/* ------------------------------------------------------------------ */

const BUILDERS = {
  resume: buildResumeResponse,
  achievements: buildAchievementsResponse,
  skills: buildSkillsResponse,
  projects: buildProjectsResponse,
  experience: buildExperienceResponse,
  education: buildEducationResponse,
  certifications: buildCertificationsResponse,
  contact: buildContactResponse,
  availability: buildAvailabilityResponse,
  profile: buildProfileResponse,
  ai_projects: buildAiProjectsResponse,
};

/**
 * Attempts to answer the query from local knowledge.
 * Returns a structured response object if answerable locally, or null
 * if the query requires Gemini reasoning.
 */
export function routeQuery(query) {
  const intent = detectIntent(query);

  if (intent && BUILDERS[intent]) {
    return BUILDERS[intent](query);
  }

  const faqMatch = buildFaqResponse(query);
  if (faqMatch) return faqMatch;

  return null;
}

/**
 * Quick check for whether a query can be answered locally.
 */
export function isLocalQuery(query) {
  return routeQuery(query) !== null;
}

/* ------------------------------------------------------------------ */
/*  Internal exports for future Phase 8 cards                          */
/* ------------------------------------------------------------------ */

export {
  buildResumeResponse,
  buildAchievementsResponse,
  buildSkillsResponse,
  buildProjectsResponse,
  buildExperienceResponse,
  buildEducationResponse,
  buildCertificationsResponse,
  buildContactResponse,
  buildAvailabilityResponse,
  buildProfileResponse,
  detectIntent,
};
