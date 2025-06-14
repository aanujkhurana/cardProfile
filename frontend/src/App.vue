<template>
  <main>
    <ThemeToggle />
    <v-spacer></v-spacer>
    <Chatbox :api-url="chatbotApiUrl" ref="chatbot" />
    <Card></Card>
  </main>
</template>

<script setup>
import Card from "./components/Card.vue";
import ThemeToggle from "./components/ThemeToggle.vue";
import Chatbox from "./components/Chatbox.vue";
import { ref } from "vue";

const chatbotApiUrl = "http://localhost:3000/api/chat";

// Optional: Access chatbot methods
const chatbot = ref(null);

// Example: Open chat programmatically
const openChatFromButton = () => {
  chatbot.value?.openChat();
};
</script>
