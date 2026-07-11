<!--
  ContactCard — renders the structured contact data delivered by
  the `contact` and `availability` intents in
  src/lib/knowledge/router.js.

  Phase 7 update: surfaces `availabilityNote` as a prominent green
  badge at the top of the card, right under the section title, with
  a live pulse dot. A pre-existing v-if="data.availability" bug
  (router sends `availabilityNote`, not `availability`) meant the
  badge never actually showed before — this commit fixes that
  field name, renames the class to `ai-availability-badge`, and
  elevates the visual treatment.

  The pulse animation is disabled via prefers-reduced-motion so
  motion-sensitive users see a static dot.
-->

<template>
  <div class="ai-section">
    <h4 class="ai-section-title">
      <ion-icon name="mail-outline"></ion-icon>
      Contact
    </h4>

    <div
      v-if="data.availabilityNote"
      class="ai-availability-badge"
      role="status"
      aria-live="polite"
    >
      <span class="ai-availability-dot" aria-hidden="true"></span>
      <span class="ai-availability-text">{{ data.availabilityNote }}</span>
    </div>

    <div class="ai-contact-grid">
      <a :href="`mailto:${data.email}`" class="ai-contact-item">
        <ion-icon name="mail-outline"></ion-icon>
        <div>
          <span class="ai-contact-label">Email</span>
          <span class="ai-contact-value">{{ data.email }}</span>
        </div>
      </a>

      <a :href="data.linkedin" target="_blank" rel="noopener" class="ai-contact-item">
        <ion-icon name="logo-linkedin"></ion-icon>
        <div>
          <span class="ai-contact-label">LinkedIn</span>
          <span class="ai-contact-value">Connect</span>
        </div>
      </a>

      <a :href="data.github" target="_blank" rel="noopener" class="ai-contact-item">
        <ion-icon name="logo-github"></ion-icon>
        <div>
          <span class="ai-contact-label">GitHub</span>
          <span class="ai-contact-value">View Profile</span>
        </div>
      </a>

      <div class="ai-contact-item">
        <ion-icon name="location-outline"></ion-icon>
        <div>
          <span class="ai-contact-label">Location</span>
          <span class="ai-contact-value">{{ data.location }}</span>
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

/* ------------------------------------------------------------------ */
/*  Phase 7 — Currently open to opportunities badge                    */
/* ------------------------------------------------------------------ */

.ai-availability-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: rgba(74, 222, 128, 0.08);
  border: 1px solid rgba(74, 222, 128, 0.22);
  border-radius: 8px;
  color: #4ade80;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
}

.ai-availability-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  flex-shrink: 0;
  box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.6);
  animation: ai-pulse-dot 2s ease-out infinite;
}

.ai-availability-text {
  flex: 1;
}

@keyframes ai-pulse-dot {
  0% {
    box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.6);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(74, 222, 128, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ai-availability-dot {
    animation: none;
  }
}

/* ------------------------------------------------------------------ */
/*  Contact grid                                                       */
/* ------------------------------------------------------------------ */

.ai-contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.ai-contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--eerie-black-1);
  border: 1px solid var(--onyx);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 150ms ease;
}

a.ai-contact-item:hover {
  border-color: var(--light-gray-70);
}

.ai-contact-item ion-icon {
  font-size: 16px;
  color: var(--orange-yellow-crayola);
  display: inline;
  flex-shrink: 0;
}

.ai-contact-item div {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.ai-contact-label {
  font-size: 10px;
  color: var(--light-gray-70);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ai-contact-value {
  font-size: 12px;
  color: var(--white-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 400px) {
  .ai-contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
