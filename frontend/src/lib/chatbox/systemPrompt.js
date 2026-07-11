/**
 * Persona prompt builder.
 *
 * Single source of truth: everything the LLM persona refers to lives in
 * `src/lib/knowledge/*`. This module formats those data into the system
 * instruction sent to Gemini via the /api/gemini proxy.
 *
 * Earlier this file read from `chatbox/contextData.js`, which duplicated
 * most fields and could drift. That file was removed in this branch.
 */

import {
  profile,
  skills,
  projects,
  experience,
  education,
  certifications,
  resume,
  achievements,
} from "../knowledge/index.js";

const projectIndex = new Map();
for (const p of projects) projectIndex.set(p.name.toLowerCase(), p);

export function buildSystemPrompt() {
  const skillSummary = skills
    .map((skill) => {
      const projLinks = skill.projects
        .map((p) => {
          const meta = projectIndex.get(p.toLowerCase());
          const slug = meta?.url || "#";
          return `[${p}](${slug})`;
        })
        .join(", ");
      const learned = skill.learned ? `\nExperience: ${skill.learned}` : "";
      return `**${skill.name}** (${skill.level}): ${skill.description}
Used in: ${projLinks}${learned}`;
    })
    .join("\n\n");

  const projectSummary = projects
    .map((project) => {
      const techStack = project.tech?.join(", ") || "N/A";
      const highlights =
        project.highlights?.map((h) => `• ${h}`).join("\n") || "N/A";
      const challenges =
        project.challenges?.map((c) => `• ${c}`).join("\n") || "N/A";
      const learnLinks = [
        project.url ? `[Case study](${project.url})` : null,
        project.repo ? `[Repo](${project.repo})` : null,
        project.demo ? `[Demo](${project.demo})` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      return `**${project.name}** (${project.status || "active"})
${project.description}
Tech Stack: ${techStack}
Key Achievements:
${highlights}
Challenges Solved:
${challenges}

${learnLinks}`;
    })
    .join("\n\n");

  const experienceSummary = experience
    .map(
      (exp) =>
        `**${exp.role}** @ ${exp.company} (${exp.location}, ${exp.period})
${(exp.description || [])
  .map((b) => `• ${b}`)
  .join("\n")}`
    )
    .join("\n\n");

  const educationSummary = education
    .map((edu) => {
      const spec = edu.specialization ? ` - ${edu.specialization}` : "";
      return `**${edu.degree}**${spec} - ${edu.institution} (${edu.location}, ${edu.year})`;
    })
    .join("\n");

  const certSummary = certifications
    .map(
      (cert) =>
        `• ${cert.name} (${cert.year})${cert.issuer ? ` - ${cert.issuer}` : ""}`
    )
    .join("\n");

  const achievementsSummary = achievements
    .map(
      (a) =>
        `**${a.title}** — ${a.metric}
${a.context}
Period: ${a.period}
Tags: ${a.tags.join(", ")}`
    )
    .join("\n\n");

  const resumeSection = `**Resume**: ${resume.summary}
Last updated: ${resume.lastUpdated}

Quick highlights:
${resume.highlights.map((h) => `• ${h}`).join("\n")}`;

  const techStack = profile.techStack?.length
    ? `**Tech Stack**: ${profile.techStack.join(", ")}`
    : "";

  return `You are Anuj Khurana's portfolio assistant — a knowledgeable, friendly guide who helps visitors learn about Anuj's work and experience.

PERSONALITY: Speak naturally and enthusiastically about Anuj. You're helpful, technical when needed, but accessible to non-technical visitors too. Full of humour.

ANUJ'S PROFILE:
👤 **Name**: ${profile.name}
💼 **Title**: ${profile.title}
📍 **Location**: ${profile.location}
📞 **Phone**: ${profile.contact.phone}
✉️ **Email**: ${profile.contact.email}
🔗 [GitHub](${profile.contact.github}) | [LinkedIn](${profile.contact.linkedin}) | [Website](${profile.contact.website})
🎯 **Current Focus**: ${profile.currentFocus.join(", ")}
🛂 **Visa**: ${profile.visaStatus}

📝 **Summary**:
${profile.summary}

${techStack}

---

🧠 SKILLS & EXPERIENCE:
${skillSummary}

---

🚀 PROJECTS:
${projectSummary}

---

💼 PROFESSIONAL EXPERIENCE:
${experienceSummary}

---

🎓 EDUCATION:
${educationSummary}

---

📜 CERTIFICATIONS:
${certSummary}

---

🏆 KEY ACHIEVEMENTS & QUANTIFIED IMPACT:
${achievementsSummary}

---

📄 RESUME (latest version: ${resume.lastUpdated}):
${resumeSection}

---

INSTRUCTIONS:
1. Always refer back to Anuj's profile, skills, projects, or achievements when answering.
2. When talking about impact, lead with the metric from the ACHIEVEMENTS section.
3. If asked for the resume, point to /resume/${resume.fileName} (a PDF); summarize the resume section in plain text.
4. Redirect politely if a question falls outside the context.
5. Be accurate, specific, and confident — you represent Anuj's professional brand.
6. Use the provided context to answer questions about Anuj's work, skills, and projects.
7. If asked about Anuj's personal interests, hobbies, or non-professional topics, respond politely that you can only provide information related to Anuj's professional background and projects.
8. Keep responses concise but informative, focusing on Anuj's strengths and achievements.
9. If the user asks about Anuj's future plans or aspirations, mention his interest in AI and LLM app engineering, plus his focus on Vue 3 and real-time systems.
10. If asked about availability, mention he's open to opportunities with ${profile.visaStatus} and direct to the contact card.
11. If asked about Anuj's personal life, redirect politely to the contact page.
`;
}
