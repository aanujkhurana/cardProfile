<!--
  ProfileCard — renders the structured profile data delivered by
  the `profile` intent in src/lib/knowledge/router.js.

  Phase 4 update: surfaces the new `headline` and `narrative` fields
  added to src/lib/knowledge/profile.js. Headline sits above the
  metadata block as a 1-line elevator pitch; narrative replaces the
  previous single-sentence summary. The currentFocus + techStack
  chips stay.
-->

<template>
  <div class="ai-section">
    <h4 class="ai-section-title">
      <ion-icon name="person-outline"></ion-icon>
      Profile
    </h4>

    <p v-if="data.headline" class="ai-profile-headline">{{ data.headline }}</p>

    <div class="ai-profile-header">
      <h5 class="ai-profile-name">{{ data.name }}</h5>
      <p class="ai-profile-title">{{ data.title }}</p>
      <p class="ai-profile-location">{{ data.location }}</p>
    </div>

    <p v-if="data.narrative" class="ai-profile-narrative">{{ data.narrative }}</p>

    <div v-if="data.currentFocus?.length" class="ai-profile-focus">
      <h6 class="ai-label">Current Focus</h6>
      <div class="ai-focus-chips">
        <span v-for="f in data.currentFocus" :key="f" class="ai-focus-chip">{{ f }}</span>
      </div>
    </div>

    <div v-if="data.techStack?.length" class="ai-profile-tech">
      <h6 class="ai-label">Tech Stack</h6>
      <div class="ai-tech-chips">
        <span v-for="t in data.techStack" :key="t" class="ai-tech-chip">{{ t }}</span>
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

.ai-profile-headline {
  margin: 0 0 14px;
  color: var(--white-2);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.005em;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--onyx);
}

.ai-profile-header {
  margin-bottom: 12px;
}

.ai-profile-name {
  color: var(--white-2);
  font-size: 16px;
  font-weight: 600;
}

.ai-profile-title {
  color: var(--light-gray);
  font-size: 13px;
}

.ai-profile-location {
  color: var(--light-gray-70);
  font-size: 12px;
}

.ai-profile-narrative {
  margin: 0 0 12px;
  color: var(--light-gray);
  font-size: 13px;
  line-height: 1.65;
  letter-spacing: -0.005em;
}

.ai-label {
  color: var(--light-gray-70);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.ai-focus-chips,
.ai-tech-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ai-focus-chip {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 8px;
  background: rgba(255, 204, 51, 0.1);
  color: var(--orange-yellow-crayola);
  border: 1px solid rgba(255, 204, 51, 0.2);
}

.ai-tech-chip {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 8px;
  background: var(--onyx);
  color: var(--light-gray);
}

.ai-profile-focus,
.ai-profile-tech {
  margin-top: 12px;
}
</style>
