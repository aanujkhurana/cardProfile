<script setup>
import { ref, onMounted } from "vue";
import { client } from "../lib/client.js";

const experiences = ref([]);

const fetchExperiences = async () => {
  // Fetch and order experiences by year descending
  const query = '*[_type == "experiences"] | order(year desc)';
  const data = await client.fetch(query);
  experiences.value = data;
};

onMounted(() => {
  fetchExperiences();
});
</script>

<template>
  <ol class="timeline-list">
    <template v-for="experience in experiences" :key="experience.year">
      <li
        v-for="work in experience.works"
        :key="work.date + work.desc"
        class="timeline-item"
      >
        <h4 class="h4 timeline-item-title">{{ work.name }}</h4>
        <span class="timeline-text">{{ experience.year }}</span>
        <p class="timeline-text">{{ work.company }} | {{ work.desc }}</p>
        <!-- <p class="timeline-text"></p> -->
      </li>
    </template>
  </ol>
</template>
