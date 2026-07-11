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
      <!-- Welcome state -->
      <div v-if="messages.length <= 1" class="ai-welcome">
        <div class="ai-welcome-avatar">
          <img src="../assets/images/my-avatar.png" alt="AI Assistant" />
        </div>
        <h1 class="ai-welcome-title">How can I help you?</h1>
        <p class="ai-welcome-subtitle">Ask about Anuj's skills, projects, or experience.</p>
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
            <!-- Rich card response -->
            <template v-if="message.card">
              <div class="ai-msg-text ai-msg-text--card-intro">{{ message.text }}</div>
              <component :is="message.cardComponent" :data="message.cardData" />
            </template>
            <!-- Plain text response -->
            <template v-else>
              <div
                v-if="message.type === 'bot'"
                class="ai-msg-text"
                v-html="formatMessage(message.text)"
              ></div>
              <div v-else class="ai-msg-text">{{ message.text }}</div>
            </template>
            <div class="ai-msg-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="isTyping" class="ai-msg bot">
          <div class="ai-msg-avatar">
            <img src="../assets/images/my-avatar.png" alt="AI" />
          </div>
          <div class="ai-msg-content">
            <div class="ai-typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input area -->
    <div class="ai-input-area">
      <div v-if="messages.length <= 1" class="ai-chips">
        <button
          v-for="q in defaultQuestions"
          :key="q.label"
          class="ai-chip"
          @click="sendMessage(q.label)"
          :disabled="isTyping"
        >
          {{ q.label }}
        </button>
      </div>

      <div class="ai-input-row">
        <input
          ref="messageInput"
          v-model="currentMessage"
          @keydown.enter="handleSendMessage"
          placeholder="Ask anything..."
          class="ai-input"
          :disabled="isTyping"
          autofocus
        />
        <button
          @click="handleSendMessage"
          class="ai-send"
          :disabled="!currentMessage.trim() || isTyping"
          aria-label="Send"
        >
          <ion-icon name="arrow-up-outline"></ion-icon>
        </button>
      </div>
      <p class="ai-footnote">AI can make mistakes. Check important info.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from "vue";
import { routeQuery } from "../lib/knowledge/router.js";
import { sendToGemini, getGeminiErrorMessage } from "../lib/gemini/service.js";
import { defaultQuestions } from "../lib/config/defaultQuestions.js";
import { resolveComponent } from "./ai/index.js";

const emit = defineEmits(["browse-website"]);

const isTyping = ref(false);
const currentMessage = ref("");
const messages = reactive([]);
const conversationHistory = ref([]);

const messagesContainer = ref(null);
const messageInput = ref(null);

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

const welcomeMessage = {
  id: "welcome",
  type: "bot",
  text: "Hi! I'm Anuj's portfolio AI. I can tell you about his projects, skills, and experience. What would you like to know?",
  timestamp: new Date(),
};

onMounted(() => {
  messages.push(welcomeMessage);
  nextTick(() => messageInput.value?.focus());
});

watch(
  () => messages.length,
  async () => {
    await nextTick();
    scrollToBottom();
  }
);

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
  messages.push({
    id: `user_${Date.now()}`,
    type: "user",
    text: messageText,
    timestamp: new Date(),
  });

  isTyping.value = true;

  try {
    // Step 1: Try local knowledge first
    const localResponse = routeQuery(messageText);

    if (localResponse) {
      const cardComponent = localResponse.component !== "text"
        ? resolveComponent(localResponse.component)
        : null;

      messages.push({
        id: `bot_${Date.now()}`,
        type: "bot",
        text: localResponse.text,
        timestamp: new Date(),
        card: !!cardComponent,
        cardComponent: cardComponent,
        cardData: localResponse.data || null,
        source: "local",
      });

      conversationHistory.value.push(
        { role: "user", content: messageText },
        { role: "assistant", content: localResponse.text }
      );
    } else {
      // Step 2: Route to Gemini for reasoning queries
      const apiMessages = [
        ...conversationHistory.value,
        { role: "user", content: messageText },
      ];

      const result = await sendToGemini(apiMessages, geminiApiKey);

      messages.push({
        id: `bot_${Date.now()}`,
        type: "bot",
        text: result.text,
        timestamp: new Date(),
        source: result.source,
      });

      conversationHistory.value.push(
        { role: "user", content: messageText },
        { role: "assistant", content: result.text }
      );
    }

    if (conversationHistory.value.length > 20) {
      conversationHistory.value = conversationHistory.value.slice(-20);
    }
  } catch (error) {
    console.error("Chat error:", error);
    messages.push({
      id: `error_${Date.now()}`,
      type: "bot",
      text: getGeminiErrorMessage(error),
      timestamp: new Date(),
    });
  } finally {
    isTyping.value = false;
    nextTick(() => messageInput.value?.focus());
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
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);

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
  padding: 16px 24px;
  border-bottom: 1px solid var(--onyx);
  flex-shrink: 0;
}

