<template>
  <main>
    <!-- AI LANDING (default view) -->
    <Transition name="ai-fade">
      <AILanding v-if="showAI" @browse-website="showAI = false" />
    </Transition>

    <!-- EXISTING WEBSITE -->
    <Transition name="website-fade">
      <div v-if="!showAI" class="website-wrapper">
        <ThemeToggle />
        <v-spacer></v-spacer>
        <Chatbox :openai-api-key="openaiApiKey" model="gpt-3.5-turbo" ref="chatbot" />
        <Card></Card>

        <!-- Back to AI floating button -->
        <button class="back-to-ai-btn" @click="showAI = true" aria-label="Back to AI assistant">
          <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
        </button>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import Card from "./components/Card.vue";
import ThemeToggle from "./components/ThemeToggle.vue";
import Chatbox from "./components/Chatbox.vue";
import AILanding from "./components/AILanding.vue";
import { ref } from "vue";

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const chatbot = ref(null);

// AI is the default view
const showAI = ref(true);
</script>

<style>
/* Global transition styles */

/* AI landing fade in/out */
.ai-fade-enter-active,
.ai-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.ai-fade-enter-from {
  opacity: 0;
  transform: scale(0.98);
}
.ai-fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

/* Website fade in/out */
.website-fade-enter-active,
.website-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.website-fade-enter-from {
  opacity: 0;
  transform: scale(1.02);
}
.website-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
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

@media (max-width: 580px) {
  .back-to-ai-btn {
    bottom: 80px;
    left: 16px;
    width: 46px;
    height: 46px;
  }
}
</style>
