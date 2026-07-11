<template>
  <div class="ai-section">
    <h4 class="ai-section-title">
      <ion-icon name="rocket-outline"></ion-icon>
      Projects
    </h4>

    <div v-for="project in data.projects" :key="project.name" class="ai-project-card">
      <div class="ai-project-head">
        <h5 class="ai-project-name">{{ project.name }}</h5>
        <span class="ai-project-role">{{ project.role }}</span>
      </div>
      <p class="ai-project-desc">{{ project.description }}</p>
      <div class="ai-project-tech">
        <span v-for="t in project.tech" :key="t" class="ai-tech-chip">{{ t }}</span>
      </div>
      <ul v-if="project.highlights?.length" class="ai-project-highlights">
        <li v-for="h in project.highlights" :key="h">{{ h }}</li>
      </ul>
      <div v-if="project.repo" class="ai-project-actions">
        <a :href="project.repo" target="_blank" rel="noopener" class="ai-action-btn">
          <ion-icon name="logo-github"></ion-icon>
          GitHub
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
  margin-bottom: 10px;
}

.ai-project-card:last-child {
  margin-bottom: 0;
}

.ai-project-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.ai-project-name {
  color: var(--white-2);
  font-size: 14px;
  font-weight: 600;
}

.ai-project-role {
  font-size: 10px;
  color: var(--light-gray-70);
  background: var(--onyx);
  padding: 2px 8px;
  border-radius: 10px;
}

.ai-project-desc {
  color: var(--light-gray);
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 8px;
}

.ai-project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.ai-tech-chip {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 8px;
  background: var(--onyx);
  color: var(--light-gray);
}

.ai-project-highlights {
  list-style: none;
  padding: 0;
  margin: 0 0 10px;
}

.ai-project-highlights li {
  font-size: 12px;
  color: var(--light-gray);
  padding: 2px 0 2px 14px;
  position: relative;
}

.ai-project-highlights li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 9px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--orange-yellow-crayola);
}

.ai-project-actions {
  display: flex;
  gap: 8px;
}

.ai-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--vegas-gold);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid var(--onyx);
  transition: opacity 150ms ease;
}

.ai-action-btn:hover {
  opacity: 0.8;
}

.ai-action-btn ion-icon {
  font-size: 13px;
  color: inherit;
  display: inline;
}
</style>
