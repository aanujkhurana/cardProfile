<!--
  ResumeCard — premium polish (Phase 6).

  Renders the structured resume data delivered by the `resume` intent in
  src/lib/knowledge/router.js. Layout:
    1. Section header + name/title block
    2. Summary paragraph
    3. Quick-highlights checklist
    4. File metadata row (format / size / last-updated)
    5. Pending badge when !fileExists
    6. CTA row (primary download + secondary mailto)

  The download button is the primary CTA and only renders when
  `data.fileExists` is true. Until the PDF is uploaded under
  frontend/public/resume/, the card hides the broken download link
  and surfaces a "PDF being refreshed" badge alongside a mailto
  fallback so the recruiter never hits the original 404.

  File metadata (fileSize) is nullable on purpose — the fileSize field
  is set to null in resume.js until the asset is uploaded. The card
  hides that metadata bullet when null so we never show fake numbers.
-->

<template>
  <div v-if="data" class="ai-section">
    <h4 class="ai-section-title">
      <ion-icon name="document-text-outline"></ion-icon>
      Resume
    </h4>

    <div class="ai-resume-content">
      <header class="ai-resume-header">
        <div>
          <h3 class="ai-resume-name">{{ data.fullName }}</h3>
          <p class="ai-resume-title">{{ data.title }}</p>
        </div>
      </header>

      <p v-if="data.summary" class="ai-resume-summary">{{ data.summary }}</p>

      <div v-if="data.highlights?.length" class="ai-resume-highlights-block">
        <h6 class="ai-label">Quick highlights</h6>
        <ul class="ai-resume-highlights">
          <li v-for="(h, i) in data.highlights" :key="i">
            <ion-icon name="checkmark-circle-outline" aria-hidden="true"></ion-icon>
            <span>{{ h }}</span>
          </li>
        </ul>
      </div>

      <div class="ai-resume-action-area">
        <div class="ai-resume-meta">
          <span class="ai-meta-item">PDF format</span>
          <span v-if="data.fileSize" class="ai-meta-item">&middot; {{ data.fileSize }}</span>
          <span class="ai-meta-item">&middot; {{ displayDate }}</span>
        </div>

        <div v-if="!data.fileExists" class="ai-resume-pending-badge">
          <ion-icon name="sync-outline" aria-hidden="true"></ion-icon>
          PDF is being refreshed
        </div>

        <div class="ai-resume-cta-row">
          <a
            v-if="data.fileExists"
            class="ai-resume-download primary-cta"
            :href="data.fileUrl"
            :download="data.fileName"
            :aria-label="`Download ${data.fullName}'s resume as PDF`"
            rel="noopener"
          >
            <ion-icon name="download-outline" aria-hidden="true"></ion-icon>
            Download resume
          </a>

          <a
            v-if="data.contact?.email"
            class="ai-resume-email secondary-cta"
            :href="`mailto:${data.contact.email}?subject=Requesting%20${encodeURIComponent(data.fileName)}`"
            :aria-label="`Email ${data.fullName} to request the latest resume`"
            rel="noopener"
          >
            <ion-icon name="mail-outline" aria-hidden="true"></ion-icon>
            {{ data.fileExists ? "Email me instead" : "Email me for the latest PDF" }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  data: { type: Object, required: true },
});

const displayDate = computed(() => {
  if (!props.data.lastUpdated) return "Updated —";
  const date = new Date(props.data.lastUpdated);
  if (isNaN(date.getTime())) return `Updated ${props.data.lastUpdated}`;
  return (
    "Updated " +
    date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
});
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

.ai-resume-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
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

.ai-resume-summary {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--light-gray);
  border-bottom: 1px solid var(--onyx);
  padding-bottom: 12px;
}

.ai-label {
  color: var(--light-gray-70);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 8px;
}

.ai-resume-highlights {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ai-resume-highlights li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--light-gray);
}

.ai-resume-highlights li ion-icon {
  color: var(--vegas-gold);
  font-size: 15px;
  flex-shrink: 0;
  margin-top: 2px;
  display: inline;
}

.ai-resume-action-area {
  margin-top: 4px;
  padding-top: 14px;
  border-top: 1px solid var(--onyx);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-resume-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 11px;
  color: var(--light-gray-70);
}

.ai-resume-pending-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.22);
  color: #fbbf24;
  font-size: 12px;
  font-weight: 500;
  align-self: flex-start;
}

.ai-resume-pending-badge ion-icon {
  font-size: 14px;
  display: inline;
}

.ai-resume-cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.primary-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  background: var(--vegas-gold);
  color: var(--eerie-black-1);
  border: 1px solid var(--vegas-gold);
  transition: transform 180ms ease, opacity 180ms ease, box-shadow 180ms ease;
}

.primary-cta:hover {
  transform: translateY(-1px);
  opacity: 0.92;
  box-shadow: 0 4px 14px hsla(45, 100%, 72%, 0.18);
}

.primary-cta ion-icon {
  font-size: 16px;
  display: inline;
}

.secondary-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  background: transparent;
  color: var(--light-gray);
  border: 1px solid var(--onyx);
  transition: background 180ms ease, color 180ms ease, border-color 180ms ease;
}

.secondary-cta:hover {
  background: var(--eerie-black-1);
  color: var(--white-2);
  border-color: var(--light-gray-70);
}

.secondary-cta ion-icon {
  font-size: 15px;
  display: inline;
}

@media (max-width: 480px) {
  .ai-resume-cta-row {
    flex-direction: column;
  }
  .primary-cta,
  .secondary-cta {
    width: 100%;
  }
}
</style>
