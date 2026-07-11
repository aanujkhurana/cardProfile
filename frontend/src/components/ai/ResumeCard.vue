<!--
  ResumeCard — minimal stub.

  Renders the structured resume data delivered by the `resume` intent in
  src/lib/knowledge/router.js. Visual treatment is intentionally basic;
  Phase 8 will replace this with the premium card the audit calls for.

  The download link points at data.fileUrl. Until the actual PDF is
  uploaded under frontend/public/resume/ this 404s — see PRODUCTION_AUDIT.md
  Phase 6 follow-up. We do not silently mask the 404 here.
-->

<template>
  <div v-if="data" class="ai-resume-card">
    <header class="ai-resume-header">
      <div>
        <h3 class="ai-resume-name">{{ data.fullName }}</h3>
        <p class="ai-resume-title">{{ data.title }}</p>
      </div>
      <span class="ai-resume-updated">Updated {{ data.lastUpdated }}</span>
    </header>

    <p class="ai-resume-summary">{{ data.summary }}</p>

    <ul v-if="data.highlights?.length" class="ai-resume-highlights">
      <li v-for="(h, i) in data.highlights" :key="i">{{ h }}</li>
    </ul>

    <div class="ai-resume-cta-row">
      <a
        class="ai-resume-download"
        :href="data.fileUrl"
        :download="data.fileName"
        rel="noopener"
      >
        <ion-icon name="download-outline"></ion-icon>
        <span>Download {{ data.fileName }}</span>
      </a>

      <a
        v-if="data.contact?.email"
        class="ai-resume-email"
        :href="`mailto:${data.contact.email}?subject=Requesting%20your%20latest%20resume`"
        rel="noopener"
      >
        <ion-icon name="mail-outline"></ion-icon>
        <span>Email me instead</span>
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: { type: Object, required: true },
});
</script>

<style scoped>
.ai-resume-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: var(--eerie-black-2);
  border: 1px solid var(--onyx);
  font-size: 14px;
  line-height: 1.6;
  color: var(--light-gray);
}

.ai-resume-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.ai-resume-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--white-2);
}

.ai-resume-title {
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--light-gray-70);
}

.ai-resume-updated {
  font-size: 11px;
  color: var(--light-gray-70);
  padding: 3px 8px;
  border-radius: 10px;
  background: var(--onyx);
  white-space: nowrap;
}

.ai-resume-summary {
  margin: 0;
  color: var(--light-gray);
}

.ai-resume-highlights {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ai-resume-highlights li {
  color: var(--light-gray);
}

.ai-resume-cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.ai-resume-download,
.ai-resume-email {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  text-decoration: none;
  border: 1px solid var(--onyx);
  background: var(--eerie-black-1);
  color: var(--white-2);
  transition: color 150ms ease, border-color 150ms ease, transform 180ms var(--ease, ease);
}

.ai-resume-download {
  background: var(--vegas-gold);
  color: var(--eerie-black-1);
  border-color: var(--vegas-gold);
}

.ai-resume-download ion-icon,
.ai-resume-email ion-icon {
  font-size: 15px;
  color: inherit;
  display: inline;
}

.ai-resume-download:hover,
.ai-resume-email:hover {
  transform: translateY(-1px);
}

.ai-resume-email {
  color: var(--light-gray);
}

@media (max-width: 480px) {
  .ai-resume-header {
    flex-direction: column;
    gap: 6px;
  }
}
</style>
