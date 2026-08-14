import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Standalone single-HTML-file build for sharing as a live preview
// (e.g. a Claude Artifact) where only one file can be served. The
// on-device face-detection assets aren't bundled here (see public/
// mediapipe and public/models in the real build), so detection fails
// fast and the app falls back to its manual face-shape picker — the
// same fallback path it uses for any real user whose browser can't
// run detection.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    outDir: 'dist-artifact',
    emptyOutDir: true,
    cssCodeSplit: false,
  },
})
