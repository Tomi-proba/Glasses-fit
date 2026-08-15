import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Single-HTML-file build for sharing as a live preview in a sandboxed
// viewer (e.g. a Claude Artifact) that can only serve one file and blocks
// camera/upload anyway. The on-device face-detection assets aren't bundled
// here (see public/mediapipe and public/models in the real build) to keep
// this file small, so detection fails fast and the app falls back to its
// manual face-shape picker. For a single file that also runs real
// detection, see vite.config.standalone.ts instead.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    outDir: 'dist-artifact',
    emptyOutDir: true,
    cssCodeSplit: false,
  },
})
