<template>
  <div class="theme-toggle-wrapper">
    <label class="theme-toggle">
      <input type="checkbox" v-model="isLight" @change="toggleTheme" />
      <span class="slider"></span>
    </label>
        <ion-icon v-if="isIcon"  name="contrast-outline"></ion-icon>
        <ion-icon v-else name="sunny-outline"></ion-icon>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isLight = ref(false);
const isIcon = ref(false);

onMounted(() => {
  isLight.value = document.documentElement.classList.contains("light-theme");
});

const toggleTheme = () => {
  isIcon.value = !isIcon.value;
  document.documentElement.classList.toggle("light-theme");
};
</script>

<style scoped>
.theme-toggle-wrapper {
  display: flex;
  align-items: center;
  right: 8px;
  gap: 0.5rem;
}
ion-icon {
  color: #ffcc33;
}
/* iOS-style toggle */
.theme-toggle {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 17px;
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
  background-color: #424242;
  transition: background-color 0.4s;
  border-radius: 24px;
}

.slider::before {
  position: absolute;
  content: "";
  height: 13px;
  width: 13px;
  left: 3px;
  bottom: 2px;
  background-color: white;
  transition: transform 0.4s;
  border-radius: 50%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

input:checked + .slider {
  background-color: #ffcc33; /* Apple green */
}

input:checked + .slider::before {
  transform: translateX(13px);
}

:host, .theme-toggle-wrapper {
  position: fixed;
  top: 1rem;
  /* right: 1rem; */
  z-index: 1000;
  background-color: var(--eerie-black-100);
  /* padding: 0.5rem 1rem; */
  /* border-radius: 999px; */
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); */
}

</style>
