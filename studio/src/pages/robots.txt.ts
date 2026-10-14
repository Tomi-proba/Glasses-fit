import type { APIRoute } from 'astro';

// Everyone may crawl, search engines and AI search alike. The AI crawlers are named one by one so it
// is obvious they are welcome (some site builders block them by default). Only the configurator's
// internal preview pages and the thank-you page are kept out.
const AI_BOTS = [
  'Googlebot', 'Google-Extended', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'Applebot', 'Applebot-Extended', 'CCBot', 'DuckAssistBot', 'meta-externalagent',
];

export const GET: APIRoute = ({ site }) => {
  const base = new URL(import.meta.env.BASE_URL.replace(/\/?$/, '/'), site);
  const rules = `Allow: /\nDisallow: ${base.pathname}sablon/\nDisallow: ${base.pathname}koszonjuk\n`;
  const body = [
    ...AI_BOTS.map((bot) => `User-agent: ${bot}\n${rules}`),
    `User-agent: *\n${rules}`,
    `Sitemap: ${new URL('sitemap.xml', base).href}\n`,
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
