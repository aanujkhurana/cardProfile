# Agent Guide

This repo is Anuj Khurana's interactive portfolio. It has three main parts:

- `frontend/`: Vue 3 + Vite single page portfolio app.
- `backend/`: Sanity Studio configuration and schema definitions.
- `openai-proxy/`: Vercel Edge API route that proxies chat requests to OpenAI.

The root `package.json` is intentionally empty, so run commands from the relevant subdirectory.

## Repository Map

- `frontend/src/main.js` mounts the Vue app.
- `frontend/src/App.vue` renders the global theme toggle, AI chatbox, and main portfolio card.
- `frontend/src/components/Card.vue` is the main portfolio shell. It owns sidebar contact info, tab navigation, the About page, and embeds `Skills`, `Projects`, `Experiences`, and `Contact`.
- `frontend/src/components/Chatbox.vue` is the floating AI assistant. It builds its system prompt from `frontend/src/lib/chatbox/systemPrompt.js` and `frontend/src/lib/chatbox/contextData.js`.
- `frontend/src/components/Projects.vue` fetches Sanity `works`, builds tag filters, and paginates project cards.
- `frontend/src/components/Experiences.vue` fetches Sanity `experiences`.
- `frontend/src/components/Contact.vue` validates the contact form and creates Sanity `contact` documents.
- `frontend/src/components/Skills.vue` renders local skill arrays as auto-scrolling carousels with remote devicon SVGs.
- `frontend/src/style.css` contains most layout, design tokens, responsive rules, and light/dark theme variables.
- `frontend/index.html` loads Poppins fonts and global Ionicons.
- `backend/schemaTypes/` contains Sanity document schemas.
- `openai-proxy/api/chat.js` is the serverless chat endpoint.

## Commands

Install frontend dependencies:

```sh
cd frontend
npm install
```

Run the frontend locally:

```sh
cd frontend
npm run dev
```

Build the frontend:

```sh
cd frontend
npm run build
```

Preview a production build:

```sh
cd frontend
npm run preview
```

Install proxy dependencies:

```sh
cd openai-proxy
npm install
```

There is no meaningful test script in this repo right now. After code changes, use `npm run build` in `frontend/` as the baseline verification.

## Environment Variables

Frontend variables are read through Vite:

- `VITE_SANITY_PROJECT_ID`: Sanity project id used by `frontend/src/lib/sanity_client.js`.
- `VITE_SANITY_TOKEN`: Sanity token used by the frontend client, including contact form writes.
- `VITE_OPENAI_API_KEY`: Passed into `Chatbox` from `App.vue`; chat requests currently go through the proxy rather than using this key directly.
- `VITE_API_URL`: Optional full URL for the chat proxy. In development, the app falls back to `/api/chat` through the Vite proxy.

Proxy variables:

- `OPENAI_API_KEY`: Used by `openai-proxy/api/chat.js`.

Do not add private keys directly to source files. Be especially careful with Sanity tokens because frontend `VITE_*` variables are exposed to the browser bundle.

## Architecture Notes

- The frontend uses Vue 3 Composition API and single-file components. Most files use plain JavaScript; `Skills.vue` currently uses `<script setup lang="ts">`.
- Navigation in `Card.vue` is DOM-driven through `data-*` attributes and class toggles. Preserve attributes such as `data-page`, `data-nav-link`, `data-sidebar`, `data-sidebar-btn`, `data-filter-btn`, `data-form`, `data-form-input`, and `data-form-btn` unless you also update the related setup functions.
- Theme switching toggles `light-theme` on `document.documentElement`. Add theme colors through CSS variables in `frontend/src/style.css` rather than hardcoding one-off colors.
- Ionicons are loaded globally in `frontend/index.html`; existing templates use `<ion-icon>` without imports.
- Most app-wide styling lives in `frontend/src/style.css`; component-scoped styles are used for localized widgets like `Chatbox`, `ThemeToggle`, `Contact`, and `Skills`.
- Sanity image URLs should go through `urlFor` from `frontend/src/lib/sanity_client.js`.
- `Projects.vue` expects `works` documents to include `title`, `projectLink`, `codeLink`, `imgUrl`, and `tags`.
- `Experiences.vue` expects `experiences` documents with a `year` field and a `works` array of `workExperience` objects.

## Chat Assistant Notes

- `Chatbox.vue` sends requests to `VITE_API_URL`, or `/api/chat` in dev, or a hardcoded deployed Vercel URL in production.
- `systemPrompt.js` generates the prompt from `contextData.js`. Keep those files in sync when changing portfolio content.
- `formatMessage` performs simple markdown-to-HTML replacements and renders bot output with `v-html`. If the chat ever accepts broader untrusted content, add sanitization.
- The proxy currently forwards `messages`, `model`, `max_tokens`, and `temperature` to OpenAI chat completions and returns the raw OpenAI response JSON.

## Sanity Notes

- Sanity project id is hardcoded as `f26ecsn2` in `backend/sanity.config.js` and `backend/sanity.cli.js`; dataset is `production`.
- Schemas exported from `backend/schemaTypes/index.js`: `abouts`, `brands`, `contact`, `experiences`, `skills`, `testimonials`, `works`, and `workExperience`.
- There is no `backend/package.json` in the current repo. Use Sanity CLI only if dependencies are installed or available in the environment.

## Change Guidelines

- Check `git status --short` before editing. This repo may contain user changes; do not overwrite unrelated work.
- Keep edits scoped to the relevant package. Avoid root package changes unless the user explicitly asks for repo-level tooling.
- Match existing formatting: two-space indentation in Vue templates is common, semicolon usage is mixed, and most imports use double quotes in Vue files.
- Prefer CSS variables and existing classes over introducing a parallel design system.
- For UI changes, verify desktop and mobile breakpoints because `style.css` has significant responsive behavior at 450px, 580px, 768px, 1024px, and 1250px.
- For changes touching Sanity data, update both schema expectations and frontend queries/rendering.
- For chat changes, verify both the frontend request path and the Vercel proxy behavior.

## Known Quirks

- `frontend/README.md` is still the default Vue + Vite template readme; the root `README.md` has the real project overview.
- `frontend/vite.config.js` proxies `/api/chat` to a deployed Vercel endpoint during development.
- `Contact.vue` contains a hardcoded Google Maps embed key.
- Some chat context fields are not perfectly normalized with the prompt builder, so adjust `contextData.js` and `systemPrompt.js` together.
- The repo has no automated tests configured.
