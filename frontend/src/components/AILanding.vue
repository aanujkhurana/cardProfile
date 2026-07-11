<template>
  <div class="ai-landing">
    <!-- Top bar -->
    <header class="ai-topbar">
      <div class="ai-topbar-brand">
        <img src="../assets/images/my-avatar.png" alt="Anuj Khurana" class="ai-topbar-avatar" />
        <span class="ai-topbar-name">Anuj Khurana</span>
      </div>
      <button class="ai-browse-btn" @click="$emit('browse-website')">
        <ion-icon name="globe-outline"></ion-icon>
        <span>Browse Website</span>
      </button>
    </header>

    <!-- Main content -->
    <div class="ai-main">
      <!-- Empty state / welcome -->
      <div v-if="messages.length <= 1" class="ai-welcome">
        <div class="ai-avatar">
          <img src="../assets/images/my-avatar.png" alt="AI Assistant" />
        </div>
        <h1 class="ai-welcome-title">Hi, I'm Anuj's AI Assistant</h1>
        <p class="ai-welcome-subtitle">Ask me anything about Anuj's skills, projects, or experience.</p>

        <!-- Suggestion chips -->
        <div class="ai-suggestions">
          <button
            v-for="suggestion in suggestions"
            :key="suggestion"
            class="ai-suggestion-chip"
            @click="sendMessage(suggestion)"
            :disabled="isTyping"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>

      <!-- Chat messages -->
      <div v-else ref="messagesContainer" class="ai-messages">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['ai-msg', message.type]"
        >
          <div v-if="message.type === 'bot'" class="ai-msg-avatar">
            <img src="../assets/images/my-avatar.png" alt="AI" />
          </div>
          <div class="ai-msg-content">
            <div
              v-if="message.type === 'bot'"
              class="ai-msg-text"
              v-html="formatMessage(message.text)"
            ></div>
            <div v-else class="ai-msg-text">{{ message.text }}</div>
            <div class="ai-msg-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="isTyping" class="ai-msg bot">
          <div class="ai-msg-avatar">
            <img src="../assets/images/my-avatar.png" alt="AI" />
          </div>
          <div class="ai-msg-content">
            <div class="ai-typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input area -->
    <div class="ai-input-area">
      <div class="ai-input-wrapper">
        <input
          ref="messageInput"
          v-model="currentMessage"
          @keydown.enter="handleSendMessage"
          placeholder="Ask about projects, skills, or experience..."
          class="ai-message-input"
          :disabled="isTyping"
          autofocus
        />
        <button
          @click="handleSendMessage"
          class="ai-send-btn"
          :disabled="!currentMessage.trim() || isTyping"
          aria-label="Send message"
        >
          <ion-icon name="arrow-up-outline"></ion-icon>
        </button>
      </div>
      <p class="ai-input-hint">AI can make mistakes. Check important info.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from "vue";
import { buildSystemPrompt } from "../lib/chatbox/systemPrompt.js";

const emit = defineEmits(["browse-website"]);

// Reactive state
const isTyping = ref(false);
const currentMessage = ref("");
const messages = reactive([]);
const conversationHistory = ref([]);

// Template refs
const messagesContainer = ref(null);
const messageInput = ref(null);

// Suggestion chips
const suggestions = [
  "Tell me about your skills",
  "What projects have you built?",
  "What's your work experience?",
  "How can I contact you?",
];

// Welcome message
const welcomeMessage = {
  id: "welcome",
  type: "bot",
  text: "Hi! I'm Anuj's portfolio AI. I can tell you about his projects, skills, and experience. What would you like to know?",
  timestamp: new Date(),
};

// Initialize chat
onMounted(() => {
  messages.push(welcomeMessage);
  nextTick(() => {
    messageInput.value?.focus();
  });
});

// Auto-scroll to bottom when new messages arrive
watch(
  () => messages.length,
  async () => {
    await nextTick();
    scrollToBottom();
  }
);

