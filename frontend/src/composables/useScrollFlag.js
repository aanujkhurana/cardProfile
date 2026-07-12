import { ref } from 'vue';

/**
 * useScrollFlag — scroll-state composable for Vue 3.
 *
 * Tracks scroll state on a scrollable element for "Apple-style
 * show/hide chrome on scroll direction" + "apply chrome bg when
 * content is scrolled past threshold" patterns. Designed to be
 * reused across multiple surfaces (currently the AI landing's
 * topbar; future-the website's bottom .navbar in Card.vue).
 *
 * The composable does NOT attach the scroll listener itself. The
 * caller binds the returned onScroll(e) handler via a template
 * @scroll.passive listener, which keeps Vue's passive-scroll
 * optimisation intact and gives callers full control over where
 * the listener is bound:
 *
 *   <div ref="scroller" @scroll.passive="onScroll">
 *     ...scrollable content...
 *   </div>
 *
 * Returned refs (all read-only to consumers):
 *   - isScrolled  : scrollTop > threshold (boolean)
 *   - isHidden    : scrollState === 'down' AND isScrolled (boolean)
 *   - scrollState : 'top' | 'down' | 'up' (string enum)
 *
 * Plus the handler:
 *   - onScroll(e) : pass to @scroll.passive binding in the template
 *
 * Hysteresis options:
 *   - threshold  : px past which isScrolled flips on (default 10)
 *   - idleDelta  : ignore |delta| < idleDelta px movement
 *                  (default 4 - sub-pixel / rubber-band noise gate)
 *   - idleMs     : ignore direction changes less than idleMs ms
 *                  apart (default 80 - debounces trackpad inertia)
 *
 * Negative scrollTop (iOS Safari rubber-band / Android pull-to-
 * refresh overscroll) is clamped to 0 so the state machine treats
 * it as "at top" rather than firing a phantom direction change.
 */
export function useScrollFlag({
  threshold = 10,
  idleDelta = 4,
  idleMs = 80,
} = {}) {
  const isScrolled = ref(false);
  const isHidden = ref(false);
  const scrollState = ref('top'); // 'top' | 'down' | 'up'

  // Closure-private state for direction tracking.
  let prev = 0;
  let lastChangeAt = 0;

  return {
    isScrolled,
    isHidden,
    scrollState,
    onScroll: (e) => {
      // Clamp negative scrollTop (overscroll behaviour) to 0.
      const top = Math.max(0, e.target.scrollTop || 0);
      isScrolled.value = top > threshold;

      const delta = top - prev;
      const now = Date.now();
      if (Math.abs(delta) < idleDelta || now - lastChangeAt < idleMs) {
        // Tiny jitter from rubber-band pull or sub-pixel scroll
        // noise (esp. macOS trackpad inertia firing many tiny
        // events): keep the current state, don't ping-pong.
        return;
      }
      lastChangeAt = now;

      if (delta > 0) {
        scrollState.value = 'down';
      } else if (delta < 0) {
        scrollState.value = 'up';
      }
      // delta === 0 leaves scrollState at its current value.

      isHidden.value = scrollState.value === 'down' && isScrolled.value;
      prev = top;
    },
  };
}
