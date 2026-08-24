<!--
  AchievementCard — premium polish (Phase 6) + interactive drilldown
  (Phase 6.5).

  Renders the structured achievements list from the `achievements`
  intent in src/lib/knowledge/router.js. Each achievement is a card
  with:
    1. Hero row: quantified metric (gold gradient text) + a subtle
       decorative icon (podium for wins, school for education/certs).
    2. Title.
    3. Context paragraph.
    4. Meta row: period + tag chips.
    5. Source-project link (only when router resolves sourceProject
       to a real project in projects.js).
    6. Click-to-expand toggle (Phase 6.5) that surfaces the matched
       project's case-study fields inline:
         - The problem
         - What I built
         - Challenges solved
       A real <button> with aria-expanded + aria-controls drives
       the toggle, so keyboard and screen-reader users get the
       same affordance as mouse / touch users. Only one card is
       open at a time, enforced by a single `openId` ref. The
       expand toggle renders only when the router has attached a
       caseStudy object with at least one populated field — if all
       three are empty, the toggle is hidden (no point opening a
       card with no detail to show).

       The expanded panel uses Vue's <Transition name="drilldown">
       with a max-height + opacity transition. prefers-reduced-motion
       disables the transition so users with motion sensitivity get
       an instant show/hide.

  The metric gradient uses -webkit-background-clip with a solid
  fallback color so non-webkit browsers still render the number in
  vegas-gold rather than transparent.
-->

<template>
  <div v-if="data?.achievements?.length" class="ai-section">
    <h4 class="ai-section-title">
      <ion-icon name="trophy-outline"></ion-icon>
      Key Achievements
    </h4>

    <section
      v-if="data.highlights?.length"
      class="ai-highlights-hero"
      aria-labelledby="achievements-highlights-title"
    >
      <h5 id="achievements-highlights-title" class="ai-highlights-title">
        <ion-icon name="trending-up-outline" aria-hidden="true"></ion-icon>
        Highlights at a glance
      </h5>
      <div class="ai-highlights-grid">
        <button
          v-for="h in data.highlights"
          :key="h.id"
          type="button"
          class="ai-highlight-tile"
          :class="{ 'is-active': isOpen(h.id) }"
          :aria-label="`Open case study for ${h.title} (${h.metric})`"
          @click="openAndScrollTo(h.id)"
        >
          <span class="ai-highlight-tile-metric">{{ h.metric }}</span>
          <span class="ai-highlight-tile-title">{{ h.title }}</span>
          <span v-if="h.period" class="ai-highlight-tile-period">{{ h.period }}</span>
        </button>
      </div>
    </section>

    <div class="ai-achievement-grid">
      <article
        v-for="item in data.achievements"
        :key="item.id"
        :id="cardId(item.id)"
        class="ai-achievement-card"
      >
        <div class="ai-achievement-hero">
          <span class="ai-achievement-metric">{{ item.metric }}</span>
          <ion-icon
            :name="achievementIcon(item)"
            class="ai-achievement-bg-icon"
            aria-hidden="true"
          ></ion-icon>
        </div>

        <h5 class="ai-achievement-title">{{ item.title }}</h5>

        <p class="ai-achievement-context">{{ item.context }}</p>

        <div class="ai-achievement-meta">
          <span class="ai-achievement-period">{{ item.period }}</span>
          <div v-if="item.tags?.length" class="ai-achievement-chips">
            <span v-for="tag in item.tags" :key="tag" class="ai-focus-chip">{{ tag }}</span>
          </div>
        </div>

        <div
          v-if="item.sourceProjectUrl && !hasCaseStudyContent(item)"
          class="ai-achievement-source"
        >
          <a
            :href="item.sourceProjectUrl"
            class="ai-source-link"
            :aria-label="`View the ${item.sourceProjectName} case study`"
          >
            <ion-icon name="open-outline" aria-hidden="true"></ion-icon>
            View project: {{ item.sourceProjectName }}
          </a>
        </div>

        <div
          v-if="hasCaseStudyContent(item)"
          class="ai-achievement-drilldown"
        >
          <button
            type="button"
            class="ai-drilldown-toggle"
            :aria-expanded="isOpen(item.id) ? 'true' : 'false'"
            :aria-controls="panelId(item.id)"
            @click="toggle(item.id)"
          >
            <span class="ai-drilldown-toggle-label">
              <ion-icon
                :name="isOpen(item.id) ? 'chevron-up-outline' : 'chevron-down-outline'"
                aria-hidden="true"
              ></ion-icon>
              {{ isOpen(item.id) ? "Hide case study" : "Show case study" }}
            </span>
            <span v-if="item.sourceProjectName" class="ai-drilldown-toggle-meta">
              {{ item.sourceProjectName }}
            </span>
          </button>

          <Transition name="drilldown">
            <div
              v-if="isOpen(item.id)"
              :id="panelId(item.id)"
              class="ai-drilldown-panel"
              role="region"
              :aria-label="`Case study details for ${item.title}`"
            >
              <div v-if="item.caseStudy.businessProblem" class="ai-case-section">
                <h6 class="ai-label">The problem</h6>
                <p>{{ item.caseStudy.businessProblem }}</p>
              </div>

              <div v-if="item.caseStudy.solution" class="ai-case-section">
                <h6 class="ai-label">What I built</h6>
                <p>{{ item.caseStudy.solution }}</p>
              </div>

              <div
                v-if="item.caseStudy.challengesSolved?.length"
                class="ai-case-section"
              >
                <h6 class="ai-label">Challenges solved</h6>
                <ul class="ai-drilldown-list">
                  <li
                    v-for="c in item.caseStudy.challengesSolved"
                    :key="c"
                  >{{ c }}</li>
                </ul>
              </div>

              <a
                v-if="item.caseStudy.url && item.caseStudy.url !== '/'"
                :href="item.caseStudy.url"
                class="ai-drilldown-read-more"
                :aria-label="`Read the full ${item.caseStudy.name} case study`"
              >
                Read full case study
                <ion-icon name="arrow-forward-outline" aria-hidden="true"></ion-icon>
              </a>
            </div>
          </Transition>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";

