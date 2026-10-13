import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = new URL(import.meta.env.BASE_URL.replace(/\/?$/, '/'), site);
  const body = `User-agent: *\nAllow: /\nDisallow: ${base.pathname}sablon/\nDisallow: ${base.pathname}koszonjuk\n\nSitemap: ${new URL('sitemap.xml', base).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
