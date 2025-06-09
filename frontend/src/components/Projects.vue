<script setup>
import { ref, onMounted, computed } from 'vue';
import { client, urlFor } from '../lib/client';

// Data
const works = ref([]);
const filterWork = ref([]);
const activeFilter = ref('All');
const currentPage = ref(1);
const pageSize = ref(6); // default; will auto-update below

// Categories
const categories = ref(['All']);

// Update page size responsively
const updatePageSize = () => {
  if (window.innerWidth >= 2000) pageSize.value = 8;
  else if (window.innerWidth >= 850) pageSize.value = 6;
  else if (window.innerWidth >= 450) pageSize.value = 4;
  else pageSize.value = 3;
};

onMounted(async () => {
  updatePageSize();
  window.addEventListener('resize', updatePageSize);

  const worksQuery = '*[_type == "works"] | order(_updatedAt desc)';
  const filterQuery = '*[_type == "works" && "All" in tags] | order(_updatedAt desc)';

  try {
    const worksData = await client.fetch(worksQuery);
    const filterData = await client.fetch(filterQuery);

    works.value = worksData;
    filterWork.value = filterData;

    // Extract unique tags
    const allTags = new Set(['All']);
    worksData.forEach((work) => {
      work.tags?.forEach((tag) => allTags.add(tag));
    });
    categories.value = Array.from(allTags);
  } catch (err) {
    console.error('Sanity fetch error:', err);
  }
});

const handleWorkFilter = (category) => {
  activeFilter.value = category;
  currentPage.value = 1;
  if (category === 'All') {
    filterWork.value = works.value;
  } else {
    filterWork.value = works.value.filter((work) => work.tags?.includes(category));
  }
};

// Pagination
const totalPages = computed(() =>
  Math.ceil(filterWork.value.length / pageSize.value)
);

const paginatedWorks = computed(() =>
  filterWork.value.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  )
);

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
</script>

<template>
    <!-- Filter Buttons -->
    <ul class="filter-list">
    <li
        v-for="(cat, index) in categories"
        :key="index"
        class="filter-item"
    >
        <button
        :class="{ active: activeFilter === cat }"
        @click="handleWorkFilter(cat)"
        data-filter-btn
        >
        {{ cat }}
        </button>
    </li>
    </ul>

    <!-- Project Items -->
    <ul class="project-list">
    <li
        v-for="(project, index) in paginatedWorks"
        :key="index"
        class="project-item active"
        data-filter-item
        :data-category="project.tags?.[0] || 'Other'"
    >
        <a :href="project.projectLink || '#'">
        <figure class="project-img">
            <div class="project-item-icon-box">
            <ion-icon name="eye-outline" />
            </div>
            <img
            :src="urlFor(project.imgUrl)"
            :alt="project.title"
            loading="lazy"
            />
        </figure>

        <h3 class="project-title">{{ project.title }}</h3>
        <p class="project-category">{{ project.tags?.[0] || 'Other' }}</p>
        </a>
    </li>
    </ul>

    <!-- Pagination Controls -->
    <div class="app__work-btns app__flex">
    <div
        :class="{ disabled: currentPage === 1 }"
        @click="prevPage"
    >
        <ion-icon name="chevron-back-outline" />
    </div>

    <span>{{ currentPage }} of {{ totalPages }}</span>

    <div
        :class="{ disabled: currentPage === totalPages || totalPages === 0 }"
        @click="nextPage"
    >
        <ion-icon name="chevron-forward-outline" />
    </div>
    </div>
</template>
