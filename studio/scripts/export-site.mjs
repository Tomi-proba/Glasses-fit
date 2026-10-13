// Exports a customer's design as a standalone static website.
//
//   npm run export-site -- path/to/ajanlatkeres.json [out-dir]
//
// The input can be a site config (site.config.json structure) or a whole quote request JSON from
// /ajanlatkeres (then its `design` is used). Output: one index.html per page (home at the root,
// sub-pages in /<slug>/), bundled CSS/JS, images (uploaded ones extracted from data URLs),
// sitemap.xml and robots.txt. Upload the folder to any static host.
import { mkdir, readFile, writeFile, cp, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import { buildPage, pagesOf, setAssetBase } from '../src/template/render.js';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const [input, outArg] = process.argv.slice(2);
if (!input) {
  console.error('Használat: npm run export-site -- <config-vagy-ajanlatkeres.json> [kimeneti-mappa]');
  process.exit(1);
}
const data = JSON.parse(await readFile(resolve(input), 'utf8'));
const config = data.design || data.siteConfig || data;
if (config.version !== 2 || !Array.isArray(config.pages)) throw new Error('Ez nem 2-es verziójú site config.');
const out = resolve(outArg || join(root, 'export', String(config.brand?.name || 'weboldal').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')));

await rm(out, { recursive: true, force: true });
await mkdir(join(out, 'assets/uploads'), { recursive: true });

// Uploaded images live in the config as data URLs: write them out as files.
let n = 0;
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg', 'image/avif': 'avif' };
async function extract(node) {
  for (const [k, v] of Object.entries(node)) {
    if (typeof v === 'string' && v.startsWith('data:image/')) {
      const [head, body] = v.split(',');
      const mime = head.slice(5).split(';')[0];
      const file = `assets/uploads/kep-${++n}.${EXT[mime] || 'bin'}`;
      await writeFile(join(out, file), head.includes(';base64') ? Buffer.from(body, 'base64') : decodeURIComponent(body));
      node[k] = file;
    } else if (v && typeof v === 'object') await extract(v);
  }
}
await extract(config);

// Bundled assets and the runtime (Three.js is code-split and lazy-loaded).
await cp(join(root, 'public/template/assets'), join(out, 'assets'), { recursive: true });
await esbuild.build({ entryPoints: [join(root, 'src/template/runtime.js')], outdir: join(out, 'js'), bundle: true, splitting: true, format: 'esm', minify: true, target: 'es2020', chunkNames: 'chunks/[name]-[hash]', logLevel: 'warning' });
await esbuild.build({ entryPoints: [join(root, 'src/template/template.css')], outfile: join(out, 'css/site.css'), minify: true, logLevel: 'warning' });

const template = await readFile(join(root, 'src/template/standalone.html'), 'utf8');
for (const page of pagesOf(config)) {
  const rel = page.slug ? '../' : './';
  setAssetBase(rel);
  const html = buildPage(template.replaceAll('{{ROOT}}', rel), config, { pageId: page.id, root: rel });
  const dir = page.slug ? join(out, page.slug) : out;
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), html);
}

const site = String(config.meta?.siteUrl || 'https://www.example.com').replace(/\/+$/, '');
await writeFile(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pagesOf(config).map((p) => `  <url><loc>${site}/${p.slug ? `${p.slug}/` : ''}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
await writeFile(join(out, 'site.config.json'), JSON.stringify(config, null, 2));
console.log(`✓ ${pagesOf(config).length} oldal exportálva: ${out}`);
