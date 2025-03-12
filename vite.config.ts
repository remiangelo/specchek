import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@nextui-org/react', 'framer-motion'],
          'icons': ['@heroicons/react']
        }
      }
    },
    chunkSizeWarningLimit: 1000 // Increase warning limit to reduce noise
  }
})
