<template>
  <main>
    <!-- LIGHT TOGGLE -->
    <ThemeToggle />
    <v-spacer></v-spacer>
    <!-- CHAT BOX -->
    <Chatbox :openai-api-key="openaiApiKey" model="gpt-3.5-turbo" ref="chatbot" />
    <!-- PORTFOLIO CARD -->
    <Card></Card>
  </main>
</template>

<script setup>
import Card from "./components/Card.vue";
import ThemeToggle from "./components/ThemeToggle.vue";
import Chatbox from "./components/Chatbox.vue";
import { ref } from "vue";

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Optional: Access chatbot methods
const chatbot = ref(null);

// Example: Open chat programmatically
const openChatFromButton = () => {
  chatbot.value?.openChat();
};
</script>
