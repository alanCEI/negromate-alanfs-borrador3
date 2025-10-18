import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    cssMinify: true,
    minify: 'esbuild',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  css: {
    devSourcemap: true
  }
})
