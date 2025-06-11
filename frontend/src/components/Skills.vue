<template>
  <h3 class="h3 testimonials-title">frontend</h3>
  <ul class="testimonials-list has-scrollbar">
    <li class="testimonials-item" v-for="(skill, index) in frontend" :key="index">
      <div class="content-card" data-testimonials-item>
        <figure class="testimonials-avatar-box">
          <img :src="skill.logo" :alt="skill.name" width="30" data-testimonials-avatar />
        </figure>

        <p class="h4 testimonials-item-title" data-testimonials-title>
          {{ skill.name }}
        </p>

        <div class="testimonials-text" data-testimonials-text>
          <p></p>
        </div>
      </div>
    </li>
  </ul>

  <h3 class="h3 testimonials-title">Backend</h3>
  <ul class="testimonials-list has-scrollbar">
    <li class="testimonials-item" v-for="(skill, index) in backend" :key="index">
      <div class="content-card" data-testimonials-item>
        <figure class="testimonials-avatar-box">
          <img :src="skill.logo" :alt="skill.name" width="30" data-testimonials-avatar />
        </figure>

        <p class="h4 testimonials-item-title" data-testimonials-title>
          {{ skill.name }}
        </p>

        <div class="testimonials-text" data-testimonials-text>
          <p></p>
        </div>
      </div>
    </li>
  </ul>

  <h3 class="h3 testimonials-title">Devops</h3>
  <ul class="testimonials-list has-scrollbar">
    <li class="testimonials-item" v-for="(skill, index) in devops" :key="index">
      <div class="content-card" data-testimonials-item>
        <figure class="testimonials-avatar-box">
          <img :src="skill.logo" :alt="skill.name" width="30" data-testimonials-avatar />
        </figure>

        <p class="h4 testimonials-item-title" data-testimonials-title>
          {{ skill.name }}
        </p>

        <div class="testimonials-text" data-testimonials-text>
          <p></p>
        </div>
      </div>
    </li>
  </ul>
  <h3 class="h3 testimonials-title">Other</h3>
  <ul class="testimonials-list has-scrollbar">
    <li class="testimonials-item" v-for="(skill, index) in other" :key="index">
      <div class="content-card" data-testimonials-item>
        <figure class="testimonials-avatar-box">
          <img :src="skill.logo" :alt="skill.name" width="30" data-testimonials-avatar />
        </figure>

        <p class="h4 testimonials-item-title" data-testimonials-title>
          {{ skill.name }}
        </p>

        <div class="testimonials-text" data-testimonials-text>
          <p></p>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
const frontend = [
  {
    name: "HTML",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  {
    name: "CSS",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  {
    name: "JavaScript",
    logo:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "TypeScript",
    logo:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "Vue",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  },
  {
    name: "React",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },

  {
    name: "Next.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  {
    name: "Nuxt.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg",
  },
  {
    name: "Electron",
    logo:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg",
  },
  {
    name: "Flutter",
    logo:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
  },
];

const backend = [
  {
    name: "Node.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "Express",
    logo:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  },
  {
    name: "MongoDB",
    logo:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "PostgreSQL",
    logo:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    name: "MySQL",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
];
const devops = [
  {
    name: "Docker",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  {
    name: "Kubernetes",
    logo:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
  },
  {
    name: "AWS",
    logo:
      "https://raw.githubusercontent.com/devicons/devicon/refs/tags/v2.16.0/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
  },
  {
    name: "CI/CD",
    logo:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/circleci/circleci-plain.svg",
  },
  {
    name: "Git",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    name: "GitHub",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  },
  {
    name: "Bitbucket",
    logo:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg",
  },
  {
    name: "GitLab",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg",
  },
];

const other = [
  {
    name: "python",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "C",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  },
  {
    name: "PHP",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  },
  {
    name: "Nginx",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg",
  },
  {
    name: "Apache",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg",
  },
  {
    name: "Linux",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  },
];
</script>
