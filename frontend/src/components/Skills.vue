<template>
  <div class="skills-container">
    <section v-for="row in skillRows" :key="row.title" class="skills-row">
      <h3 class="h3 skills-heading">{{ row.title }}</h3>

      <div
        class="skills-carousel"
        @mouseenter="pauseAnimation(row.key)"
        @mouseleave="resumeAnimation"
      >
        <div
          class="skills-track"
          :class="{ paused: pausedRow === row.key }"
          :style="{ '--direction': row.direction, '--duration': row.duration }"
        >
          <div
            v-for="setIndex in 2"
            :key="`${row.key}-set-${setIndex}`"
            class="skills-group"
            :aria-hidden="setIndex === 2"
          >
            <div
              v-for="skill in row.skills"
              :key="`${row.key}-${setIndex}-${skill.name}`"
              class="skill-badge"
            >
              <span class="skill-icon">
                <img :src="skill.logo" :alt="skill.name" loading="lazy" decoding="async" />
              </span>
              <span class="skill-name">{{ skill.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const pausedRow = ref<string | null>(null);

const pauseAnimation = (rowKey: string) => {
  pausedRow.value = rowKey;
};

const resumeAnimation = () => {
  pausedRow.value = null;
};

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

const skillRows = [
  {
    key: "front",
    title: "Frontend",
    skills: frontend,
    direction: "normal",
    duration: "30s",
  },
  {
    key: "back",
    title: "Backend",
    skills: backend,
    direction: "reverse",
    duration: "24s",
  },
  {
    key: "devops",
    title: "DevOps",
    skills: devops,
    direction: "normal",
    duration: "28s",
  },
  {
    key: "other",
    title: "Other",
    skills: other,
    direction: "reverse",
    duration: "22s",
  },
];
</script>

<style scoped>
.skills-container {
  width: 100%;
  overflow: hidden;
}

.skills-row {
  margin-bottom: 3rem;
}

.skills-row:last-child {
  margin-bottom: 0;
}

.skills-heading {
  margin-bottom: 1.25rem;
  color: var(--white-2);
  letter-spacing: 0;
}

.skills-carousel {
  --skill-gap: 1rem;
  width: 100%;
  overflow: hidden;
  position: relative;
  padding: 0.75rem 0;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black 8%,
    black 92%,
    transparent
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    black 8%,
    black 92%,
    transparent
  );
}

.skills-track {
  display: flex;
  gap: var(--skill-gap);
  width: max-content;
  will-change: transform;
  animation: skills-scroll var(--duration) linear infinite both;
  animation-direction: var(--direction);
  transform: translate3d(0, 0, 0);
}

.skills-track.paused,
.skills-carousel:hover .skills-track,
.skills-carousel:focus-within .skills-track {
  animation-play-state: paused;
}

.skills-group {
  display: flex;
  gap: var(--skill-gap);
}

.skill-badge {
  position: relative;
  display: grid;
  grid-template-columns: 34px max-content;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
  min-width: 142px;
  height: 58px;
  padding: 0.65rem 1.05rem;
  overflow: hidden;
  background: var(--bg-gradient-onyx);
  border: 1px solid var(--jet);
  border-radius: 14px;
  box-shadow: none;
  cursor: pointer;
  transform: translate3d(0, 0, 0) scale(1);
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s ease,
    background 0.3s ease;
}

.skill-badge::before {
  content: "";
  position: absolute;
  inset: 1px;
  background: var(--bg-gradient-jet);
  border-radius: inherit;
  z-index: -1;
}

.skill-badge:hover {
  background: var(--bg-gradient-jet);
  border-color: var(--orange-yellow-crayola);
  box-shadow: var(--shadow-3);
  transform: translate3d(0, -8px, 0) scale(1.05);
  z-index: 2;
}

.skill-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: hsla(0, 0%, 100%, 0.08);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.skill-icon img {
  display: block;
  width: 28px;
  height: 28px;
  object-fit: contain;
  transition: transform 0.25s ease;
}

.skill-badge:hover .skill-icon img {
  transform: scale(1.15) rotate(5deg);
}

.skill-badge:hover .skill-icon {
  background: hsla(45, 100%, 72%, 0.12);
  box-shadow: inset 0 0 0 1px hsla(45, 100%, 72%, 0.22);
}

.skill-name {
  position: relative;
  z-index: 1;
  color: var(--white-2);
  font-size: 0.92rem;
  font-weight: var(--fw-500);
  line-height: 1.2;
  white-space: nowrap;
}

@keyframes skills-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-50% - (var(--skill-gap) / 2)));
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .skills-row {
    margin-bottom: 2.5rem;
  }

  .skills-carousel {
    --skill-gap: 0.75rem;
  }

  .skill-badge {
    grid-template-columns: 30px max-content;
    min-width: 128px;
    height: 52px;
    padding: 0.55rem 0.85rem;
    gap: 0.65rem;
  }

  .skill-icon {
    width: 30px;
    height: 30px;
  }

  .skill-icon img {
    width: 24px;
    height: 24px;
  }

  .skill-name {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .skills-carousel {
    --skill-gap: 0.625rem;
    -webkit-mask-image: none;
    mask-image: none;
  }

  .skill-badge {
    min-width: 118px;
    height: 48px;
    padding: 0.5rem 0.75rem;
  }

  .skill-name {
    font-size: 0.8rem;
  }
}
</style>
