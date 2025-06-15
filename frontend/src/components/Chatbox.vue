<!-- PortfolioChatbot.vue -->
<template>
  <div class="chatbot-container">
    <!-- Chat Toggle Button -->
    <button
      v-if="!isOpen"
      @click="toggleChat"
      class="chat-toggle-btn"
      aria-label="Open chat"
    >
      <ion-icon name="chatbubbles-outline"></ion-icon>
      <span class="chat-badge" v-if="hasUnreadWelcome"></span>
    </button>

    <!-- Chat Window -->
    <div v-if="isOpen" class="chat-window">
      <!-- Header -->
      <div class="chat-header">
        <div class="chat-title">
          <Bot :size="20" />
          <span>Ask about Anuj's work</span>
        </div>
        <button @click="toggleChat" class="close-btn" aria-label="Close chat">
          <ion-icon name="remove-outline"></ion-icon>
        </button>
      </div>

      <!-- Messages -->
      <div ref="messagesContainer" class="messages-container">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message', message.type]"
        >
          <div class="message-content">
            <div
              v-if="message.type === 'bot'"
              class="message-text"
              v-html="formatMessage(message.text)"
            ></div>
            <div v-else class="message-text">{{ message.text }}</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="message bot">
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-area">
        <div class="quick-questions" v-if="messages.length <= 1">
          <button
            v-for="question in quickQuestions"
            :key="question"
            @click="sendMessage(question)"
            class="quick-question-btn"
            :disabled="isTyping"
          >
            {{ question }}
          </button>
        </div>

        <div class="input-container">
          <input
            ref="messageInput"
            v-model="currentMessage"
            @keydown.enter="handleSendMessage"
            @keydown.escape="toggleChat"
            placeholder="Ask about projects, skills, or experience..."
            class="message-input"
            :disabled="isTyping"
          />
          <button
            @click="handleSendMessage"
            class="send-btn"
            :disabled="!currentMessage.trim() || isTyping"
            aria-label="Send message"
          >
            <ion-icon name="send-outline"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from "vue";
import { buildSystemPrompt } from "../lib/chatbox/systemPrompt.js";

// Props
const props = defineProps({
  openaiApiKey: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    default: "gpt-3.5-turbo",
  },
});

// Reactive state
const isOpen = ref(false);
const isTyping = ref(false);
const currentMessage = ref("");
const messages = reactive([]);
const conversationHistory = ref([]);
const hasUnreadWelcome = ref(true);

// Template refs
const messagesContainer = ref(null);
const messageInput = ref(null);

// Quick question suggestions
const quickQuestions = [
  "What are your main skills?",
  "Tell me about your latest project",
  "How do you use Vue 3?",
  "What's your experience with AWS?",
];

// Welcome message
const welcomeMessage = {
  id: "welcome",
  type: "bot",
  text:
    "Hi! I'm Anuj's portfolio assistant. I can tell you about his projects, skills, and experience. What would you like to know?",
  timestamp: new Date(),
};

// Initialize chat
onMounted(() => {
  messages.push(welcomeMessage);
});

// Auto-scroll to bottom when new messages arrive
watch(
  () => messages.length,
  async () => {
    await nextTick();
    scrollToBottom();
  }
);

// Focus input when chat opens
watch(isOpen, async (newValue) => {
  if (newValue) {
    hasUnreadWelcome.value = false;
    await nextTick();
    messageInput.value?.focus();
  }
});

