<template>
  <div class="ai-landing">
    <!-- Background layers -->
    <div class="ai-bg">
      <div class="ai-bg-glow ai-bg-glow--1"></div>
      <div class="ai-bg-glow ai-bg-glow--2"></div>
      <div class="ai-bg-glow ai-bg-glow--3"></div>
      <div class="ai-bg-grid"></div>
      <div class="ai-bg-grain"></div>
      <div class="ai-bg-vignette"></div>
    </div>

    <!-- Top bar -->
    <header class="ai-topbar" :class="{ 'is-scrolled': isScrolled }">
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
    <div class="ai-main" ref="mainContainer" @scroll.passive="handleScroll">
      <!-- Welcome state -->
      <div v-if="messages.length <= 1" class="ai-welcome">          <div class="ai-welcome-avatar-wrap">
          <div class="ai-welcome-avatar">
            <img src="../assets/images/wave.gif" alt="Hello" />
          </div>
          <span class="ai-hey-badge">hey</span>
        </div>
        <h1 class="ai-welcome-title ai-stagger" data-delay="3">Meet Anuj through conversation.</h1>
        <p class="ai-welcome-subtitle ai-stagger" data-delay="4">Learn about my software engineering experience, projects, technical skills, and the products I've built through a natural conversation instead of browsing a traditional portfolio.</p>
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
            <!-- Follow-up chips after bot messages -->
            <div
              v-if="message.type === 'bot' && message.followUp?.length"
              class="ai-followups"
            >
              <button
                v-for="q in message.followUp"
                :key="q"
                class="ai-followup-chip"
                @click="sendMessage(q)"
                :disabled="isTyping"
              >
                {{ q }}
              </button>
            </div>
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

      <div class="ai-input-row ai-stagger" data-delay="5">
        <input
          ref="messageInput"
          v-model="currentMessage"
          @keydown.enter="handleSendMessage"
          placeholder="Ask anything about my work..."
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
      <p class="ai-footnote">AI-generated responses. Verify critical details independently.</p>
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

