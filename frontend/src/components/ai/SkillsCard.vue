<template>
  <div class="ai-section">
    <h4 class="ai-section-title">
      <ion-icon name="flash-outline"></ion-icon>
      Skills & Technologies
    </h4>

    <div v-for="group in data.groups" :key="group.category" class="ai-skill-group">
      <h5 class="ai-skill-category">{{ group.category }}</h5>
      <div class="ai-skill-grid">
        <div v-for="skill in group.skills" :key="skill.name" class="ai-skill-item">
          <div class="ai-skill-head">
            <span class="ai-skill-name">{{ skill.name }}</span>
            <span class="ai-skill-level" :class="skill.level.toLowerCase()">{{ skill.level }}</span>
          </div>
          <p class="ai-skill-desc">{{ skill.description }}</p>
          <div v-if="skill.projects?.length" class="ai-skill-projects">
            <span v-for="p in skill.projects" :key="p" class="ai-badge">{{ p }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="data.technicalSkills" class="ai-tech-overview">
      <h5 class="ai-skill-category">Full Tech Stack</h5>
      <div class="ai-tech-chips">
        <template v-for="(items, category) in data.technicalSkills" :key="category">
          <span v-for="tech in items" :key="tech" class="ai-tech-chip">{{ tech }}</span>
        </template>
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

.ai-skill-group {
  margin-bottom: 14px;
}

.ai-skill-group:last-child {
  margin-bottom: 0;
}

.ai-skill-category {
  color: var(--light-gray-70);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}

.ai-skill-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai-skill-item {
  background: var(--eerie-black-1);
  border: 1px solid var(--onyx);
  border-radius: 8px;
  padding: 10px 12px;
}

.ai-skill-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.ai-skill-name {
  color: var(--white-2);
  font-size: 13px;
  font-weight: 500;
}

.ai-skill-level {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 8px;
  border-radius: 10px;
}

.ai-skill-level.advanced {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
}

.ai-skill-level.intermediate {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
}

.ai-skill-desc {
  color: var(--light-gray-70);
  font-size: 12px;
  line-height: 1.5;
}

.ai-skill-projects {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.ai-badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--onyx);
  color: var(--light-gray);
}

.ai-tech-overview {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--onyx);
}

.ai-tech-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ai-tech-chip {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 8px;
  background: var(--onyx);
  color: var(--light-gray);
  border: 1px solid transparent;
}
</style>
