<template>
  <div class="theme-toggle-wrapper">
    <label class="theme-toggle" aria-label="Toggle theme">
      <input type="checkbox" v-model="isLight" @change="toggleTheme" />
      <span class="slider">
        <ion-icon class="moon-icon" name="moon-outline"></ion-icon>
        <ion-icon class="sun-icon" name="sunny-outline"></ion-icon>
      </span>
    </label>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isLight = ref(false);

onMounted(() => {
  isLight.value = document.documentElement.classList.contains("light-theme");
});

const toggleTheme = () => {
  document.documentElement.classList.toggle("light-theme", isLight.value);
};
</script>

<style scoped>
.theme-toggle-wrapper {
  display: flex;
  align-items: center;
  right: 10px;
}

@media (max-width: 579px) {
   .theme-toggle-wrapper {
    display: none;
    opacity: 0;
   }
}

.theme-toggle {
  position: relative;
  display: inline-block;
  width: 58px;
  height: 32px;
}

.theme-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  color: var(--accent);
  background: var(--surface-2);
  border: 1px solid var(--surface-border);
  transition: background var(--transition-2), border-color var(--transition-1), box-shadow var(--transition-1);
  border-radius: 999px;
  box-shadow: var(--shadow-1);
}

.slider::before {
  position: absolute;
  content: "";
  height: 24px;
  width: 24px;
  left: 4px;
  top: 3px;
  background: var(--text-gradient-yellow);
  transition: transform var(--transition-2);
  border-radius: 50%;
  box-shadow: 0 8px 20px hsla(0, 0%, 0%, 0.22);
  z-index: 0;
}

.slider ion-icon {
  position: relative;
  z-index: 1;
  width: 14px;
  height: 14px;
  color: var(--text-main);
  opacity: 0.76;
}

input:checked + .slider {
  border-color: var(--surface-border-strong);
  background: var(--bg-gradient-jet);
}

input:checked + .slider::before {
  transform: translateX(26px);
}

:host, .theme-toggle-wrapper {
  position: absolute;
  top: 1rem;
  z-index: 1000;
}

</style>