const props = defineProps({
  data: { type: Object, required: true },
});

/**
 * Tracks the currently-open achievement id. Only one card is open at
 * a time — opening a new one closes the previous one. This keeps the
 * focus on a single drilldown at a time and avoids the page getting
 * visually busy when several case studies are expanded.
 */
const openId = ref(null);

function isOpen(id) {
  return openId.value === id;
}

function toggle(id) {
  openId.value = openId.value === id ? null : id;
}

function panelId(id) {
  return `achievement-panel-${id}`;
}

/**
 * Stable DOM id for the achievement <article>. Used as the scroll
 * target by `openAndScrollTo` and the find-by-id path for keyboard /
 * screen-reader deep linking.
 */
function cardId(id) {
  return `achievement-card-${id}`;
}

/**
 * Click handler for the highlight tiles (Phase 6.7). Opens the
 * matching achievement's drilldown via `openId`, then waits one
 * tick for Vue to render the panel and scrolls the card into view
 * so the user lands on the expanded content. The tile also gets
 * an `is-active` visual cue (driven by `isOpen(h.id)`) so the
 * cause-and-effect is obvious without reading the screen.
 *
 * prefers-reduced-motion users get an instant scroll (no smooth
 * animation) — matching the drilldown transition's reduced-motion
 * fallback.
 */
function openAndScrollTo(id) {
  openId.value = id;
  nextTick(() => {
    const el = document.getElementById(cardId(id));
    if (!el || typeof el.scrollIntoView !== "function") return;
    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });
    // Move accessible focus to the matching drilldown toggle so
    // screen-reader users land on the same expanded state sighted
    // users see. preventScroll: true keeps the smooth scroll we
    // just started from being reset by the focus call. Gracefully
    // no-ops if the card has no drilldown toggle (e.g. the
    // GoDesta achievement, which has sourceProject: null and
    // therefore no caseStudy content).
    const toggle = el.querySelector(".ai-drilldown-toggle");
    if (toggle && typeof toggle.focus === "function") {
      toggle.focus({ preventScroll: true });
    }
  });
}

/**
 * Decorative icon per achievement type:
 *   - education / certification → school-outline
 *   - everything else (work wins) → podium-outline
 * The icon is purely visual; aria-hidden is set in the template.
 */
function achievementIcon(item) {
  const tags = item.tags || [];
  if (tags.includes("education") || tags.includes("certification")) {
    return "school-outline";
  }
  return "podium-outline";
}

