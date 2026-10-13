// Builds the site into dist/:
//   - prerenders index.html from site.config.json (SEO-friendly static HTML)
//   - bundles + minifies JS/CSS with esbuild (Three.js is code-split and lazy-loaded)
//   - writes sitemap.xml, robots.txt and the configurator
// Usage: node scripts/build.mjs [--watch] [--serve] [--config path/to/site.config.json]
import { createServer } from 'node:http';
import { gzipSync } from 'node:zlib';
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { watch } from 'node:fs';
import { extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import { buildPage, buildRobots, buildSitemap } from '../src/js/render.js';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const configArg = args.includes('--config') ? args[args.indexOf('--config') + 1] : 'site.config.json';
const configPath = resolve(root, configArg);
const src = join(root, 'src');
const out = join(root, 'dist');

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((e) => (e.isDirectory() ? listFiles(join(dir, e.name)) : [join(dir, e.name)])));
  return files.flat();
}

const toPosix = (p) => p.split(sep).join('/');

async function build() {
  const started = Date.now();
  const config = JSON.parse(await readFile(configPath, 'utf8'));
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  await cp(join(root, 'public'), out, { recursive: true });

  const common = { bundle: true, minify: true, format: 'esm', target: ['es2020', 'safari14'], logLevel: 'warning', legalComments: 'none' };
  // The public site: main bundle + lazily loaded chunks (hero3d / three, render for preview).
  const site = await esbuild.build({
    ...common,
    entryPoints: [join(src, 'js/main.js')],
    outdir: join(out, 'js'),
    splitting: true,
    chunkNames: 'chunks/[name]-[hash]',
    metafile: true,
  });
  // The configurator is a separate app and is not part of the exported client site.
  await esbuild.build({ ...common, entryPoints: [join(src, 'js/configurator.js')], outdir: join(out, 'js') });
  await esbuild.build({ ...common, entryPoints: [join(src, 'css/site.css'), join(src, 'css/configurator.css')], outdir: join(out, 'css'), bundle: false });

  const template = await readFile(join(src, 'index.html'), 'utf8');
  await writeFile(join(out, 'index.html'), buildPage(template, config));
  await writeFile(join(out, 'template.html'), template);
  await writeFile(join(out, 'site.config.json'), JSON.stringify(config, null, 2));
  await writeFile(join(out, 'sitemap.xml'), buildSitemap(config));
  await writeFile(join(out, 'robots.txt'), buildRobots(config));
  await cp(join(src, 'configurator.html'), join(out, 'configurator.html'));

  // Files the configurator puts into an exported client site (ZIP).
  const publicFiles = (await listFiles(join(root, 'public'))).map((f) => toPosix(relative(join(root, 'public'), f)));
  const siteJs = Object.keys(site.metafile.outputs).filter((f) => !f.endsWith('.map')).map((f) => toPosix(relative(out, resolve(root, f))));
  const manifest = [...new Set(['css/site.css', ...siteJs, ...publicFiles])].sort();
  await writeFile(join(out, 'export-manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(`✓ built dist/ in ${Date.now() - started} ms (${configArg})`);
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon',
};

function serve(port = Number(process.env.PORT) || 5173) {
  createServer(async (req, res) => {
    try {
      let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (path.endsWith('/')) path += 'index.html';
      const file = resolve(out, '.' + path);
      if (!file.startsWith(out)) throw new Error('outside');
      if (!(await stat(file)).isFile()) throw new Error('not a file');
      const type = MIME[extname(file)] || 'application/octet-stream';
      let body = await readFile(file);
      const headers = { 'Content-Type': type, 'Cache-Control': 'no-cache' };
      // Compress text assets like a production host would.
      if (/text|javascript|json|xml|svg/.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
        body = gzipSync(body);
        headers['Content-Encoding'] = 'gzip';
      }
      res.writeHead(200, headers);
      res.end(body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  }).listen(port, () => console.log(`→ http://localhost:${port}/  (configurator: http://localhost:${port}/configurator.html)`));
}

await build();
if (flag('--watch')) {
  let timer;
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(() => build().catch((e) => console.error(e.message)), 120);
  };
  for (const p of [src, join(root, 'public')]) watch(p, { recursive: true }, rebuild);
  watch(configPath, rebuild);
  console.log('watching for changes…');
}
if (flag('--serve')) serve();