// OpenAI API call function
const callOpenAI = async (userMessage) => {
  const apiMessages = [
    { role: "system", content: buildSystemPrompt() },
    ...conversationHistory.value,
    { role: "user", content: userMessage },
  ];

  const apiUrl =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
      ? "/api/chat"
      : "https://openai-proxy-mujovdlo3-anuj-khuranas-projects.vercel.app/api/chat");

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: apiMessages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Proxy API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// Methods
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
  const userMessage = {
    id: `user_${Date.now()}`,
    type: "user",
    text: messageText,
    timestamp: new Date(),
  };
  messages.push(userMessage);

  isTyping.value = true;

  try {
    const aiResponse = await callOpenAI(messageText);

    const botMessage = {
      id: `bot_${Date.now()}`,
      type: "bot",
      text: aiResponse,
      timestamp: new Date(),
    };
    messages.push(botMessage);

    conversationHistory.value.push(
      { role: "user", content: messageText },
      { role: "assistant", content: aiResponse }
    );

    if (conversationHistory.value.length > 20) {
      conversationHistory.value = conversationHistory.value.slice(-20);
    }
  } catch (error) {
    console.error("Chat error:", error);

    const errorMessage = {
      id: `error_${Date.now()}`,
      type: "bot",
      text: error.message.includes("API")
        ? "I'm having trouble connecting to the AI service. Please try again."
        : "Sorry, I encountered an error. Please try again in a moment.",
      timestamp: new Date(),
    };
    messages.push(errorMessage);
  } finally {
    isTyping.value = false;
    nextTick(() => {
      messageInput.value?.focus();
    });
  }
};

const formatMessage = (text) => {
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
</script>

<style scoped>
.ai-landing {
  position: fixed;
  inset: 0;
  z-index: 900;
  display: flex;
  flex-direction: column;
  background: var(--eerie-black-1);
  font-family: var(--ff-poppins);
}

/* Top bar */
.ai-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 1px solid var(--onyx);
  background: var(--eerie-black-2);
  flex-shrink: 0;
}

.ai-topbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ai-topbar-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.ai-topbar-name {
  color: var(--white-2);
  font-size: var(--fs-6);
  font-weight: var(--fw-500);
}

.ai-browse-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  background: var(--bg-gradient-jet);
  color: var(--light-gray);
  font-size: var(--fs-7);
  border: 1px solid var(--onyx);
  transition: all var(--transition-1);
}

.ai-browse-btn:hover {
  color: var(--orange-yellow-crayola);
  border-color: var(--vegas-gold);
}

.ai-browse-btn ion-icon {
  font-size: 16px;
  color: inherit;
  display: inline;
}

/* Main content */
.ai-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0;
}

/* Welcome screen */
.ai-welcome {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  gap: 16px;
}

.ai-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 8px;
  box-shadow: 0 8px 32px rgba(255, 204, 51, 0.15);
}

.ai-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ai-welcome-title {
  color: var(--white-2);
  font-size: var(--fs-2);
  font-weight: var(--fw-600);
  text-align: center;
}

.ai-welcome-subtitle {
  color: var(--light-gray-70);
  font-size: var(--fs-6);
  text-align: center;
  max-width: 400px;
}

.ai-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 24px;
  max-width: 600px;
}

.ai-suggestion-chip {
  padding: 10px 18px;
  border-radius: 20px;
  background: var(--bg-gradient-jet);
  color: var(--light-gray);
  font-size: var(--fs-7);
  border: 1px solid var(--onyx);
  transition: all var(--transition-1);
  cursor: pointer;
  white-space: nowrap;
}

.ai-suggestion-chip:hover:not(:disabled) {
  color: var(--orange-yellow-crayola);
  border-color: var(--vegas-gold);
  background: var(--eerie-black-2);
}

.ai-suggestion-chip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Messages area */
.ai-messages {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 768px;
  margin: 0 auto;
  width: 100%;
}

