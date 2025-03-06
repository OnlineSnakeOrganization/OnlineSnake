import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Snake/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,  // Disable code splitting and bundle everything into one file
      },
    },
  },
})
