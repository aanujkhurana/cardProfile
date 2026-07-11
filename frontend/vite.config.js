import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
//
// Dev proxy notes:
//  - `/api/gemini` is proxied to a local Vercel dev server on port 3000.
//    Run `npm run dev` (which boots both `vite` and `vercel dev` via
//    `concurrently --kill-others-on-fail`) to bring the serverless
//    function online. Without Vercel dev running, frontend calls will
//    return a friendly "running in local-only mode" message.
//  - The legacy `/api/chat` proxy to the external openai-proxy Vercel
//    deployment was removed in this branch — Chatbox.vue is gone and
//    nothing else calls /api/chat.
export default defineConfig({
  base: '/',
  plugins: [vue()],
  server: {
    proxy: {
      '/api/gemini': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

