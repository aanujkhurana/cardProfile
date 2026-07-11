<template>
  <div class="ai-section">
    <h4 class="ai-section-title">
      <ion-icon name="school-outline"></ion-icon>
      Education & Certifications
    </h4>

    <div v-for="(item, i) in data.education" :key="i" class="ai-edu-card">
      <h5 class="ai-edu-degree">{{ item.degree }}</h5>
      <p class="ai-edu-institution">{{ item.institution }}</p>
      <p class="ai-edu-meta">{{ item.location }} &middot; {{ item.year }}</p>
      <p v-if="item.specialization" class="ai-edu-spec">{{ item.specialization }}</p>
    </div>

    <div v-if="data.certifications?.length" class="ai-certs">
      <h5 class="ai-cert-title">Certifications</h5>
      <div v-for="cert in data.certifications" :key="cert.name" class="ai-cert-item">
        <span class="ai-cert-name">{{ cert.name }}</span>
        <span class="ai-cert-meta">{{ cert.issuer }} &middot; {{ cert.year }}</span>
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

.ai-edu-card {
  background: var(--eerie-black-1);
  border: 1px solid var(--onyx);
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 8px;
}

.ai-edu-card:last-child {
  margin-bottom: 0;
}

.ai-edu-degree {
  color: var(--white-2);
  font-size: 13px;
  font-weight: 600;
}

.ai-edu-institution {
  color: var(--light-gray);
  font-size: 12px;
}

.ai-edu-meta {
  color: var(--light-gray-70);
  font-size: 11px;
}

.ai-edu-spec {
  color: var(--light-gray-70);
  font-size: 11px;
  font-style: italic;
  margin-top: 4px;
}

.ai-certs {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--onyx);
}

.ai-cert-title {
  color: var(--light-gray-70);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}

.ai-cert-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid var(--onyx);
}

.ai-cert-item:last-child {
  border-bottom: none;
}

.ai-cert-name {
  color: var(--white-2);
  font-size: 12px;
  font-weight: 500;
}

.ai-cert-meta {
  color: var(--light-gray-70);
  font-size: 11px;
}
</style>
