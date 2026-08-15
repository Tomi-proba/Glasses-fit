import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Single-HTML-file build meant to be downloaded and opened directly
// (double-click, file://) with zero server and full functionality,
// including real face detection: the WASM runtime and model are embedded
// as base64 (see scripts/generate-embedded-assets.mjs and
// src/generated/embeddedAssets.ts) and turned into blob: URLs at runtime,
// since fetch() of sibling files is blocked under file:// but a local file
// is still a secure context, so camera and getUserMedia work fine.
// Run `npm run build:standalone` (generates the embedded assets first).
export default defineConfig({
  base: './',
  define: {
    'import.meta.env.VITE_STANDALONE': JSON.stringify('true'),
  },
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    outDir: 'dist-standalone',
    emptyOutDir: true,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 25000,
  },
})
