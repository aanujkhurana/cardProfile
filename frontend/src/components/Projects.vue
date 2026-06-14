<template>
  <!-- Filter Buttons -->
  <ul class="filter-list">
    <li v-for="(cat, index) in categories" :key="index" class="filter-item">
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
      :key="project._id || project.title || index"
      class="project-item active"
      data-filter-item
      :data-category="project.tags?.[0] || 'Other'"
    >
      <a
        :href="project.projectLink || project.codeLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        <figure class="project-img">
          <div class="project-item-icon-box">
            <ion-icon name="eye-outline" />
          </div>
          <img
            v-if="project.imgUrl"
            :src="getProjectImageUrl(project)"
            :alt="project.title"
            width="640"
            height="360"
            loading="eager"
            decoding="async"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
          />
        </figure>
        <h3 class="project-title">{{ project.title }}</h3>
        <p class="project-category">{{ project.tags?.[0] || "Other" }}</p>
      </a>
    </li>
  </ul>

  <!-- Pagination Controls -->
  <div class="page-btns">
    <div :class="{ disabled: currentPage === 1 }" @click="prevPage" class="btn">
      <ion-icon name="chevron-back-outline" />
    </div>

    <span class="page-no">{{ currentPage }} of {{ totalPages }}</span>

    <div
      :class="{ disabled: currentPage === totalPages || totalPages === 0 }"
      @click="nextPage"
      class="btn"
    >
      <ion-icon name="chevron-forward-outline" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { client, urlFor } from "../lib/sanity_client";

// Data
const works = ref([]);
const filterWork = ref([]);
const activeFilter = ref("All");
const currentPage = ref(1);
const pageSize = ref(6); // default; will auto-update below
const preloadedImages = new Set();

// Categories
const categories = ref(["All"]);

// Update page size responsively
const updatePageSize = () => {
  if (window.innerWidth >= 2000) pageSize.value = 8;
  else if (window.innerWidth >= 850) pageSize.value = 6;
  else if (window.innerWidth >= 450) pageSize.value = 4;
  else pageSize.value = 3;
};

const getProjectImageUrl = (project) => {
  if (!project?.imgUrl) return "";

  return urlFor(project.imgUrl)
    .width(640)
    .height(360)
    .fit("crop")
    .auto("format")
    .quality(80)
    .url();
};

const preloadProjectImages = (projects) => {
  projects.forEach((project) => {
    const imageUrl = getProjectImageUrl(project);

    if (!imageUrl || preloadedImages.has(imageUrl)) return;

    const image = new Image();
    image.decoding = "async";
    image.src = imageUrl;
    preloadedImages.add(imageUrl);
  });
};

const getNextPageProjects = () => {
  const nextPageStart = currentPage.value * pageSize.value;
  return filterWork.value.slice(nextPageStart, nextPageStart + pageSize.value);
};

onMounted(async () => {
  updatePageSize();
  window.addEventListener("resize", updatePageSize);

  const worksQuery = '*[_type == "works"] | order(_updatedAt desc)';
  const filterQuery = '*[_type == "works" && "All" in tags] | order(_updatedAt desc)';

  try {
    const worksData = await client.fetch(worksQuery);
    const filterData = await client.fetch(filterQuery);

    works.value = worksData;
    filterWork.value = filterData;
    preloadProjectImages(worksData);

    // Extract unique tags
    const allTags = new Set(["All"]);
    worksData.forEach((work) => {
      work.tags?.forEach((tag) => allTags.add(tag));
    });
    categories.value = Array.from(allTags);
  } catch (err) {
    console.error("Sanity fetch error:", err);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updatePageSize);
});

const handleWorkFilter = (category) => {
  activeFilter.value = category;
  currentPage.value = 1;
  if (category === "All") {
    filterWork.value = works.value;
  } else {
    filterWork.value = works.value.filter((work) => work.tags?.includes(category));
  }
};

// Pagination
const totalPages = computed(() => Math.ceil(filterWork.value.length / pageSize.value));

const paginatedWorks = computed(() =>
  filterWork.value.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  )
);

watch(
  [paginatedWorks, pageSize],
  () => {
    preloadProjectImages([...paginatedWorks.value, ...getNextPageProjects()]);
  },
  { immediate: true }
);

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
</script>
