<!--
  ProjectsCard — case-study layout (Phase 5).

  Each project renders as a small case study in the order: header,
  impact callout, description, then labelled sections (problem,
  solution, architecture, features, challenges, AI usage, next
  steps), then screenshots (hidden when empty), then actions.

  Empty fields are hidden via v-if — no placeholders. The new
  `screenshots` field is present on the data shape for future asset
  drops but does not render a section until the array is non-empty.
-->

<template>
  <div class="ai-section">
    <h4 class="ai-section-title">
      <ion-icon name="rocket-outline"></ion-icon>
      Case Studies
    </h4>

    <div
      v-for="project in data.projects"
      :key="project.name"
      class="ai-project-card"
    >
      <div class="ai-project-head">
        <h5 class="ai-project-name">{{ project.name }}</h5>
        <div class="ai-project-pills">
          <span v-if="project.role" class="ai-project-role">{{ project.role }}</span>
          <span v-if="project.status" class="ai-project-status">{{ project.status }}</span>
        </div>
      </div>

      <div v-if="project.measurableImpact" class="ai-project-impact">
        <ion-icon name="trending-up-outline"></ion-icon>
        <span>{{ project.measurableImpact }}</span>
      </div>

      <p v-if="project.description" class="ai-project-desc">
        {{ project.description }}
      </p>

      <div v-if="project.businessProblem" class="ai-case-section">
        <h6>The problem</h6>
        <p>{{ project.businessProblem }}</p>
      </div>

      <div v-if="project.solution" class="ai-case-section">
        <h6>What I built</h6>
        <p>{{ project.solution }}</p>
      </div>

      <div v-if="project.architecture" class="ai-case-section">
        <h6>Architecture</h6>
        <p>{{ project.architecture }}</p>
        <div v-if="project.tech?.length" class="ai-project-tech">
          <span v-for="t in project.tech" :key="t" class="ai-tech-chip">{{ t }}</span>
        </div>
      </div>

      <div v-if="project.keyFeatures?.length" class="ai-case-section">
        <h6>Key features</h6>
        <ul class="ai-project-list">
          <li v-for="f in project.keyFeatures" :key="f">{{ f }}</li>
        </ul>
      </div>

      <div v-if="project.challengesSolved?.length" class="ai-case-section">
        <h6>Challenges solved</h6>
        <ul class="ai-project-list">
          <li v-for="c in project.challengesSolved" :key="c">{{ c }}</li>
        </ul>
      </div>

      <div v-if="project.aiUsage" class="ai-case-section">
        <h6>AI usage</h6>
        <p>{{ project.aiUsage }}</p>
      </div>

      <div v-if="project.futureImprovements?.length" class="ai-case-section">
        <h6>Next steps</h6>
        <ul class="ai-project-list">
          <li v-for="fi in project.futureImprovements" :key="fi">{{ fi }}</li>
        </ul>
      </div>

      <div v-if="project.screenshots?.length" class="ai-case-section">
        <h6>Screenshots</h6>
        <div class="ai-screenshots-grid">
          <a
            v-for="shot in project.screenshots"
            :key="shot.src"
            :href="shot.href || shot.src"
            target="_blank"
            rel="noopener"
          >
            <img
              :src="shot.src"
              :alt="shot.alt || `${project.name} screenshot`"
              loading="lazy"
            />
          </a>
        </div>
      </div>

      <div
        v-if="project.repo || project.demo || project.url"
        class="ai-project-actions"
      >
        <a
          v-if="project.repo"
          :href="project.repo"
          target="_blank"
          rel="noopener"
          class="ai-action-btn"
          :aria-label="`View ${project.name} source on GitHub`"
        >
          <ion-icon name="logo-github"></ion-icon>
          Repo
        </a>
        <a
          v-if="project.demo"
          :href="project.demo"
          target="_blank"
          rel="noopener"
          class="ai-action-btn"
          :aria-label="`View ${project.name} live demo`"
        >
          <ion-icon name="open-outline"></ion-icon>
          Demo
        </a>
        <a
          v-if="project.url"
          :href="project.url"
          class="ai-action-btn case-study-btn"
          :aria-label="`Read the ${project.name} case study`"
        >
          <ion-icon name="document-text-outline"></ion-icon>
          Case study
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ data: { type: Object, required: true } });
</script>

<style scoped>
.ai-section {
  background: var(--eerie-black-2);
  border: 1px solid var(--onyx);
  border-radius: 12px;
  padding: 16px;
  margin-top: 8px;
}

.ai-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--white-2);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 14px;
}

.ai-section-title ion-icon {
  color: var(--orange-yellow-crayola);
  font-size: 16px;
  display: inline;
}

.ai-project-card {
  background: var(--eerie-black-1);
  border: 1px solid var(--onyx);
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 14px;
}

.ai-project-card:last-child {
  margin-bottom: 0;
}

.ai-project-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 8px;
}

.ai-project-name {
  color: var(--white-2);
  font-size: 15px;
  font-weight: 600;
}

.ai-project-pills {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.ai-project-role,
.ai-project-status {
  font-size: 10px;
  color: var(--light-gray-70);
  background: var(--onyx);
  padding: 2px 8px;
  border-radius: 10px;
  text-transform: capitalize;
  white-space: nowrap;
}

.ai-project-impact {
  display: flex;
  align-items: center;
  gap: 8px;
  background: hsla(45, 100%, 72%, 0.08);
  border: 1px solid hsla(45, 100%, 72%, 0.2);
  padding: 8px 10px;
  border-radius: 6px;
  margin-bottom: 12px;
}

.ai-project-impact ion-icon {
  color: var(--orange-yellow-crayola);
  font-size: 14px;
  flex-shrink: 0;
  display: inline;
}

.ai-project-impact span {
  color: var(--vegas-gold);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
}

.ai-project-desc {
  color: var(--white-2);
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 14px;
  font-style: italic;
  border-bottom: 1px solid var(--onyx);
  padding-bottom: 10px;
}

.ai-case-section {
  margin-bottom: 12px;
}

.ai-case-section h6 {
  color: var(--light-gray-70);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.ai-case-section p {
  color: var(--light-gray);
  font-size: 12px;
  line-height: 1.55;
}

.ai-project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.ai-tech-chip {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 8px;
  background: var(--onyx);
  color: var(--light-gray);
}

.ai-project-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ai-project-list li {
  font-size: 12px;
  color: var(--light-gray);
  padding: 2px 0 2px 14px;
  position: relative;
  line-height: 1.45;
  margin-bottom: 4px;
}

.ai-project-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--orange-yellow-crayola);
}

.ai-screenshots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
}

.ai-screenshots-grid a {
  display: block;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--onyx);
}

.ai-screenshots-grid img {
  display: block;
  width: 100%;
  height: auto;
}

.ai-project-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
  border-top: 1px solid var(--onyx);
  padding-top: 12px;
}

.ai-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--vegas-gold);
  padding: 5px 10px;
  border-radius: 6px;
  background: var(--onyx);
  border: 1px solid transparent;
  text-decoration: none;
  transition: border-color 150ms ease, transform 180ms var(--ease, ease);
}

.ai-action-btn:hover {
  border-color: var(--orange-yellow-crayola);
  transform: translateY(-1px);
}

.ai-action-btn ion-icon {
  font-size: 13px;
  color: inherit;
  display: inline;
}

.case-study-btn {
  background: hsla(45, 100%, 72%, 0.1);
  border: 1px solid hsla(45, 100%, 72%, 0.3);
}

.case-study-btn:hover {
  background: hsla(45, 100%, 72%, 0.2);
}
</style>
