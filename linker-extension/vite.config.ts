import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content.ts'),
      },
      output: [
        // ES module output for popup + background (service worker supports modules)
        {
          format: 'es',
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === 'background') return 'background.js'
            if (chunkInfo.name === 'content') return '_content_es.js' // not used
            return 'assets/[name]-[hash].js'
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
        // IIFE output for content script (content scripts cannot be ES modules)
        {
          format: 'iife',
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === 'content') return 'content.js'
            return '_unused_[name].js'
          },
          chunkFileNames: '_unused_chunks/[name].js',
          assetFileNames: '_unused_assets/[name].[ext]',
        },
      ],
    },
  },
})
