import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
        format: 'iife',
        // IIFE no necesita type="module", funciona desde file://
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    assetsInlineLimit: 100 * 1024 * 1024,
  },
  preview: {
    port: 5173,
    open: true,
  },
  server: {
    port: 5173,
    open: true,
  },
})
