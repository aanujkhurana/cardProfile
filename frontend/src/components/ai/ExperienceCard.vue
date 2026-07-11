<template>
  <div class="ai-section">
    <h4 class="ai-section-title">
      <ion-icon name="briefcase-outline"></ion-icon>
      Work Experience
    </h4>

    <div class="ai-timeline">
      <div v-for="(item, i) in data.timeline" :key="i" class="ai-timeline-item">
        <div class="ai-timeline-dot"></div>
        <div class="ai-timeline-card">
          <div class="ai-timeline-head">
            <h5 class="ai-timeline-role">{{ item.role }}</h5>
            <span class="ai-timeline-period">{{ item.period }}</span>
          </div>
          <p class="ai-timeline-company">{{ item.company }} &middot; {{ item.location }}</p>
          <ul v-if="item.description?.length" class="ai-timeline-list">
            <li v-for="(d, j) in item.description" :key="j">{{ d }}</li>
          </ul>
          <div v-if="item.tech?.length" class="ai-timeline-tech">
            <span v-for="t in item.tech" :key="t" class="ai-tech-chip">{{ t }}</span>
          </div>
        </div>
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

.ai-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding-left: 18px;
}

.ai-timeline::before {
  content: "";
  position: absolute;
  left: 5px;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: var(--onyx);
}

.ai-timeline-item {
  position: relative;
  padding-bottom: 14px;
}

.ai-timeline-item:last-child {
  padding-bottom: 0;
}

.ai-timeline-dot {
  position: absolute;
  left: -18px;
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--onyx);
  border: 2px solid var(--eerie-black-2);
  z-index: 1;
}

.ai-timeline-card {
  background: var(--eerie-black-1);
  border: 1px solid var(--onyx);
  border-radius: 10px;
  padding: 12px;
}

.ai-timeline-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.ai-timeline-role {
  color: var(--white-2);
  font-size: 13px;
  font-weight: 600;
}

.ai-timeline-period {
  font-size: 10px;
  color: var(--light-gray-70);
}

.ai-timeline-company {
  color: var(--light-gray);
  font-size: 12px;
  margin-bottom: 8px;
}

.ai-timeline-list {
  list-style: none;
  padding: 0;
  margin: 0 0 8px;
}

.ai-timeline-list li {
  font-size: 12px;
  color: var(--light-gray);
  padding: 2px 0 2px 12px;
  position: relative;
}

.ai-timeline-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 9px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--orange-yellow-crayola);
}

.ai-timeline-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.ai-tech-chip {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 8px;
  background: var(--onyx);
  color: var(--light-gray);
}
</style>
