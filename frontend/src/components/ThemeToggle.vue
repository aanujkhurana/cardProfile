<template>
  <div class="theme-toggle-wrapper">
    <ion-icon name="contrast-outline"></ion-icon>
    <label class="theme-toggle">
      <input type="checkbox" v-model="isLight" @change="toggleTheme" />
      <span class="slider"></span>
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
  document.documentElement.classList.toggle("light-theme");
};
</script>

<style scoped>
.theme-toggle-wrapper {
  display: flex;
  align-items: center;
  justify-content: left;
  position: relative;
  top: -20px;
  right: 10px;
  gap: 2rem;
}
ion-icon {
  color: #ffcc33;
}
/* iOS-style toggle */
.theme-toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
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
  border-radius: 34px;
}

.slider::before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
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
  transform: translateX(24px);
}
</style>
