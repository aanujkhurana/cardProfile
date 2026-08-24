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
      // Phase 24 — handle BOTH element scroll events (e.g. the
      // AI landing's internally-scrollable .ai-main binds
      // @scroll.passive="onScroll" so e.target is the div) AND
      // window-level scroll events (e.g. the static Card.vue
      // website where the BODY/document scrolls and the caller
      // attaches via window.addEventListener('scroll', onScroll,
      // { passive: true })). For window-level events, e.target is
      // either `window` or `document` (browser-dependent — Chrome
      // reports `document`, Firefox/Safari report `window`); in
      // either case there is no `scrollTop` property on the target
      // so we read `window.scrollY` (the unified source of truth
      // for the document's vertical scroll position). This keeps
      // the composable pure (no Vue lifecycle imports) and lets
      // each caller bind the listener at whatever level makes
      // sense for their content without needing a separate source:
      // 'window' option.
      const isWindowOrDocument =
        typeof window !== 'undefined' &&
        (e.target === window || e.target === document);
      const rawScroll = isWindowOrDocument
        ? window.scrollY
        : e.target.scrollTop;

      // Clamp negative scrollTop (iOS rubber-band / Android pull-
      // to-refresh overscroll) to 0 so the state machine treats
      // it as "at top" rather than firing a phantom direction
      // change. window.scrollY is non-negative by definition so
      // this clamp is a no-op for window-level events; safe in
      // both modes.
      const top = Math.max(0, rawScroll || 0);
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
