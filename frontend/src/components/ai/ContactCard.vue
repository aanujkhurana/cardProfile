<template>
  <div class="ai-section">
    <h4 class="ai-section-title">
      <ion-icon name="mail-outline"></ion-icon>
      Contact
    </h4>

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

    <div v-if="data.availability" class="ai-availability">
      <ion-icon name="checkmark-circle-outline"></ion-icon>
      {{ data.availability }}
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
}

.ai-availability {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 8px 12px;
  background: rgba(74, 222, 128, 0.08);
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: 8px;
  color: #4ade80;
  font-size: 12px;
}

.ai-availability ion-icon {
  font-size: 14px;
  color: inherit;
  display: inline;
}

@media (max-width: 400px) {
  .ai-contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
