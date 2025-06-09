<template>
  <section class="projects">
    <ul class="filter-list">
      <li v-for="(item, i) in filters" :key="i" class="filter-item">
        <button :class="{ active: activeFilter === item }" @click="applyFilter(item)">
          {{ item }}
        </button>
      </li>
    </ul>

    <ul class="project-list">
      <li
        v-for="(work, index) in paginatedWorks"
        :key="index"
        class="project-item active"
        :data-category="work.tags[0]"
      >
        <a :href="work.projectLink" target="_blank">
          <figure class="project-img">
            <div class="project-item-icon-box">
              <ion-icon name="eye-outline" />
            </div>
            <img :src="urlFor(work.imgUrl)" :alt="work.title" loading="lazy" />
          </figure>
          <h3 class="project-title">{{ work.title }}</h3>
          <p class="project-category">{{ work.tags[0] }}</p>
        </a>
      </li>
    </ul>

    <!-- Pagination Controls -->
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Prev</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">Next</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { client, urlFor } from '../lib/client.js'

const works = ref<any[]>([]);
const filteredWorks = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(6);
const filters = ['All', 'Web design', 'Applications', 'Web development'];
const activeFilter = ref('All');

const fetchWorks = async () => {
  const data = await client.fetch(`*[_type == "works"] | order(_updatedAt desc)`);
  works.value = data;
  filteredWorks.value = data;
};

const applyFilter = (filter: string) => {
  activeFilter.value = filter;
  currentPage.value = 1;
  if (filter === 'All') {
    filteredWorks.value = works.value;
  } else {
    filteredWorks.value = works.value.filter((work) => work.tags.includes(filter));
  }
};

const totalPages = computed(() => Math.ceil(filteredWorks.value.length / pageSize.value));

const paginatedWorks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredWorks.value.slice(start, end);
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

onMounted(() => {
  fetchWorks();

  const updatePageSize = () => {
    const width = window.innerWidth;
    if (width >= 2000) pageSize.value = 8;
    else if (width >= 850) pageSize.value = 6;
    else if (width >= 450) pageSize.value = 4;
    else pageSize.value = 3;
  };

  updatePageSize();
  window.addEventListener('resize', updatePageSize);
});
</script>

<style scoped>
/* Add your existing styles here */
</style>
