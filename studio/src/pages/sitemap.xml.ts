import type { APIRoute } from 'astro';
import { INDEX_EXAMPLES, EXAMPLE_SLUGS } from '../lib/seo';

// Indexable pages only: the legal placeholders, the thank-you page and the configurator's preview pages
// are noindex. The example sites are listed only when they are indexable (see src/lib/seo.ts).
const PAGES = ['', 'tervezo', 'ajanlatkeres', ...(INDEX_EXAMPLES ? EXAMPLE_SLUGS.map((s) => `peldak/${s}`) : [])];

export const GET: APIRoute = ({ site }) => {
  const base = new URL(import.meta.env.BASE_URL.replace(/\/?$/, '/'), site);
  const today = new Date().toISOString().slice(0, 10);
  const urls = PAGES.map((p) => `  <url><loc>${new URL(p ? `${p}/` : '', base).href}</loc><lastmod>${today}</lastmod></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