.ai-msg {
  display: flex;
  gap: 12px;
  max-width: 100%;
  animation: ai-msg-in 0.3s ease-out;
}

.ai-msg.user {
  flex-direction: row-reverse;
}

.ai-msg-avatar {
  flex-shrink: 0;
}

.ai-msg-avatar img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.ai-msg-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.ai-msg-text {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: var(--fs-6);
  line-height: 1.6;
  word-wrap: break-word;
}

.ai-msg.bot .ai-msg-text {
  background: var(--bg-gradient-jet);
  color: var(--light-gray);
  border-top-left-radius: 4px;
}

.ai-msg.user .ai-msg-text {
  background: var(--bg-gradient-onyx);
  color: var(--white-2);
  border-top-right-radius: 4px;
  max-width: 80%;
  margin-left: auto;
}

.ai-msg-text :deep(a) {
  color: var(--vegas-gold);
  text-decoration: underline;
}

.ai-msg-time {
  font-size: 11px;
  color: var(--light-gray-70);
  padding: 0 4px;
}

.ai-msg.user .ai-msg-time {
  text-align: right;
}

/* Typing indicator */
.ai-typing-indicator {
  display: flex;
  gap: 5px;
  padding: 14px 18px;
  background: var(--bg-gradient-jet);
  border-radius: 16px;
  border-top-left-radius: 4px;
}

.ai-typing-indicator span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--light-gray);
  animation: ai-typing 1.4s infinite ease-in-out;
}

.ai-typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.ai-typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes ai-typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

@keyframes ai-msg-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Input area */
.ai-input-area {
  padding: 16px 24px 20px;
  border-top: 1px solid var(--onyx);
  background: var(--eerie-black-2);
  flex-shrink: 0;
}

.ai-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
  max-width: 768px;
  margin: 0 auto;
  background: var(--eerie-black-1);
  border: 1px solid var(--onyx);
  border-radius: 12px;
  padding: 4px 4px 4px 16px;
  transition: border-color var(--transition-1);
}

.ai-input-wrapper:focus-within {
  border-color: var(--vegas-gold);
}

.ai-message-input {
  flex: 1;
  padding: 10px 0;
  border: none;
  background: transparent;
  font-size: var(--fs-6);
  color: var(--white-1);
  outline: none;
  font-family: var(--ff-poppins);
}

.ai-message-input::placeholder {
  color: var(--light-gray-70);
}

.ai-message-input:disabled {
  opacity: 0.6;
}

.ai-send-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--bg-gradient-onyx);
  color: var(--orange-yellow-crayola);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-1);
  flex-shrink: 0;
}

.ai-send-btn:hover:not(:disabled) {
  box-shadow: var(--shadow-1);
}

.ai-send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  color: var(--light-gray-70);
}

.ai-send-btn ion-icon {
  font-size: 18px;
  color: inherit;
  display: inline;
}

.ai-input-hint {
  text-align: center;
  font-size: 11px;
  color: var(--light-gray-70);
  margin-top: 8px;
  opacity: 0.6;
}

/* Responsive */
@media (max-width: 580px) {
  .ai-topbar {
    padding: 10px 16px;
  }

  .ai-browse-btn span {
    display: none;
  }

  .ai-browse-btn {
    padding: 8px;
  }

  .ai-welcome {
    padding: 24px 16px;
  }

  .ai-welcome-title {
    font-size: var(--fs-3);
  }

  .ai-suggestions {
    flex-direction: column;
    align-items: stretch;
  }

  .ai-suggestion-chip {
    text-align: center;
  }

  .ai-messages {
    padding: 16px;
  }

  .ai-msg.user .ai-msg-text {
    max-width: 90%;
  }

  .ai-input-area {
    padding: 12px 16px 16px;
  }
}

@media (min-width: 581px) and (max-width: 1024px) {
  .ai-welcome-title {
    font-size: 22px;
  }
}
</style>
