# Production Audit — AI Portfolio

**Branch:** `feature/ai-portfolio-production-upgrade`
**Auditor:** Automated audit, July 2026
**Scope:** Full-stack review of frontend, knowledge layer, AI integrations, content, security, accessibility, performance.

---

## TL;DR

The application has a solid foundation (rich Vue 3 chat with local knowledge routing, retry/cache, follow-up chips, theme toggle, Sanity CMS) but is **not production-ready yet**. The most urgent blockers are:

| # | Severity | Issue |
|---|----------|-------|
| 1 | 🔴 Critical | Gemini API key leaks into the URL (`?key=…`) — visible in browser network logs and CDN history. |
| 2 | 🔴 Critical | Frontend calls Gemini's public endpoint directly from the browser — anyone can extract and abuse the key. |
| 3 | 🟠 High    | Card.vue has two chat systems mounted simultaneously (`Chatbox.vue` + `AILanding.vue` if user browses). |
| 4 | 🟠 High    | `gemini-2.0-flash` model name hard-coded — may be deprecated by Google's model lifecycle. |
| 5 | 🟠 High    | No resume section, no resume download handler, no `ResumeCard` component. |
| 6 | 🟠 High    | Two parallel knowledge sources (`contextData.js` + `knowledge/*`) — risk of drift. |
| 7 | 🟡 Medium  | No server-side proxy / no streaming responses (full-block fetch then render). |
| 8 | 🟡 Medium  | No copy / regenerate / feedback buttons on bot messages. |
| 9 | 🟡 Medium  | No contextual / memory-aware follow-ups — same suggestions on repeat. |
| 10 | 🟡 Medium | `index.html` description is `"personalPortfolio"` (placeholder) — SEO gap. |
| 11 | 🟢 Low    | `package.json` lists `cors`, `express`, `openai` as runtime deps — none are used in the frontend (dead deps). |
| 12 | 🟢 Low    | No `.nvmrc`/engine pin; no Vercel deploy hints. |

---

## Architecture Overview

```
cardProfile/
├── frontend/                  ← Vite + Vue 3 (this audit's focus)
│   ├── api/                    ← MISSING — Vercel serverless slot
│   ├── src/
│   │   ├── App.vue             ← Mounts AILanding by default + Card (with Chatbox) when browse clicked
│   │   ├── components/
│   │   │   ├── AILanding.vue   ← AI chat (Gemini direct), rich cards, follow-ups
│   │   │   ├── Chatbox.vue     ← Legacy OpenAI pop-up chat (text-only) — candidate for removal
│   │   │   └── Card.vue        ← Static portfolio site (sidebar + About/Projects/Experience/Contact)
│   │   └── lib/
│   │       ├── gemini/service.js ← ⚠️ API key in URL
│   │       ├── knowledge/        ← Local KB + intent router ✓
│   │       └── chatbox/          ← System prompt + contextData (parallel KB) ⚠️
│   └── vite.config.js          ← Dev proxy to openai-proxy vercel url
├── backend/                   ← Sanity CMS schema only
└── openai-proxy/              ← Old/external Vercel app referenced via vite proxy
```

---

## Phase 1: Application Audit Findings

### AI Integration
- **Strengths:** Local-knowledge-first routing before Gemini call; response caching; 3-attempt exponential-backoff retry; structured error mapping.
- **Gaps:** Key leak, no streaming, no per-message citations/sources, no conversation memory beyond 20 messages (OK), no conversation export.

### Backend / API
- There is **no Node API server** in the frontend. The only backend dependencies are: a Sanity CMS read-only client in the frontend, and an external `openai-proxy` Vercel deployment referenced via vite proxy.
- The `openai-proxy` host is hard-coded; if it ever changes, dev + prod breaks.

