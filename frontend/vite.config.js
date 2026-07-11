import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
//
// Dev proxy notes:
//  - `/api/gemini` is proxied to a local Vercel dev server on port 3000.
//    Run `npx vercel dev` in another terminal to bring the serverless
//    function online. Without Vercel dev running, frontend calls will
//    return 504 and the assistant will gracefully degrade to local-only.
//  - `/api/chat` is kept as a fallback for the legacy Chatbox surface
//    but Chatbox.vue is being phased out; this proxy entry will be
//    dropped in a later milestone.
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
      '/api/chat': {
        target: 'https://openai-proxy-mujovdlo3-anuj-khuranas-projects.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
