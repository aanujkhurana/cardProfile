import { ref } from "vue";

// Single shared source of truth for theme state so the static-site toggle
// and the AI-chat toggle stay in sync. Both views key off the same
// `light-theme` class on <html>, which style.css (:root / :root.light-theme)
// and AILanding.vue's :root.light-theme overrides consume.
const isLight = ref(
  typeof document !== "undefined" &&
    document.documentElement.classList.contains("light-theme")
);

function applyTheme() {
  document.documentElement.classList.toggle("light-theme", isLight.value);
}

export function useTheme() {
  const toggleTheme = () => {
    isLight.value = !isLight.value;
    applyTheme();
  };

  return { isLight, toggleTheme };
}
