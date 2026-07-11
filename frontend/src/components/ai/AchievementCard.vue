<!--
  AchievementCard — premium polish (Phase 6).

  Renders the structured achievements list from the `achievements`
  intent in src/lib/knowledge/router.js. Each achievement is a card
  with:
    1. Hero row: quantified metric (gold gradient text) + a subtle
       decorative icon (podium for wins, school for education/certs).
    2. Title.
    3. Context paragraph.
    4. Meta row: period + tag chips.
    5. Source-project link (only when router resolves sourceProject
       to a real project in projects.js).

  The metric gradient uses -webkit-background-clip with a solid
  fallback color so non-webkit browsers still render the number in
  vegas-gold rather than transparent.
-->

<template>
  <div v-if="data?.achievements?.length" class="ai-section">
    <h4 class="ai-section-title">
      <ion-icon name="trophy-outline"></ion-icon>
      Key Achievements
    </h4>

    <div class="ai-achievement-grid">
      <article
        v-for="item in data.achievements"
        :key="item.id"
        class="ai-achievement-card"
      >
        <div class="ai-achievement-hero">
          <span class="ai-achievement-metric">{{ item.metric }}</span>
          <ion-icon
            :name="achievementIcon(item)"
            class="ai-achievement-bg-icon"
            aria-hidden="true"
          ></ion-icon>
        </div>

        <h5 class="ai-achievement-title">{{ item.title }}</h5>

        <p class="ai-achievement-context">{{ item.context }}</p>

        <div class="ai-achievement-meta">
          <span class="ai-achievement-period">{{ item.period }}</span>
          <div v-if="item.tags?.length" class="ai-achievement-chips">
            <span v-for="tag in item.tags" :key="tag" class="ai-focus-chip">{{ tag }}</span>
          </div>
        </div>

        <div v-if="item.sourceProjectUrl" class="ai-achievement-source">
          <a
            :href="item.sourceProjectUrl"
            class="ai-source-link"
            :aria-label="`View the ${item.sourceProjectName} case study`"
          >
            <ion-icon name="open-outline" aria-hidden="true"></ion-icon>
            View project: {{ item.sourceProjectName }}
          </a>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: { type: Object, required: true },
});

/**
 * Decorative icon per achievement type:
 *   - education / certification → school-outline
 *   - everything else (work wins) → podium-outline
 * The icon is purely visual; aria-hidden is set in the template.
 */
function achievementIcon(item) {
  const tags = item.tags || [];
  if (tags.includes("education") || tags.includes("certification")) {
    return "school-outline";
  }
  return "podium-outline";
}
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

.ai-achievement-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-achievement-card {
  background: var(--eerie-black-1);
  border: 1px solid var(--onyx);
  border-radius: 10px;
  padding: 14px 16px;
  position: relative;
  overflow: hidden;
}

.ai-achievement-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 8px;
}

.ai-achievement-metric {
  font-size: 18px;
  font-weight: 700;
  color: var(--vegas-gold);
  background: linear-gradient(45deg, var(--vegas-gold), var(--orange-yellow-crayola));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.01em;
  line-height: 1.1;
}

.ai-achievement-bg-icon {
  font-size: 22px;
  color: hsla(45, 100%, 72%, 0.18);
  flex-shrink: 0;
  display: inline;
}

.ai-achievement-title {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--white-2);
  line-height: 1.35;
}

.ai-achievement-context {
  margin: 0 0 10px;
  font-size: 12px;
  line-height: 1.55;
  color: var(--light-gray);
}

.ai-achievement-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--onyx);
}

.ai-achievement-period {
  font-size: 11px;
  font-weight: 500;
  color: var(--light-gray-70);
}

.ai-achievement-chips {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.ai-focus-chip {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 8px;
  background: rgba(255, 204, 51, 0.1);
  color: var(--orange-yellow-crayola);
  border: 1px solid rgba(255, 204, 51, 0.2);
  text-transform: lowercase;
  letter-spacing: 0.01em;
}

.ai-achievement-source {
  margin-top: 10px;
}

.ai-source-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 500;
  color: var(--vegas-gold);
  text-decoration: none;
  background: var(--onyx);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid transparent;
  transition: background 150ms ease, border-color 150ms ease, transform 180ms ease;
}

.ai-source-link:hover {
  background: hsla(45, 100%, 72%, 0.12);
  border-color: hsla(45, 100%, 72%, 0.3);
  transform: translateY(-1px);
}

.ai-source-link ion-icon {
  font-size: 12px;
  display: inline;
}
</style>
