<!-- ThemeToggle.vue -->
<template>
  <button @click="toggleTheme" class="theme-toggle">
    <span v-if="isLight">🌞 Light</span>
    <span v-else>🌙 Dark</span>
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isLight = ref(false);

const toggleTheme = () => {
  isLight.value = !isLight.value;
  document.documentElement.classList.toggle("light-theme", isLight.value);
  localStorage.setItem("theme", isLight.value ? "light" : "dark");
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    isLight.value = true;
    document.documentElement.classList.add("light-theme");
  }
});
</script>

<style scoped>
.theme-toggle {
  background: var(--card-bg);
  border: none;
  color: var(--text-color);
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: background var(--transition-1);
}
</style>
