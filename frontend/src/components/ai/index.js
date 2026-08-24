/**
 * AI card component barrel + resolver.
 *
 * Maps the `component` field emitted by the knowledge router to the
 * actual Vue component. Unknown names resolve to null and the
 * AILanding template falls through to plain text gracefully.
 *
 * New in Phase 3:
 *  - resume-card     → ResumeCard.vue
 *  - achievements-card → AchievementCard.vue
 * Both are minimal stubs; Phase 8 will replace them with premium cards.
 */

export { default as SkillsCard } from "./SkillsCard.vue";
export { default as ProjectsCard } from "./ProjectsCard.vue";
export { default as ExperienceCard } from "./ExperienceCard.vue";
export { default as EducationCard } from "./EducationCard.vue";
export { default as ContactCard } from "./ContactCard.vue";
export { default as ProfileCard } from "./ProfileCard.vue";
export { default as ResumeCard } from "./ResumeCard.vue";
export { default as AchievementCard } from "./AchievementCard.vue";

import Skills from "./SkillsCard.vue";
import Projects from "./ProjectsCard.vue";
import Experience from "./ExperienceCard.vue";
import Education from "./EducationCard.vue";
import Contact from "./ContactCard.vue";
import Profile from "./ProfileCard.vue";
import Resume from "./ResumeCard.vue";
import Achievements from "./AchievementCard.vue";

const COMPONENT_MAP = {
  "skills-card": Skills,
  "projects-card": Projects,
  "experience-card": Experience,
  "education-card": Education,
  "certifications-card": Education,
  "contact-card": Contact,
  "profile-card": Profile,
  "resume-card": Resume,
  "achievements-card": Achievements,
  text: null,
};

export function resolveComponent(componentName) {
  return COMPONENT_MAP[componentName] || null;
}