/**
 * Only show the drilldown toggle when the router attached a
 * caseStudy payload with at least one populated field. If all three
 * (problem / solution / challenges) are empty, hide the toggle so
 * the user never expands into a blank panel.
 */
function hasCaseStudyContent(item) {
  const cs = item.caseStudy;
  if (!cs) return false;
  if (cs.businessProblem) return true;
  if (cs.solution) return true;
  if (Array.isArray(cs.challengesSolved) && cs.challengesSolved.length) {
    return true;
  }
  return false;
}
</script>

<style scoped>
.ai-section {
  background: var(--eerie-black-2);
  border: 1px solid var(--onyx);
  border-radius: 12px;
  padding: 16px;
  margin-top: 8px;
}

.ai-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--white-2);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 14px;
}

.ai-section-title ion-icon {
  color: var(--orange-yellow-crayola);
  font-size: 16px;
  display: inline;
}

.ai-achievement-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-achievement-card {
  background: var(--eerie-black-1);
  border: 1px solid var(--onyx);
  border-radius: 10px;
  padding: 14px 16px;
  position: relative;
  overflow: hidden;
}

.ai-achievement-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 8px;
}

.ai-achievement-metric {
  font-size: 18px;
  font-weight: 700;
  color: var(--vegas-gold);
  background: linear-gradient(45deg, var(--vegas-gold), var(--orange-yellow-crayola));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.01em;
  line-height: 1.1;
}

.ai-achievement-bg-icon {
  font-size: 22px;
  color: hsla(45, 100%, 72%, 0.18);
  flex-shrink: 0;
  display: inline;
}

.ai-achievement-title {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--white-2);
  line-height: 1.35;
}

.ai-achievement-context {
  margin: 0 0 10px;
  font-size: 12px;
  line-height: 1.55;
  color: var(--light-gray);
}

.ai-achievement-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--onyx);
}

.ai-achievement-period {
  font-size: 11px;
  font-weight: 500;
  color: var(--light-gray-70);
}

.ai-achievement-chips {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.ai-focus-chip {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 8px;
  background: rgba(255, 204, 51, 0.1);
  color: var(--orange-yellow-crayola);
  border: 1px solid rgba(255, 204, 51, 0.2);
  text-transform: lowercase;
  letter-spacing: 0.01em;
}

.ai-achievement-source {
  margin-top: 10px;
}

.ai-source-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 500;
  color: var(--vegas-gold);
  text-decoration: none;
  background: var(--onyx);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid transparent;
  transition: background 150ms ease, border-color 150ms ease, transform 180ms ease;
}

.ai-source-link:hover {
  background: hsla(45, 100%, 72%, 0.12);
  border-color: hsla(45, 100%, 72%, 0.3);
  transform: translateY(-1px);
}

.ai-source-link ion-icon {
  font-size: 12px;
  display: inline;
}

/* ------------------------------------------------------------------ */
/*  Phase 6.6 — Highlights at a glance hero tiles                      */
/* ------------------------------------------------------------------ */

.ai-highlights-hero {
  margin-bottom: 14px;
  padding: 12px 14px;
  background: hsla(45, 100%, 72%, 0.04);
  border: 1px solid hsla(45, 100%, 72%, 0.12);
  border-radius: 10px;
}

.ai-highlights-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 10px;
  color: var(--white-2);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.ai-highlights-title ion-icon {
  color: var(--orange-yellow-crayola);
  font-size: 14px;
  display: inline;
}

.ai-highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
}

.ai-highlight-tile {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  background: var(--eerie-black-1);
  border: 1px solid var(--onyx);
  border-radius: 8px;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 150ms ease, background 150ms ease,
    transform 180ms var(--ease, ease);
}

.ai-highlight-tile:hover {
  border-color: hsla(45, 100%, 72%, 0.35);
  background: hsla(45, 100%, 72%, 0.05);
  transform: translateY(-1px);
}

.ai-highlight-tile:active {
  transform: translateY(0);
}

.ai-highlight-tile:focus-visible {
  outline: 2px solid var(--orange-yellow-crayola);
  outline-offset: 2px;
}

/* Phase 6.7: the tile's matching drilldown is currently open.
   Tints the border + background so the cause-and-effect is
   visible without reading the screen. */
