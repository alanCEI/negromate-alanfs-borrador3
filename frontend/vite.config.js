import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    cssMinify: true, // Minifica CSS en producción
    minify: 'esbuild', // Usa esbuild para minificación rápida
    cssCodeSplit: false, // Mantén todo el CSS junto para evitar FOUC
    rollupOptions: {
      output: {
        // Asegura nombres de archivos consistentes
        manualChunks: undefined,
      }
    }
  },
  css: {
    devSourcemap: true // Sourcemaps para debugging en desarrollo
  }
})