.ai-topbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-topbar-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.ai-topbar-name {
  color: var(--white-2);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.ai-browse-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--light-gray-70);
  font-size: 13px;
  border: 1px solid var(--onyx);
  transition: color 150ms ease, border-color 150ms ease;
}

.ai-browse-btn:hover {
  color: var(--white-2);
  border-color: var(--light-gray-70);
}

.ai-browse-btn ion-icon {
  font-size: 15px;
  color: inherit;
  display: inline;
}

/* Main */
.ai-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* Welcome */
.ai-welcome {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px 0;
}

.ai-welcome-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 24px;
}

.ai-welcome-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ai-welcome-title {
  color: var(--white-2);
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 8px;
}

.ai-welcome-subtitle {
  color: var(--light-gray-70);
  font-size: 14px;
  line-height: 1.5;
}

/* Messages */
.ai-messages {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
}

.ai-msg {
  display: flex;
  gap: 10px;
  animation: msg-in 180ms var(--ease);
}

.ai-msg.user {
  flex-direction: row-reverse;
}

.ai-msg-avatar img {
  width: 26px;
  height: 26px;
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
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
}

.ai-msg-text--card-intro {
  padding: 0 0 4px;
  background: transparent;
  border: none;
  color: var(--light-gray);
}

.ai-msg.bot .ai-msg-text:not(.ai-msg-text--card-intro) {
  background: var(--eerie-black-2);
  color: var(--light-gray);
  border: 1px solid var(--onyx);
  border-top-left-radius: 4px;
}

.ai-msg.user .ai-msg-text {
  background: var(--onyx);
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
  opacity: 0.6;
}

.ai-msg.user .ai-msg-time {
  text-align: right;
}

/* Typing */
.ai-typing {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: var(--eerie-black-2);
  border: 1px solid var(--onyx);
  border-radius: var(--radius-md);
  border-top-left-radius: 4px;
}

.ai-typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--light-gray-70);
  animation: typing-bounce 1.2s ease-in-out infinite;
}

.ai-typing span:nth-child(2) { animation-delay: 0.15s; }
.ai-typing span:nth-child(3) { animation-delay: 0.3s; }

@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
  30% { transform: translateY(-6px); opacity: 1; }
}

@keyframes msg-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Input */
.ai-input-area {
  padding: 12px 24px 20px;
  flex-shrink: 0;
}

.ai-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 12px;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
}

.ai-chip {
  padding: 8px 16px;
  border-radius: 20px;
  background: var(--eerie-black-2);
  color: var(--light-gray);
  font-size: 13px;
  border: 1px solid var(--onyx);
  transition: color 150ms ease, border-color 150ms ease, transform 150ms var(--ease);
  cursor: pointer;
  white-space: nowrap;
}

.ai-chip:hover:not(:disabled) {
  color: var(--white-2);
  border-color: var(--light-gray-70);
  transform: scale(1.03);
}

.ai-chip:active:not(:disabled) {
  transform: scale(0.97);
}

.ai-chip:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ai-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
  max-width: 720px;
  margin: 0 auto;
  background: var(--eerie-black-2);
  border: 1px solid var(--onyx);
  border-radius: var(--radius-md);
  padding: 4px 4px 4px 16px;
  transition: border-color 180ms ease;
}

.ai-input-row:focus-within {
  border-color: var(--light-gray-70);
}

.ai-input {
  flex: 1;
  padding: 12px 0;
  border: none;
  background: transparent;
  font-size: 15px;
  color: var(--white-1);
  outline: none;
  font-family: var(--ff-poppins);
}

.ai-input::placeholder {
  color: var(--light-gray-70);
  opacity: 0.7;
}

.ai-input:disabled {
  opacity: 0.5;
}

.ai-send {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: var(--white-1);
  color: var(--eerie-black-1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 150ms ease, transform 150ms var(--ease);
  flex-shrink: 0;
}

.ai-send:hover:not(:disabled) {
  opacity: 0.85;
  transform: scale(1.05);
}

.ai-send:active:not(:disabled) {
  transform: scale(0.92);
}

.ai-send:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.ai-send ion-icon {
  font-size: 20px;
  color: inherit;
  display: inline;
}

.ai-footnote {
  text-align: center;
  font-size: 11px;
  color: var(--light-gray-70);
  margin-top: 10px;
  opacity: 0.5;
}

/* Responsive */
@media (max-width: 580px) {
  .ai-topbar {
    padding: 12px 16px;
  }

  .ai-browse-btn span {
    display: none;
  }

  .ai-browse-btn {
    padding: 8px;
  }

  .ai-welcome {
    padding: 24px 16px 0;
  }

  .ai-welcome-title {
    font-size: 24px;
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

  .ai-chips {
    gap: 6px;
  }

  .ai-chip {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