.ai-highlight-tile.is-active {
  border-color: var(--vegas-gold);
  background: hsla(45, 100%, 72%, 0.1);
}

.ai-highlight-tile-metric {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--vegas-gold);
  background: linear-gradient(45deg, var(--vegas-gold), var(--orange-yellow-crayola));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ai-highlight-tile-title {
  color: var(--white-2);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.35;
}

.ai-highlight-tile-period {
  color: var(--light-gray-70);
  font-size: 10px;
  margin-top: 2px;
}

@media (max-width: 480px) {
  .ai-highlights-grid {
    grid-template-columns: 1fr;
  }
}

/* ------------------------------------------------------------------ */
/*  Phase 6.5 — click-to-expand case-study drilldown                    */
/* ------------------------------------------------------------------ */

.ai-achievement-drilldown {
  margin-top: 10px;
}

.ai-drilldown-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
  background: var(--onyx);
  color: var(--white-2);
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 6px 10px;
  font: inherit;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background 150ms ease, border-color 150ms ease;
}

.ai-drilldown-toggle:hover {
  background: hsla(45, 100%, 72%, 0.1);
  border-color: hsla(45, 100%, 72%, 0.25);
}

.ai-drilldown-toggle:focus-visible {
  outline: 2px solid var(--orange-yellow-crayola);
  outline-offset: 2px;
}

.ai-drilldown-toggle[aria-expanded="true"] {
  background: hsla(45, 100%, 72%, 0.1);
  border-color: hsla(45, 100%, 72%, 0.3);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.ai-drilldown-toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--vegas-gold);
}

.ai-drilldown-toggle-label ion-icon {
  font-size: 14px;
  display: inline;
  transition: transform 180ms ease;
}

.ai-drilldown-toggle[aria-expanded="true"] .ai-drilldown-toggle-label ion-icon {
  transform: rotate(0deg);
}

.ai-drilldown-toggle-meta {
  font-size: 10px;
  color: var(--light-gray-70);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 50%;
}

.ai-drilldown-panel {
  background: hsla(0, 0%, 0%, 0.18);
  border: 1px solid hsla(45, 100%, 72%, 0.2);
  border-top: none;
  border-radius: 0 0 6px 6px;
  padding: 10px 12px 12px;
  overflow: hidden;
}

.ai-case-section {
  margin-bottom: 10px;
}

.ai-case-section:last-of-type {
  margin-bottom: 0;
}

.ai-label {
  color: var(--light-gray-70);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 4px;
}

.ai-case-section p {
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--light-gray);
}

.ai-drilldown-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ai-drilldown-list li {
  font-size: 12px;
  color: var(--light-gray);
  padding: 2px 0 2px 12px;
  position: relative;
  line-height: 1.5;
}

.ai-drilldown-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 9px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--orange-yellow-crayola);
}

.ai-drilldown-read-more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 11px;
  font-weight: 500;
  color: var(--vegas-gold);
  text-decoration: none;
  border-bottom: 1px dashed hsla(45, 100%, 72%, 0.3);
  padding-bottom: 1px;
  transition: border-color 150ms ease, transform 180ms ease;
}

.ai-drilldown-read-more:hover {
  border-color: var(--vegas-gold);
  transform: translateX(2px);
}

.ai-drilldown-read-more ion-icon {
  font-size: 12px;
  display: inline;
}

/* Vue Transition: smooth max-height + opacity expand/collapse.
   The element starts collapsed (max-height: 0) and animates to a
   tall cap (max-height: 800px) — large enough for the longest
   possible case study without clipping. */

.drilldown-enter-active,
.drilldown-leave-active {
  transition: max-height 220ms var(--ease, ease), opacity 180ms ease,
    padding 220ms var(--ease, ease);
  overflow: hidden;
}

.drilldown-enter-from,
.drilldown-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.drilldown-enter-to,
.drilldown-leave-from {
  max-height: 800px;
  opacity: 1;
}

/* Respect prefers-reduced-motion: skip the height/opacity animation. */
@media (prefers-reduced-motion: reduce) {
  .drilldown-enter-active,
  .drilldown-leave-active {
    transition: none;
  }
  .ai-drilldown-toggle-label ion-icon {
    transition: none;
  }
}
</style>
