<script setup>
import { ref, onMounted } from "vue";
import { client } from "../lib/sanity_client.js";

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
  <header>
    <h2 class="h2 article-title">Experience</h2>
  </header>

  <section class="timeline">
    <div class="title-wrapper">
      <div class="icon-box">
        <ion-icon name="book-outline"></ion-icon>
      </div>
      <h3 class="h3">Experience</h3>
    </div>
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
  </section>

  <section class="timeline">
    <div class="title-wrapper">
      <div class="icon-box">
        <ion-icon name="book-outline"></ion-icon>
      </div>

      <h3 class="h3">Education</h3>
    </div>

    <ol class="timeline-list">
      <li class="timeline-item">
        <h4 class="h4 timeline-item-title">
         Master of Information Technology in Software Development & Support
        </h4>

        <span>2024</span>

        <p class="timeline-text">
          Griffith University
        </p>
      </li>
    </ol>
  </section>

  <section class="timeline">
    <div class="title-wrapper">
      <div class="icon-box">
        <ion-icon name="book-outline"></ion-icon>
      </div>

      <h3 class="h3">Certificates</h3>
    </div>

    <ol class="timeline-list">
      <li class="timeline-item">
        <h4 class="h4 timeline-item-title">
          <a href="https://www.hackerrank.com/certificates/fc67ad9cf98d" target="_blank"
            >Python
          </a>
        </h4>
        <p class="timeline-text">HackerRank</p>
      </li>
      <li class="timeline-item">
        <h4 class="h4 timeline-item-title">
          <a
            href="https://www.freecodecamp.org/certification/fcc8fef749d-61ec-4fed-95cf-dac26473a2b6/back-end-development-and-apis"
            target="_blank"
            >Backend Development & API
          </a>
        </h4>
        <p class="timeline-text">FreeCodeCamp</p>
      </li>
      <li class="timeline-item">
        <h4 class="h4 timeline-item-title">
          <a href="https://www.hackerrank.com/certificates/43ae65a24b0f" target="_blank"
            >SQL</a
          >
        </h4>
        <p class="timeline-text">HackerRank</p>
      </li>
      <li class="timeline-item">
        <h4 class="h4 timeline-item-title">
          <a href="https://www.udemy.com/certificate/UC-KYJCWBQF/" target="_blank"
            >User Experience Essentials</a
          >
        </h4>
        <p class="timeline-text">Udemy</p>
      </li>
    </ol>
  </section>
</template>