// Phase 14 — topbar scroll-state machine.
// When the user scrolls inside .ai-main (the AI landing's inner
// scroll container), the topbar gains its background + backdrop
// blur; otherwise it sits transparent over the page so the
// ambient grid + grain read edge-to-edge. The scroll listener
// uses .passive (set via @scroll.passive in the template) so
// it never blocks the scroll thread.
const mainContainer = ref(null);
const isScrolled = ref(false);
const handleScroll = (e) => {
  isScrolled.value = e.target.scrollTop > 10;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const welcomeMessage = {
  id: "welcome",
  type: "bot",
  text: "Welcome! I'm an AI-powered guide to Anuj's work. Ask me about his experience, projects, skills, or anything else you'd like to know.",
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

      await wait(800 + Math.random() * 600);

      messages.push({
        id: `bot_${Date.now()}`,
        type: "bot",
        text: localResponse.text,
        timestamp: new Date(),
        card: !!cardComponent,
        cardComponent: cardComponent,
        cardData: localResponse.data || null,
        source: "local",
        followUp: localResponse.followUp || null,
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

      const result = await sendToGemini(apiMessages);

      messages.push({
        id: `bot_${Date.now()}`,
        type: "bot",
        text: result.text,
        timestamp: new Date(),
        source: result.source,
        followUp: [
          "Tell me about your experience",
          "What projects are you most proud of?",
          "What technologies do you specialize in?",
        ],
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
      followUp: [
        "Tell me about your experience",
        "What projects are you most proud of?",
        "How can I contact you?",
      ],
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
  background: linear-gradient(160deg, hsl(240, 3%, 10%) 0%, hsl(240, 2%, 13%) 40%, hsl(240, 4%, 8%) 100%);
  font-family: var(--ff-poppins);
  overflow: hidden;
  /* Phase 14 — page-load entry beat 1 (0ms): the whole landing
     fades in over 240ms so the transition from "blank" to
     "structured" feels intentional, not abrupt. */
  opacity: 0;
  animation: landing-in 0.24s linear forwards;
}

/* Background layers */
.ai-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.ai-bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0;
  animation: glow-in 1.5s ease forwards;
}

.ai-bg-glow--1 {
  width: 600px;
  height: 600px;
  top: -15%;
  left: 50%;
  transform: translateX(-50%);
  /* Phase 14 — gold swapped for cool indigo/violet so the top
     ambient glow reads as "studio lighting" rather than "gold
     accent" when paired with the unchanged warm gold UI bits
     (hey-badge, focus rings). */
  background: radial-gradient(circle, hsla(245, 60%, 60%, 0.08) 0%, transparent 70%);
  animation-delay: 0.3s;
}

.ai-bg-glow--2 {
  width: 400px;
  height: 400px;
  top: 20%;
  right: -10%;
  background: radial-gradient(circle, hsla(220, 60%, 50%, 0.04) 0%, transparent 70%);
  animation-delay: 0.6s;
}

.ai-bg-glow--3 {
  width: 500px;
  height: 500px;
  bottom: -10%;
  left: -10%;
  /* Phase 14 — bright yellow swapped for cyan/teal so the bottom-
     left ambient glow reads as "cool rising light" complementing
     the indigo top glow, rather than competing with the warm UI
     accent tokens. */
  background: radial-gradient(circle, hsla(180, 50%, 55%, 0.05) 0%, transparent 70%);
  animation-delay: 0.9s;
}

@keyframes glow-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ------------------------------------------------------------------ */
/*  Phase 14 — Page-load choreography keyframes                       */
/* ------------------------------------------------------------------ */

/**
 * Layered entrance beats: whole page fades in (0.24s) → topbar
 * slides down (0.5s @ 0.1s) → ambient layers (grid + glow + grain
 * + vignette) cascade in at 0.3-0.5s → welcome avatar (0.7s) →
 * hey-badge pop with back-out easing (0.8s) → welcome copy +
 * input row → chips cascade in per-item at 1.25s+ (80ms stagger,
 * up to 6 chips). All timings tuned to read as a unified "app is
 * alive" sequence rather than disjointed entrance. Reduced-motion
 * users get a single instant paint (all animations disabled in
 * the @media block below).
 */
@keyframes landing-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes topbar-in {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes grid-in {
  from {
    opacity: 0;
    transform: perspective(500px) rotateX(45deg) scale(1.05);
  }
  to {
    opacity: 0.8;
    transform: perspective(500px) rotateX(45deg) scale(1);
  }
}

@keyframes grain-in {
  from {
    opacity: 0;
    transform: scale(1.02);
  }
  to {
    opacity: 0.85;
    transform: scale(1);
  }
}

@keyframes vignette-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes welcome-avatar-in {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes hey-badge-pop {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  60% {
    opacity: 1;
    transform: scale(1.15);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes chip-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/**
 * Per-chip entrance stagger. The defaultQuestions config can
 * surface up to 6 entries, so we stagger up to 6 visible chips.
 * :nth-child matches work cleanly with v-for because Vue preserves
 * DOM order keyed by :key.
 */
.ai-chips .ai-chip:nth-child(1) { animation-delay: 1.25s; }
.ai-chips .ai-chip:nth-child(2) { animation-delay: 1.33s; }
.ai-chips .ai-chip:nth-child(3) { animation-delay: 1.41s; }
.ai-chips .ai-chip:nth-child(4) { animation-delay: 1.49s; }
.ai-chips .ai-chip:nth-child(5) { animation-delay: 1.57s; }
.ai-chips .ai-chip:nth-child(6) { animation-delay: 1.65s; }

.ai-bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(hsla(0, 0%, 100%, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, hsla(0, 0%, 100%, 0.07) 1px, transparent 1px);
  background-size: 80px 80px;
  transform: perspective(500px) rotateX(45deg);
  transform-origin: center 80%;
  mask-image: linear-gradient(to top, black 0%, transparent 55%);
  -webkit-mask-image: linear-gradient(to top, black 0%, transparent 55%);
  /* Phase 14 — opacity 0→0.8 + scale 1.05→1 entrance over 1.2s,
     so the 3D grid "lowers into place" rather than being static
     from page paint. The grid-in keyframe preserves the static
     perspective + rotateX throughout so depth doesn't pop in late. */
  opacity: 0;
  animation: grid-in 1.2s 0.3s var(--ease) forwards;
  will-change: transform, opacity;
}

.ai-bg-grain {
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
  /* Phase 14 — opacity bumped 0.6 → 0.85 so the noise reads
     against the 3D grid (effective ~0.034 once you factor the
     SVG inner 0.04 alpha). Scale 1.02→1 entrance over 1s gives
     the noise a subtle organic "settle" effect rather than a
     hard pop. */
  opacity: 0;
  animation: grain-in 1s 0.5s var(--ease) forwards;
  will-change: transform, opacity;
}

.ai-bg-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, hsla(240, 4%, 6%, 0.8) 100%);
  /* Phase 14 — opacity 0→1 entrance so the radial vignette
     frames the UI AFTER the ambient layers + welcome content
     have settled, rather than competing with them from frame 1. */
  opacity: 0;
  animation: vignette-in 0.8s 0.4s linear forwards;
}

/* Top bar */
.ai-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid transparent;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  opacity: 0;
  background: transparent;
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  animation: topbar-in 0.5s 0.1s var(--ease) forwards;
  transition: background 240ms ease, border-color 240ms ease,
    backdrop-filter 240ms ease, -webkit-backdrop-filter 240ms ease;
  will-change: background, border-color;
}

.ai-topbar.is-scrolled {
  background: hsla(240, 2%, 13%, 0.6);
  border-bottom-color: hsla(0, 0%, 17%, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
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
  transition: color 150ms ease, border-color 150ms ease, transform 200ms var(--ease), box-shadow 180ms ease;
}

.ai-browse-btn:hover {
  color: var(--white-2);
  border-color: hsla(45, 54%, 58%, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px hsla(0, 0%, 0%, 0.15);
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
  position: relative;
  z-index: 1;
}

/* Welcome */
.ai-welcome {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px 0;
  max-width: 640px;
  margin: 0 auto;
}

.ai-welcome-avatar-wrap {
  position: relative;
  margin-bottom: 28px;
  /* Phase 14 — scale 0.85→1 + opacity entrance so the wave.gif
     avatar feels alive. Replaces the older generic .ai-stagger
     translateY-only animation which was harder to read against
     the avatar's natural stillness. */
  opacity: 0;
  animation: welcome-avatar-in 0.6s 0.7s var(--ease) forwards;
}

.ai-welcome-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
}

.ai-welcome-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ai-hey-badge {
  position: absolute;
  top: -4px;
  right: -8px;
  background: hsl(0, 65%, 55%);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 10px;
  line-height: 1;
  box-shadow: 0 2px 8px hsla(0, 65%, 55%, 0.4);
  /* Phase 14 — three-stop scale bounce (0 → 1.15 → 1) with a
     back-out easing. transform-origin: bottom right anchors the
     bounce to the corner sitting closest to the avatar, so the
     badge feels like it physically pops OUT of the avatar
     rather than scaling from its center. */
  opacity: 0;
  transform: scale(0);
  transform-origin: bottom right;
  animation: hey-badge-pop 0.5s 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.ai-welcome-title {
  color: var(--white-2);
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.15;
  margin-bottom: 14px;
  text-align: center;
}

.ai-welcome-subtitle {
  color: var(--light-gray-70);
  font-size: 15px;
  line-height: 1.65;
  text-align: center;
  max-width: 520px;
  letter-spacing: -0.005em;
}

/* Staggered entrance animations */
.ai-stagger {
  opacity: 0;
  transform: translateY(12px);
  animation: stagger-in 0.5s var(--ease) forwards;
}

.ai-stagger[data-delay="1"] { animation-delay: 0.1s; }
.ai-stagger[data-delay="2"] { animation-delay: 0.2s; }
.ai-stagger[data-delay="3"] { animation-delay: 0.35s; }
.ai-stagger[data-delay="4"] { animation-delay: 0.5s; }
.ai-stagger[data-delay="5"] { animation-delay: 0.65s; }
.ai-stagger[data-delay="6"] { animation-delay: 0.75s; }

@keyframes stagger-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  line-height: 1.65;
  word-wrap: break-word;
  letter-spacing: -0.005em;
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

/* Follow-up chips */
.ai-followups {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
  padding-left: 2px;
}

.ai-followup-chip {
  padding: 6px 14px;
  border-radius: 18px;
  background: var(--eerie-black-2);
  color: var(--light-gray);
  font-size: 12px;
  border: 1px solid var(--onyx);
  transition: color 150ms ease, border-color 150ms ease, transform 180ms var(--ease), box-shadow 180ms ease;
  cursor: pointer;
  white-space: nowrap;
}

.ai-followup-chip:hover:not(:disabled) {
  color: var(--white-2);
  border-color: hsla(45, 54%, 58%, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px hsla(0, 0%, 0%, 0.15);
}

.ai-followup-chip:active:not(:disabled) {
  transform: translateY(0) scale(0.97);
}

.ai-followup-chip:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Input */
.ai-input-area {
  padding: 12px 24px 20px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
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
  transition: color 150ms ease, border-color 150ms ease, transform 180ms var(--ease), box-shadow 180ms ease, background 150ms ease;
  cursor: pointer;
  white-space: nowrap;
  /* Phase 14 — chip-in keyframe is the shared per-item animation
     (translateY 10→0 + scale 0.95→1 + opacity 0→1 over 350ms).
     The per-:nth-child selectors below stagger the start times
     80ms apart, starting at 1.25s. */
  opacity: 0;
  animation: chip-in 0.35s var(--ease) forwards;
}

.ai-chip:hover:not(:disabled) {
  color: var(--white-2);
  border-color: hsla(45, 54%, 58%, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px hsla(0, 0%, 0%, 0.2);
  background: hsla(45, 54%, 58%, 0.06);
}

.ai-chip:active:not(:disabled) {
  transform: translateY(0) scale(0.97);
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
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms var(--ease);
}

.ai-input-row:focus-within {
  border-color: var(--vegas-gold);
  box-shadow: 0 0 0 3px hsla(45, 54%, 58%, 0.1), 0 4px 16px hsla(0, 0%, 0%, 0.15);
  transform: translateY(-1px);
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
  transition: opacity 150ms ease, transform 200ms var(--ease), box-shadow 180ms ease;
  flex-shrink: 0;
}

.ai-send:hover:not(:disabled) {
  opacity: 0.9;
  transform: scale(1.08);
  box-shadow: 0 2px 12px hsla(0, 0%, 100%, 0.15);
}

.ai-send:active:not(:disabled) {
  transform: scale(0.9);
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

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  /* Phase 14 update — the same selector list now also covers the
     new entrance animations (landing-in, topbar-in, grid-in,
     grain-in, vignette-in, welcome-avatar-in, hey-badge-pop,
     chip-in + staggered chip nth-child delays). Users with
     vestibular sensitivity get a single instant paint instead
     of the layered choreography. */
  .ai-stagger,
  .ai-landing,
  .ai-topbar,
  .ai-bg-glow,
  .ai-bg-grid,
  .ai-bg-grain,
  .ai-bg-vignette,
  .ai-welcome-avatar-wrap,
  .ai-hey-badge,
  .ai-chips .ai-chip {
    opacity: 1;
    transform: none;
    animation: none;
  }

  .ai-msg {
    animation: none;
  }

  .ai-typing span {
    animation: none;
    opacity: 0.5;
  }

  .ai-chip,
  .ai-followup-chip,
  .ai-send,
  .ai-browse-btn,
  .ai-input-row {
    transition-duration: 0.01ms;
  }
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
    font-size: 26px;
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
