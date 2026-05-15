import { defineConfig } from 'vite'
import { resolve } from 'path'

// Content script build — must be IIFE (single input, no dynamic imports)
// Chrome content scripts declared in manifest.json cannot be ES modules.
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false, // do NOT wipe dist — main build already wrote it
    rollupOptions: {
      input: resolve(__dirname, 'src/content.ts'),
      output: {
        format: 'iife',
        entryFileNames: 'content.js',
        inlineDynamicImports: true,
      },
    },
  },
})
