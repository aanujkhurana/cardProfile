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
      <MessageCircle :size="24" />
      <span class="chat-badge" v-if="hasUnreadWelcome">1</span>
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
          <X :size="20" />
        </button>
      </div>

      <!-- Messages -->
      <div ref="messagesContainer" class="messages-container">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message', message.type]"
        >
          <div v-if="message.type === 'bot'" class="message-avatar">
            <Bot :size="16" />
          </div>

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
          <div class="message-avatar">
            <Bot :size="16" />
          </div>
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
            <Send :size="18" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from "vue";
import { MessageCircle, Bot, X, Send } from "lucide-vue-next";

// Props
const props = defineProps({
  apiUrl: {
    type: String,
    default: "http://localhost:3000/api/chat",
  },
});

// Reactive state
const isOpen = ref(false);
const isTyping = ref(false);
const currentMessage = ref("");
const messages = reactive([]);
const conversationId = ref(`chat_${Date.now()}`);
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
    const response = await fetch(props.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messageText,
        conversationId: conversationId.value,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Add bot response
    const botMessage = {
      id: `bot_${Date.now()}`,
      type: "bot",
      text: data.response,
      timestamp: new Date(),
    };
    messages.push(botMessage);
  } catch (error) {
    console.error("Chat error:", error);

    // Add error message
    const errorMessage = {
      id: `error_${Date.now()}`,
      type: "bot",
      text:
        "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
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
});
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Toggle Button */
.chat-toggle-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
}

.chat-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
}

.chat-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

/* Chat Window */
.chat-window {
  width: 380px;
  height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

/* Header */
.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
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
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Messages */
.messages-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #6b7280;
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
  background: #f3f4f6;
  color: #374151;
}

.message.user .message-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-text :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}

.message.user .message-text :deep(a) {
  color: #93c5fd;
}

.message-time {
  font-size: 11px;
  color: #9ca3af;
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
  background: #f3f4f6;
  border-radius: 12px;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9ca3af;
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
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #374151;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.quick-question-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.quick-question-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Input Area */
.input-area {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: #fafafa;
}

.input-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #667eea;
}

.message-input:disabled {
  background: #f9fafb;
  opacity: 0.7;
}

.send-btn {
  padding: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  background: #d1d5db;
  border-radius: 2px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
