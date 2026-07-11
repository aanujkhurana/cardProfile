<template>
  <main>
    <!-- AI LANDING (default view) -->
    <div v-show="showAI" class="ai-landing-wrapper">
      <AILanding @browse-website="showAI = false" />
    </div>

    <!-- EXISTING WEBSITE (always mounted, just hidden) -->
    <div v-show="!showAI" class="website-wrapper">
      <ThemeToggle />
      <v-spacer></v-spacer>
      <Chatbox openai-api-key="" model="gpt-3.5-turbo" />
      <Card></Card>

      <!-- Back to AI floating button -->
      <button class="back-to-ai-btn" @click="showAI = true" aria-label="Back to AI assistant">
        <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
      </button>
    </div>
  </main>
</template>

<script setup>
import Card from "./components/Card.vue";
import ThemeToggle from "./components/ThemeToggle.vue";
import Chatbox from "./components/Chatbox.vue";
import AILanding from "./components/AILanding.vue";
import { ref } from "vue";

// AI is the default view
const showAI = ref(true);
</script>

<style>
/* AI landing wrapper - fullscreen overlay */
.ai-landing-wrapper {
  position: fixed;
  inset: 0;
  z-index: 900;
}

/* Website wrapper */
.website-wrapper {
  position: relative;
}

/* Back to AI floating button */
.back-to-ai-btn {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 999;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--bg-gradient-onyx);
  border: 1px solid var(--onyx);
  color: var(--orange-yellow-crayola);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-to-ai-btn:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-3);
  color: var(--vegas-gold);
}

.back-to-ai-btn ion-icon {
  font-size: 22px;
  color: inherit;
  display: inline;
}

@media (min-width: 1250px) {
  .website-wrapper {
    display: contents;
  }
}

@media (max-width: 580px) {
  .back-to-ai-btn {
    bottom: 80px;
    left: 16px;
    width: 46px;
    height: 46px;
  }
}
</style>
