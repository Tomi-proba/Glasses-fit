// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL / BASE_PATH let the same project deploy to a domain root or a sub-path
// (GitHub Pages: https://<user>.github.io/<repo>/).
export default defineConfig({
  site: process.env.SITE_URL || 'https://tomi-proba.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  devToolbar: { enabled: false },
});
