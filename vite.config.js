import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    chunkSizeWarningLimit: 800,
  },
  // Keep PostCSS config inline so Vite doesn't scan parent workspace files.
  css: {
    postcss: {},
  },
})
