<template>
  <label class="theme-toggle">
    <input type="checkbox" v-model="isLight" @change="toggleTheme" />
    <span class="slider" />
  </label>
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
.theme-toggle {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
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
  background-color: #424242; /* Dark background for toggle */
  transition: background-color 0.4s;
  border-radius: 34px;
}

.slider::before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: transform 0.4s;
  border-radius: 50%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

input:checked + .slider {
  background-color: hsl(45, 100%, 55%);
}

input:checked + .slider::before {
  transform: translateX(24px);
}
</style>