// OpenAI API call function
const callOpenAI = async (userMessage) => {
  const messages = [
    { role: "system", content: buildSystemPrompt() },
    ...conversationHistory.value,
    { role: "user", content: userMessage },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${props.openaiApiKey}`,
    },
    body: JSON.stringify({
      model: props.model,
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// Methods
const toggleChat = () => {
  isOpen.value = !isOpen.value;
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const handleSendMessage = () => {
  if (currentMessage.value.trim() && !isTyping.value) {
    sendMessage(currentMessage.value.trim());
    currentMessage.value = "";
  }
};

const sendMessage = async (messageText) => {
  // Add user message
  const userMessage = {
    id: `user_${Date.now()}`,
    type: "user",
    text: messageText,
    timestamp: new Date(),
  };
  messages.push(userMessage);

  // Show typing indicator
  isTyping.value = true;

  try {
    // Call OpenAI API
    const aiResponse = await callOpenAI(messageText);

    // Add bot response
    const botMessage = {
      id: `bot_${Date.now()}`,
      type: "bot",
      text: aiResponse,
      timestamp: new Date(),
    };
    messages.push(botMessage);

    // Update conversation history (keep last 10 exchanges)
    conversationHistory.value.push(
      { role: "user", content: messageText },
      { role: "assistant", content: aiResponse }
    );

    if (conversationHistory.value.length > 20) {
      conversationHistory.value = conversationHistory.value.slice(-20);
    }
  } catch (error) {
    console.error("Chat error:", error);

    // Add error message
    const errorMessage = {
      id: `error_${Date.now()}`,
      type: "bot",
      text: error.message.includes("API")
        ? "I'm having trouble connecting to the AI service. Please check your API key and try again."
        : "Sorry, I encountered an error. Please try again in a moment.",
      timestamp: new Date(),
    };
    messages.push(errorMessage);
  } finally {
    isTyping.value = false;
  }
};

const formatMessage = (text) => {
  // Convert markdown-style links to HTML
  return text
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>'
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");
};

const formatTime = (timestamp) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(timestamp);
};

// Expose methods for parent component
defineExpose({
  openChat: () => {
    isOpen.value = true;
  },
  closeChat: () => {
    isOpen.value = false;
  },
  sendMessage,
  updateContext: (newContext) => {
    Object.assign(contextData, newContext);
  },
});
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  letter-spacing: 0.2px;
}

/* Toggle Button */
.chat-toggle-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--bg-gradient-onyx);
  border: none;
  color: var(--white-1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-1);
  transition: all 0.3s ease;
  position: relative;
}

.chat-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-1);
}

.chat-badge {
  position: absolute;
  top: -4px;
  right: 4px;
  background: #ef4444;
  color: var(--white-1);
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

/* Chat Window */
.chat-window {
  border: 1px solid var(--jet);
  width: 380px;
  height: 500px;
  background: var(--white-1);
  border-radius: 16px;
  box-shadow: var(--shadow-2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.chat-header {
  background: var(--bg-gradient-jet);
  color: var(--white-2);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--light-gray);
  cursor: pointer;
  padding: 4px;
  border-radius: 14px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: var(--border-gradient-onyx);
  color: var(--orange-yellow-crayola);
  box-shadow: var(--shadow-1);
}

/* Messages */
.messages-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--bg-gradient-jet) !important;
}

.message {
  display: flex;
  gap: 8px;
  max-width: 85%;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-text {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
}

.message.bot .message-text {
  background: var(--eerie-black-2);
  color: var(--light-gray);
}

.message.user .message-text {
  background: var(--bg-gradient-onyx);
  color: var(--white-2);
}

.message-text :deep(a) {
  color: var(--vegas-gold);
  text-decoration: underline;
}

.message.user .message-text :deep(a) {
  color: var(--vegas-gold);
}

.message-time {
  font-size: 11px;
  color: var(--light-gray-70);
  padding: 0 4px;
}

.message.user .message-time {
  text-align: right;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 10px 14px;
  background: var(--eerie-black-1);
  border-radius: 12px;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--light-gray);
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Quick Questions */
.quick-questions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.quick-question-btn {
  background: var(--onyx);
  border: 1px solid var(--border-gradient-onyx);
  color: var(--light-gray);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.quick-question-btn:hover:not(:disabled) {
  background: var(--bg-gradient-jet);
  color: var(--vegas-gold);
}

.quick-question-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Input Area */
.input-area {
  padding: 16px;
  border-top: 1px solid var(--jet);
  background: var(--eerie-black-2) !important;
}

.input-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid transparent !important;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  color: var(--white-1);
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: var(--vegas-gold) !important;
}

.message-input:disabled {
  background: var(--onyx);
  opacity: 0.7;
}

.send-btn {
  padding: 10px;
  background: var(--border-gradient-onyx);
  border-radius: 8px;
  box-shadow: var(--shadow-2);
  color: var(--orange-yellow-crayola);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: var(--light-gray-70);
}

.send-btn:hover:not(:disabled) {
  opacity: 0.9;
}

/* Mobile Responsiveness */
@media (max-width: 420px) {
  .chat-window {
    width: calc(100vw - 40px);
    height: calc(100vh - 40px);
    bottom: 20px;
    right: 20px;
  }

  .chatbot-container {
    bottom: 20px;
    right: 20px;
  }
}

/* Scrollbar Styling */
.messages-container::-webkit-scrollbar {
  width: 4px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: var(------bg-gradient-yellow-2);
  border-radius: 2px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: var(--eerie-black-2);
}
</style>
