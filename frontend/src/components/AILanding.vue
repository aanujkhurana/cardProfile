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
    <header class="ai-topbar" :class="{ 'is-scrolled': isScrolled, 'is-hidden': isHidden }">
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
    <div class="ai-main" @scroll.passive="onScroll">
      <!-- Welcome state -->
      <div v-if="messages.length <= 1" class="ai-welcome">          <div class="ai-welcome-avatar-wrap">
          <div class="ai-welcome-avatar">
            <!-- Phase 22 — Phase 21 chalk-on-blackboard trimmed back:
                 (a) the .chalk-board fill is removed so the chalk
                 strokes now draw directly on the (theme-aware) bg
                 of .ai-landing — the chalk reads as "doodle on the
                 surface" rather than "drawing inside a board";
                 (b) the avatar envelope is bumped from 80px to
                 120px (still circular clip via border-radius:50%)
                 so the chalk strokes render at gallery scale (the
                 SVG viewBox stays 80x80 so geometry is unchanged
                 and stroke-width ~3.5 visually thickens to ~5.25
                 rendered px for chunkier chalk);
                 (c) the whole envelope is tilted transform:
                 rotate(-4deg) around its visual center so the
                 smiley reads as a casual hand-drawn doodle rather
                 than a stamped icon — the welcome-avatar-in
                 keyframe still scales the WRAP from 0.85→1 so the
                 rotation composes cleanly (independent transforms
                 on different elements);
                 (d) the .ai-hey-badge bubble is removed entirely
                 so the chalk strokes are the only ornament in the
                 welcome state (no orbit label, no pop animation,
                 no light-theme box-shadow override). The chalk-
                 draw choreography + stroke geometry + theme
                 palette parity from Phase 21 stay intact (the
                 smile still lands ~2.9s as the visual final
                 beat). role="img" + aria-label preserve a11y. -->
            <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hello">
              <defs>
                <!-- Chalk roughness: feTurbulence generates high-
                     frequency fractal noise (sandy grain) used as
                     a displacement map. feDisplacementMap bends
                     each pixel of SourceGraphic by up to 2.5px in
                     either direction using the noise's R/G as the
                     offset vector. The combined effect: chalk
                     strokes look dusty + irregular at the edge.
                     The filter region (-20% / 140%) gives generous
                     bleed room so displaced pixels at the stroke
                     edges aren't clipped to invisible. -->
                <filter id="chalk-texture" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>

              <!-- Stroked chalk drawing on the (theme-aware) bg of
                   .ai-landing (no chalkboard fill beneath). fill=
                   "none" on the group is required — if any element
                   had a fill, the fill would pop in BEFORE the
                   stroke finishes drawing (visually wrong for the
                   chalk metaphor). stroke-linecap="round" softens
                   the edges (chalk doesn't have sharp square
                   ends). The filter is applied to the WHOLE GROUP
                   so the four strokes share one chalk pass and
                   stay visually unified. Coordinates/pathLength
                   all unchanged from Phase 21 — only the
                   surrounding envelope (size + tilt) and absence
                   of board + orbit badge changed in this phase. -->
              <g filter="url(#chalk-texture)" class="chalk-strokes" fill="none" stroke-linecap="round">
                <circle cx="40" cy="40" r="35" class="chalk-face" pathLength="100" />
                <circle cx="28" cy="34" r="3.5" class="chalk-eye-l" pathLength="100" />
                <circle cx="52" cy="34" r="3.5" class="chalk-eye-r" pathLength="100" />
                <path d="M 26 50 Q 40 62 54 50" class="chalk-smile" pathLength="100" />
              </g>
            </svg>
          </div>
        </div>
        <!-- Phase 23 — Hero copy rewrite. The old title "Meet Anuj
             through conversation." + formal "Learn about my software
             engineering experience, projects..." subtitle were
             portfolio-polite but read as a static-website pitch on
             an interactive assistant. The new copy + subtitle lean
             into the assistant-as-interrogation framing: the title
             explicitly tells visitors to skip small talk (the
             AI's purpose is to be poked at for portfolio intel,
             not greeted), and the subtitle broadly advertises the
             AI's knowledge surface (projects, career journey,
             tech stack, wins, commits, bugs fixed) and closes
             with a soft invitation "Go ahead, ask it anything."
             The self-deprecating "questionable commits, and even
             the bugs I eventually fixed" beats the AI's tone:
             it's the kind of thing the AI will ACTIVELY admit
             when asked (matches the existing FAQ + system-prompt
             honesty discipline). Length-wise the new title is 4
             words (fits ~ one line at every breakpoint); the new
             subtitle is ~190 chars (wraps to ~3 lines at desktop
             max-width: 520px, fits comfortably inside the welcome
             state). The .ai-stagger + data-delay entries stay
             untouched so the entrance choreography + timing carry
             over. -->
        <h1 class="ai-welcome-title ai-stagger" data-delay="3">Skip the small talk.</h1>
        <p class="ai-welcome-subtitle ai-stagger" data-delay="4">Interrogate my AI instead. It knows my projects, career journey, tech stack, biggest wins, questionable commits, and even the bugs I eventually fixed. Go ahead, ask it anything.</p>
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
import { useScrollFlag } from "../composables/useScrollFlag.js";