### Frontend Architecture
- **Strong:** reactive knowledge routing, pluggable card components, theme toggle, sensible Vue 3 composition setup.
- **Weak:** two chat surfaces (decide on one as the canonical AI surface); runtime deps drift; inconsistent use of contextData vs. knowledge/*.

### Environment Variables
- `VITE_GEMINI_API_KEY` is **prefixed** `VITE_` which means it ships in the client bundle — confirmed leak surface.
- No `.env.example`, no documentation of required env vars, no separation of dev vs prod keys.
- `.env` exists in the repo root but is not documented.

### Google Gemini Integration
| Aspect | Current State | Status |
|---|---|---|
| Endpoint | `…/v1beta/models/gemini-2.0-flash:generateContent?key=` | ⚠️ key in URL; non-streaming |
| Roles | `{ role: 'assistant' → 'model' }` | ✓ Correct |
| Safety | Four HARM_CATEGORY_* set to BLOCK_NONE | ✓ Acceptable for portfolio |
| Retry | Exponential backoff with jitter, max 3 | ✓ |
| Cache | 5-min TTL, 50-entry Map | ✓ |
| Timeout | None | ✗ A 504 from Gemini can hang UI forever |
| Streaming | None | ✗ Per Phase 14 requirement |
| Server-side proxy | None | ✗ Per Phase 2 requirement |
| Auth | `?key=` query param (works but exposed) | ✗ Should be server-held |

### Resume Download
- Persona messaging says "Download your resume" is a default suggested prompt (`defaultQuestions.js`), but **no resume handler exists**. No `resume` knowledge file, no ResumeCard component, no `/public/Resume.pdf` cited, no download hook.

### Projects / About / Skills / Experience / Contact
- Knowledge data exists in `src/lib/knowledge/*` and is rendered by AI cards.
- About Me (`profile.js`, `contextData.js`) opens with **"I'm a Full Stack Developer with 3+ years of experience"** — generic opener, no quantified impact.
- Projects (`projects.js`) lack screenshots, demo URLs, business-problem framing, measurable outcomes — they read as a CV list, not case studies.

### Navigation
- Card.vue has nav buttons (About / Projects / Experience / Contact) that swap articles via DOM queries — fragile but works.
- AILanding.vue has a "Browse Website" button that toggles `showAI` in App.vue, hiding the AI and showing the static portfolio.

### Mobile / Accessibility / Performance
- Mobile: AILanding has a `@media (max-width: 580px)` block, Chatbox disappears entirely below 580px, Card is responsive.
- Accessibility: keyboard `Enter` to send, `Escape` to close Chatbox, focus-within ring on input, semantic `<a>` tags — but **no ARIA labels on AI follow-up chips**, no `aria-live` on the messages container, and no reduced-motion handling on the new AILanding entrance staggers (it does have it, ✓).
- Performance: large inline SVG grain background, multiple radial glows — fine; but **no code splitting, no lazy-loaded card components, no image lazy-loading beyond Card.vue's projects**.

### Error Handling
- AILanding: error → friendly message + retry follow-ups ✓.
- Chatbox: error → generic "Sorry, I encountered an error." ✗ (loses context).
- Card.vue: form submit uses `alert()` and `console.log()` ✗ (placeholder behavior).

### State Management
- `local()` reactivity in AILanding — fine for a single-session chat.
- No persistence (refresh loses conversation). For a portfolio, this is acceptable.

### Security
- ✗ API key in URL.
- ✗ No CSP meta tag in `index.html`.
- ✗ No rate limiting on the client side.
- ✗ `handleFormSubmit` logs user input to `console.log` and `alert()` — no real submit handler.

### Build Configuration
- `vite.config.js` proxies `/api/chat` → external Vercel. After this audit's work, it should also proxy `/api/gemini`.
- `postcss.config.js`, `tailwind.config.js` exist (untracked) but `@tailwind base/components/utilities` are in `style.css`, mixing Tailwind + bespoke CSS variables — works but future drift risk.

### SEO / Metadata
- `<meta name="description" content="personalPortfolio" />` — placeholder.
- No Open Graph tags.
- No JSON-LD structured data.
- Title is "Anuj Khurana" — fine.

---

## Roadmap to Remaining Phases (post-Phase 2)

| Phase | Status | Plan |
|---|---|---|
| 2. Gemini integration | **Next commit** | Server-side Vercel function, /api/gemini, streaming via SSE, current model, drop client key. |
| 3. Knowledge base | Partially done | Split resume.ts / achievements.ts / resume.url, dedupe contextData vs. knowledge/*. |
| 4. About Me rewrite | Pending | Senior-engineer tone, quantified wins, AI focus, current goals. |
| 5. Projects upgrade | Pending | Case-study fields (business problem, architecture, impact, screenshots), premium card. |
| 6. Resume section | Pending | resume.js knowledge, ResumeCard.vue, download handler, last-updated date. |
| 7. Contact experience | Partially done | Add availability, response-time SLA, preferred role, visa, copy-email CTA. |
| 8. Rich UI responses | Partially done | Add Timeline, AchievementCard, comparison tables, Stat cards. |
| 9. Follow-ups | Done | ✓ AILanding already shows chips after every bot message. |
| 10. Guided flow | Pending | Suggested path: Welcome → Experience → Projects → Skills → Resume → Contact. |
| 11. Contextual follow-ups | Pending | Adapt suggestions based on topics already discussed. |
| 12. Intelligent suggestions | Pending | Topic-evolving suggestions (e.g., "Vue" → "Composition API" → "Pinia"). |
| 13. Session memory | Pending | Track topics discussed in session to avoid re-suggesting them. |
| 14. Polish (skeletons / streaming / copy / regen / feedback / theme) | Pending | Skeleton loaders, real streaming wired to UI, copy/regenerate/feedback, no console errors. |
| 15. Error recovery | Partial | Add graceful fallback identity ("running in local-only mode") when Gemini fails. |
| 16. Performance | Pending | Lighthouse pass, lazy cards, preload fonts, reduce JS payload. |
| 17. Final QA | Pending | Run all suggested prompts, verify every card edge case, accessibility audit. |

---

## Implementation Plan (Phase 1 + 2)

### Commit 1 — Branch + Audit (this file)
- Create `feature/ai-portfolio-production-upgrade`.
- Land `PRODUCTION_AUDIT.md` so subsequent commits can reference the same plan.

### Commit 2 — Gemini server-side proxy + UI wiring
- New: `frontend/api/gemini.js` (Vercel serverless function). Reads `GEMINI_API_KEY` from server env, never exposed. Streams via `text/event-stream`. Owns timeout, retry-once, error mapping. Uses current stable model.
- Modify: `frontend/vite.config.js` → dev proxy `/api/gemini` → same path.
- Modify: `frontend/src/lib/gemini/service.js` → calls `/api/gemini` (same-origin, key-less). Streaming-aware. Timeout-aborted. Drop the `apiKey` parameter.
- Modify: `frontend/src/components/AILanding.vue` → append streamed chunks into the bot message in place; real typing effect.
- Delete: `frontend/src/components/Chatbox.vue` and remove its import + mount from `App.vue`. The back-to-AI toggle becomes a no-op (we keep the static site reachable via "Browse Website" only).
- Cleanup: `package.json` — remove unused runtime deps (`openai`, `cors`, `express`) if you confirm there are no callers.

### Phase 1–2 Done → Stop, hand over, user-confirms scope for Phase 3+.
The prompt's instructions asked for 8 commits; per the user's explicit scope confirmation, we stop after 2 and re-confirm.

---

## Known Limitations (intentional for this PR)
- No streaming UI yet — Phase 2 lays the wire protocol; UI wiring will be added once the streaming branch is verified working in browser.
- No OpenAI proxy removal — `/api/chat` dev proxy kept for now in case Chatbox is reinstated later.
- No dependencies removed in this audit (only flagged) — `openai` / `cors` / `express` are dead but removing them touches `package-lock.json` and was deemed out of scope for the audit-first milestone.

---

## Test Plan for Phase 2
1. `npm install` clean.
2. `npm run build` succeeds with no warnings about unused exports.
3. With `GEMINI_API_KEY` set in `.env`, `/api/gemini` returns a first chunk in <2s and finishes within 30s.
4. Without `GEMINI_API_KEY`, the API returns `503` with a clear "running in local-only mode" body.
5. Frontend `AILanding` shows streamed chunks in real time and gracefully degrades to local-only chips when the function fails.
6. `src/components/Chatbox.vue` no longer exists; `App.vue` no longer imports it.
