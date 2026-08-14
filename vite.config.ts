import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works whether it's served from a domain root
  // or a GitHub Pages project subpath (https://<user>.github.io/<repo>/).
  base: './',
  plugins: [react(), tailwindcss()],
})
