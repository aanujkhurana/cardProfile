<!--
  AchievementCard — minimal stub.

  Renders the structured achievements list from the `achievements` intent.
  Visual treatment is intentionally basic; Phase 8 will replace this
  with the premium card the audit calls for.
-->

<template>
  <ul v-if="data?.achievements?.length" class="ai-achievements">
    <li
      v-for="item in data.achievements"
      :key="item.id"
      class="ai-achievement"
    >
      <div class="ai-achievement-head">
        <h4 class="ai-achievement-title">{{ item.title }}</h4>
        <span class="ai-achievement-metric">{{ item.metric }}</span>
      </div>
      <p class="ai-achievement-context">{{ item.context }}</p>
      <div class="ai-achievement-meta">
        <span class="ai-achievement-period">{{ item.period }}</span>
        <span
          v-for="tag in item.tags"
          :key="tag"
          class="ai-achievement-tag"
        >{{ tag }}</span>
      </div>
    </li>
  </ul>
</template>

<script setup>
defineProps({
  data: { type: Object, required: true },
});
</script>

<style scoped>
.ai-achievements {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-achievement {
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--eerie-black-2);
  border: 1px solid var(--onyx);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai-achievement-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.ai-achievement-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--white-2);
  line-height: 1.3;
}

.ai-achievement-metric {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  background: hsla(45, 54%, 58%, 0.16);
  color: var(--vegas-gold);
  white-space: nowrap;
}

.ai-achievement-context {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--light-gray);
}

.ai-achievement-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  font-size: 11px;
  color: var(--light-gray-70);
}

.ai-achievement-period {
  font-weight: 500;
}

.ai-achievement-tag {
  padding: 2px 8px;
  border-radius: 8px;
  background: var(--onyx);
  color: var(--light-gray-70);
  font-size: 10px;
  text-transform: lowercase;
  letter-spacing: 0.02em;
}
</style>
