import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue()],
  server: {
    proxy: {
      '/api/chat': {
        target: 'https://openai-proxy-louxhcirv-anuj-khuranas-projects.vercel.app',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})