const emit = defineEmits(["browse-website"]);

const isTyping = ref(false);
const currentMessage = ref("");
const messages = reactive([]);
const conversationHistory = ref([]);

const messagesContainer = ref(null);
const messageInput = ref(null);

// Phase 16 — topbar scroll-state machine via useScrollFlag composable.
// Tracks scroll direction (top/down/up) + threshold (isScrolled) so
// the topbar gains its bg + blur when scrolled AND hides when the
// user is moving their scroll position downward (Apple pattern:
// content takes focus while scrolling down, chrome re-emerges when
// the user scrolls up to navigate back). Composable owns the state
// logic + reactive outputs; the @scroll.passive listener stays in
// the template so Vue keeps the passive-scroll optimisation intact.
// The composable is exported at src/composables/useScrollFlag.js so
// a future Card.vue followup can adopt the same state machine for
// the website's bottom .navbar.
const { isScrolled, isHidden, onScroll } = useScrollFlag({ threshold: 10 });

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
  /* Phase 19 — smooth theme flip. background-image is
     transitionable in modern browsers (Chrome 71+, Safari 16+);
     the 240ms ease matches the topbar scroll-state machine
     timing from Phase 14 so dark <-> light feel visually
     cohesive with the rest of the surface choreography. */
  transition: background-image 240ms ease;
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
  /* Phase 16 — transform baseline so the .is-hidden rule can
     translate the topbar off-screen without snapping. The hide-
     on-down transform uses the same --ease as everywhere else
     for visual consistency with the page-load choreography. */
  transform: translateY(0);
  animation: topbar-in 0.5s 0.1s var(--ease) forwards;
  transition: background 240ms ease, border-color 240ms ease,
    backdrop-filter 240ms ease, -webkit-backdrop-filter 240ms ease,
    transform 220ms var(--ease);
  will-change: transform, background, border-color;
}

