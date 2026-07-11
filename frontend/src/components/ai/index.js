export { default as SkillsCard } from "./SkillsCard.vue";
export { default as ProjectsCard } from "./ProjectsCard.vue";
export { default as ExperienceCard } from "./ExperienceCard.vue";
export { default as EducationCard } from "./EducationCard.vue";
export { default as ContactCard } from "./ContactCard.vue";
export { default as ProfileCard } from "./ProfileCard.vue";

/**
 * Map component name strings to actual Vue components.
 */
import Skills from "./SkillsCard.vue";
import Projects from "./ProjectsCard.vue";
import Experience from "./ExperienceCard.vue";
import Education from "./EducationCard.vue";
import Contact from "./ContactCard.vue";
import Profile from "./ProfileCard.vue";

const COMPONENT_MAP = {
  "skills-card": Skills,
  "projects-card": Projects,
  "experience-card": Experience,
  "education-card": Education,
  "certifications-card": Education,
  "contact-card": Contact,
  "profile-card": Profile,
  text: null,
};

export function resolveComponent(componentName) {
  return COMPONENT_MAP[componentName] || null;
}
