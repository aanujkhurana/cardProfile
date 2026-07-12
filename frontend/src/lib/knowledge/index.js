/**
 * Knowledge barrel — the single source of truth for everything
 * Anuj-the-person related that the AI assistant can answer from.
 *
 * If you find yourself importing `contextData` from
 * `src/lib/chatbox/contextData.js`, stop: that file is removed.
 * Use the canonical modules below instead.
 */

export { profile, getAvailability, formatLastChecked } from "./profile.js";
export {
  skills,
  technicalSkills,
  getSkillsByCategory,
  getSkillByName,
} from "./skills.js";
export {
  projects,
  getProjectByName,
  getProjectsByTech,
} from "./projects.js";
export { experience } from "./experience.js";
export { education, certifications } from "./education.js";
export { contact } from "./contact.js";
export { faq } from "./faq.js";
export { resume, getResume } from "./resume.js";
export { achievements, getAchievements, getAchievementsByTag } from "./achievements.js";