.ai-topbar.is-scrolled {
  background: hsla(240, 2%, 13%, 0.6);
  border-bottom-color: hsla(0, 0%, 17%, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Phase 16 — Apple-style hide-on-scroll-down. When the user is
   scrolling downward AND past the threshold, the topbar slides
   up out of view so the chat content takes focus. Scrolling up
   re-emerges it (the up state leaves transform at translateY(0)).
   The .is-hidden flag is bound from the useScrollFlag composable
   (isHidden = scrollState === 'down' AND isScrolled). The
   specificity (0,2,0) > base .ai-topbar (0,1,0), so the .is-hidden
   transform wins in normal mode; the @media reduced-motion block
   below lists .ai-topbar.is-hidden to neutralise it for vestibular
   sensitivity. */
.ai-topbar.is-hidden {
  transform: translateY(-100%);
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
  /* Phase 22 — envelope bumped from 80px to 120px so the chalk
     strokes render at gallery scale (the SVG viewBox stays 80x80
     so geometry is unchanged, and stroke-width ~3.5 visually
     thickens to ~5.25 rendered px for chunkier chalk). border-
     radius: 50% + overflow: hidden clip is preserved so the chalk
     reads inside a soft circular frame, even though the chalk
     strokes are now drawn over the (theme-aware) bg of
     .ai-landing rather than over a chalkboard plate. */
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
}

.ai-welcome-avatar svg {
  width: 100%;
  height: 100%;
  display: block;
  /* Phase 22 — slight leftward tilt (rotate -4deg) so the smiley
     reads as a casual hand-drawn doodle rather than a stamped
     icon. transform-origin: center keeps the rotation pivot at
     the visual center so the chalk strokes don't drift off
     axis. The rotation composes cleanly with the wrap's
     welcome-avatar-in scale (0.85->1) entrance transform:
     SCALE is on the WRAP, ROTATE is on the SVG (different
     elements, no transform stacking). The -4deg tilt is small
     enough that the chalk strokes still fit inside the 120x120
     circular clip even after rotation (the rotated bounding
     box is well within the clip). */
  transform: rotate(-4deg);
  transform-origin: center;
}

/* Phase 22 — Chalk strokes now draw on the (theme-aware) bg of
   .ai-landing directly, with no opaque chalkboard plate beneath
   (the .chalk-board fill rule was removed in this phase). The
   chalk-strokes group carries the shared stroke color + stroke-
   width + linecap (set once on the group so the four child
   elements stay uniform). The stroke value transitions on a
   240ms ease so the palette FLIPS smoothly when the user
   toggles to light theme (chalk turns deep slate over the near-
   white bg, matching the existing Phase 19 light-theme
   palette). The four stroked children share the same chalk-draw
   keyframe (stroke-dashoffset 100 -> 0) and use pathLength="
   100" so the dasharray math is identical across the three
   circles and the smile path. animation-fill-mode: both keeps
   each stroke hidden (offset 100) during its delay window so
   nothing paints before its turn in the sequence. Sequencing:
   face outline @ 1.3s (lands ~1.9s) -> left eye @ 1.9s ->
   right eye @ 2.15s -> smile @ 2.4s (lands ~2.9s). Each
   element starts AFTER the previous has fully drawn so the user
   reads the sequence as deliberate chalk drawing rather than a
   single simultaneous reveal. The chalk-draw choreography
   timing itself is unchanged from Phase 21; only the visual
   surroundings (no board, larger + tilted envelope, no hey-
   badge) changed in this phase. */
.chalk-strokes {
  stroke: hsl(40, 15%, 92%);
  stroke-width: 3.5;
  transition: stroke 240ms ease;
}

.chalk-face,
.chalk-eye-l,
.chalk-eye-r,
.chalk-smile {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: chalk-draw linear both;
}

.chalk-face  { animation-duration: 0.6s;  animation-delay: 1.3s;  }
.chalk-eye-l { animation-duration: 0.25s; animation-delay: 1.9s;  }
.chalk-eye-r { animation-duration: 0.25s; animation-delay: 2.15s; }
.chalk-smile { animation-duration: 0.5s;  animation-delay: 2.4s;  }

@keyframes chalk-draw {
  from { stroke-dashoffset: 100; }
  to   { stroke-dashoffset: 0;   }
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
  /* Phase 16 — same-selector listing + .ai-topbar.is-hidden so
     reduced-motion's transform: none overrides the .is-hidden
     translateY (which has higher specificity 0,2,0 > 0,1,0 and
     would otherwise slide the topbar out of view for vestibular-
     sensitive users). Listing it explicitly matches that
     specificity so the reduce override actually wins. */
  .ai-topbar.is-hidden,
  .ai-bg-glow,
  .ai-bg-grid,
  .ai-bg-grain,
  .ai-bg-vignette,
  .ai-welcome-avatar-wrap,
  /* Phase 22 .ai-hey-badge selector removed from this list —
     the badge span was dropped from the template in this phase
     so listing it here would have been dead CSS. */
  .ai-chips .ai-chip,
  /* Phase 21 — chalk-draw selectors. animation: none cancels the
     draw-on reveal but the chalk strokes ALSO need stroke-dashoffset:
     0 explicitly so the stroke is fully visible (otherwise the base
     rule's offset:100 + animation-fill-mode: both would leave the
     strokes blank for reduced-motion users). Without the explicit
     stroke-dashoffset: 0 the chalk draw-on logic would STILL run as
     an end-state attr, leaving the face invisible. */
  .chalk-face,
  .chalk-eye-l,
  .chalk-eye-r,
  .chalk-smile {
    opacity: 1;
    transform: none;
    animation: none;
    stroke-dashoffset: 0;
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

/* ------------------------------------------------------------------ */
/*  Phase 19 — :root.light-theme overrides                            */
/* ------------------------------------------------------------------ */

/**
 * Extend the AI landing's bg + ambient palette to obey the
 * global light-theme so the AI assistant inherits the user's
 * chosen theme like the static Card.vue side does. ThemeToggle
 * toggles `document.documentElement.classList.light-theme`,
 * so :root.light-theme is the right scope selector (the AI
 * landing wrapper lives inside App.vue, but its <html>
 * ancestor carries the light-theme class).
 *
 * WHAT'S ALREADY AUTO-FLIPPED (no override needed) — these
 * selectors consume var(--eerie-black-2 / --onyx / --jet /
 * --white-1 / --white-2 / --light-gray / --light-gray-70 /
 * --vegas-gold) which style.css automatically redefines under
 * :root.light-theme:
 *  - ai-input-row, ai-chip, ai-msg.bot .ai-msg-text,
 *    ai-msg.user .ai-msg-text, ai-typing, ai-followup-chip,
 *    ai-send, ai-input, ai-welcome-title, ai-welcome-subtitle,
 *    ai-footnote, ai-msg-time, ai-msg-text :deep(a),
 *    ai-browse-btn, ai-topbar-name.
 *
 * WHAT NEEDS EXPLICIT :root.light-theme OVERRIDES — hard-coded
 * tones that paint OVER base surfaces or are visible ambient
 * structural layers (would otherwise stay dark when the user
 * toggles to light):
 *  1. .ai-landing bg gradient — the base surface layer. Light
 *     version keeps the same 160deg 3-stop rhythm but on
 *     near-white surfaces (L* 95-99%) with a faint cool tint
 *     so the visual rhythm matches dark mode.
 *  2. .ai-bg-glow--1/--2/--3 — ambient radial glows. Alpha
 *     bumped slightly in light (0.08 -> 0.10 / 0.04 -> 0.08 /
 *     0.05 -> 0.08) so the cool indigo/violet/cyan reads
 *     above the near-white base. The indigo hue is consistent
 *     with the static site's --vegas-gold light-mode accent
 *     (hsl(247, 100%, 60%)) — no aestetic mismatch.
 *  3. .ai-bg-grid — 3D grid line color swapped from
 *     white-on-dark (hsla(0, 0%, 100%, 0.07)) to
 *     dark-on-light (hsla(240, 10%, 30%, 0.08)) so the lines
 *     remain visible against the new bg.
 *  4. .ai-bg-vignette — radial frame. The dark-on-dark vignette
 *     in dark mode fades the corners; in light mode the frame
 *     is inverted to a light-on-light fade (L* 88%, alpha 0.4)
 *     so the same "edge-frame" effect reads without going
 *     darker than the bg. transparent 30% -> 50% gives the
 *     light-mode vignette a softer interior since the page
 *     is already high-key.
 *  5. .ai-topbar.is-scrolled — glass-blur bg + border so the
 *     topbar reads as a coherent surface in light mode
 *     (hsla(0, 0%, 99%, 0.7) blur + hsla(0, 0%, 88%, 0.6)
 *     hairline). The .ai-topbar rule already extends its
 *     transition list with background + border-color +
 *     backdrop-filter from Phase 14 so this flips smoothly.
 *  6. .ai-hey-badge box-shadow — the red badge itself reads
 *     in both themes (red hsl(0, 65%, 55%) on either bg); only
 *     the halo alpha is tamed (0.4 -> 0.25) so it doesn't feel
 *     blown-out against the near-white surface.
 *
 * NOTE: The 3 glows + grid + vignette rules don't carry
 * transition properties for these per-property flips — they
 * transition instantaneously on toggle. Acceptable: those are
 * ambient layers, not affordances the user is interacting
 * with, and the topbar + .ai-landing bg already smooth-flip
 * via the transitions added in this phase + Phase 14.
 */
:root.light-theme .ai-landing {
  background: linear-gradient(
    160deg,
    hsl(240, 8%, 97%) 0%,
    hsl(240, 12%, 99%) 40%,
    hsl(240, 6%, 95%) 100%
  );
}

:root.light-theme .ai-bg-glow--1 {
  background: radial-gradient(
    circle,
    hsla(245, 70%, 70%, 0.10) 0%,
    transparent 70%
  );
}

:root.light-theme .ai-bg-glow--2 {
  background: radial-gradient(
    circle,
    hsla(220, 70%, 65%, 0.08) 0%,
    transparent 70%
  );
}

:root.light-theme .ai-bg-glow--3 {
  background: radial-gradient(
    circle,
    hsla(180, 60%, 60%, 0.08) 0%,
    transparent 70%
  );
}

:root.light-theme .ai-bg-grid {
  background-image:
    linear-gradient(hsla(240, 10%, 30%, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, hsla(240, 10%, 30%, 0.08) 1px, transparent 1px);
}

:root.light-theme .ai-bg-vignette {
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    hsla(240, 8%, 88%, 0.4) 100%
  );
}

:root.light-theme .ai-topbar.is-scrolled {
  background: hsla(0, 0%, 99%, 0.7);
  border-bottom-color: hsla(0, 0%, 88%, 0.6);
}

/* Phase 21 — Chalk theme parity. The .chalk-board (dark mode:
   slate blackboard) flips to a warm off-white parchment board in
   light mode. The chalk stroke color flips from dusty off-white
   to deep slate so the chalk-on-board metaphor reads in BOTH
   themes (chalk reads as "the opposite color of the board").
   The values chosen here match the existing Phase 19 bg palette
   tones (light-mode bg ramp tops out at L* 99% so the board fill
   of L* 96% sits just slightly below the envelope bg, giving
   subtle contrast that suggests a small drawing surface rather
   than a hard swatch). The chalk stroke sits at L* 28% which
   reads as "dark ink" against the L* 96% board. The fill +
   stroke carry their own 240ms transition (set on the base
   .chalk-board + .chalk-strokes rules above) so they smooth-
   flip alongside the bg + topbar surfaces when the user toggles
   the theme. */
:root.light-theme .chalk-board {
  fill: hsl(35, 25%, 96%);
}

:root.light-theme .chalk-strokes {
  stroke: hsl(220, 30%, 28%);
}
</style>
