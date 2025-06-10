import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/OnlineSnake/',  // Set the base path to the repository name
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,  // Disable code splitting and bundle everything into one file
      },
    },
    outDir: 'dist',  // Set the output directory to dist
  },
})
