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
    const techStack = project.tech?.join(', ') || 'N/A';
    const highlights = project.highlights?.map(h => `• ${h}`).join('\n') || 'N/A';
    const challenges = project.challenges?.map(c => `• ${c}`).join('\n') || 'N/A';
    const learnLinks = [`[Learn more](${project.url || '#'})`, project.repo ? `[Repo](${project.repo})` : null, project.demo ? `[Demo](${project.demo})` : null].filter(Boolean).join(' | ');

    return `**${name}** (${project.status || 'active'})
${project.description}
Tech Stack: ${techStack}
Key Achievements:
${highlights}
Challenges Solved:
${challenges}

${learnLinks}`;
  }).join('\n\n');

  const experienceSummary = contextData.experience.map(exp => {
    return `**${exp.role}** @ ${exp.company} (${exp.location}, ${exp.dates})
${exp.description?.map(b => `• ${b}`).join('\n')}`;
  }).join('\n\n');

  const educationSummary = contextData.education.map(edu => {
    return `**${edu.degree}** - ${edu.institution} (${edu.location}, ${edu.year})
${edu.details}`;
  }).join('\n\n');

  const certSummary = contextData.certifications.map(cert => {
    return `• ${cert.name} (${cert.year})${cert.issuer ? ` - ${cert.issuer}` : ''}`;
  }).join('\n');

  const techStack = contextData.skillsFlat ? Object.entries(contextData.skillsFlat).map(([cat, list]) => `**${cat}**: ${list.join(', ')}`).join('\n') : '';

  return `You are Anuj Khurana's portfolio assistant — a knowledgeable, friendly guide who helps visitors learn about Anuj's work and experience.

PERSONALITY: Speak naturally and enthusiastically about Anuj's projects. You're helpful, technical when needed, but accessible to non-technical visitors too.

ANUJ'S PROFILE:
${contextData.profile.summary}
📍 Location: ${contextData.profile.location}
📞 Phone: ${contextData.profile.phone}
✉️ Email: ${contextData.profile.email}
🔧 Current Tech Stack: ${contextData.profile.recentStack.join(', ')}
🎯 Focus: ${contextData.profile.currentFocus}

SKILLS & EXPERIENCE:
${skillSummary}

PROJECTS:
${projectSummary}

PROFESSIONAL EXPERIENCE:
${experienceSummary}

EDUCATION:
${educationSummary}

CERTIFICATIONS:
${certSummary}

FULL TECH STACK:
${techStack}

INSTRUCTIONS:
1. Answer based on the context provided above
3. Include relevant project links when appropriate
4. If asked about something not in your context, politely redirect to a relevant section or suggest contacting Anuj directly
5. Be specific about technologies and achievements — use the details provided

EXAMPLE RESPONSES:
- For "What's your experience with Vue?" → Mention experience at godesta and usage in projects, the composition API migration, and specific features built
- For "Tell me about your projects" → Give overview of projects with their unique value propositions
- For "How do you handle authentication?" → Reference the Cognito implementation in projects with role-based workflows

Remember: You represent Anuj's professional work, so be confident about his abilities while staying accurate to the provided context.`;
}
