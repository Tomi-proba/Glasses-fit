// Turns a video into the WebP frame sequence a scroll-driven section plays on a canvas.
//
//   npm run video-frames -- <sequence> <video.mp4> [options]
//
//   --start 2.5 --end 14     use only this part of the video (seconds)
//   --desktop 140            desktop frame count (default 140, 1600 px wide)
//   --mobile 80              mobile frame count (default 80, 540x960 centre crop)
//   --provider Pexels --page <video page URL> --author "Name" --author-url <URL>
//   --provider "Saját felvétel" --note "…"   footage supplied by the client (no page URL)
//
// Stock footage must come from Pexels or Pixabay with their free licence. Frames are never upscaled:
// small sources keep their width and get a light sharpen instead. The script writes the frames to
// public/examples/seq/<sequence>/, updates src/examples/sequences.json and regenerates CREDITS.md.
import { execFileSync } from 'node:child_process';
import { mkdir, rm, readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const [name, input, ...rest] = process.argv.slice(2);
const opt = {};
for (let i = 0; i < rest.length; i += 2) opt[rest[i].replace(/^--/, '')] = rest[i + 1];
const manifestPath = resolve(root, 'src/examples/sequences.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
if (!name || !input || !manifest.sequences[name]) {
  console.error(`Használat: npm run video-frames -- <${Object.keys(manifest.sequences).join('|')}> <video.mp4> [--start s --end s --desktop 140 --mobile 80 --provider Pexels --page URL --author Név --author-url URL]`);
  process.exit(1);
}
if (opt.page && !/^https:\/\/(www\.)?(pexels\.com|pixabay\.com)\//.test(opt.page)) throw new Error('Csak Pexels vagy Pixabay videó használható.');

const probe = (args) => execFileSync('ffprobe', ['-v', 'error', ...args, input]).toString().trim();
const duration = Number(probe(['-show_entries', 'format=duration', '-of', 'csv=p=0']));
const start = Number(opt.start || 0);
const end = Math.min(Number(opt.end || duration), duration);
const span = end - start;
const out = resolve(root, `public/examples/seq/${name}`);
await rm(out, { recursive: true, force: true });

async function extract(kind, count, filter, quality) {
  const dir = resolve(out, kind);
  await mkdir(dir, { recursive: true });
  execFileSync('ffmpeg', ['-v', 'error', '-ss', String(start), '-t', String(span), '-i', input,
    '-vf', `fps=${count / span},${filter}`, '-frames:v', String(count), '-c:v', 'libwebp', '-quality', String(quality), '-compression_level', '5',
    resolve(dir, 'f%03d.webp')]);
  return (await readdir(dir)).length;
}
const [w, h] = probe(['-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=s=x:p=0']).split('x').map(Number);
const dw = Math.min(1600, w);
const mh = Math.min(960, h);
const mw = Math.round((mh * 9) / 16 / 2) * 2;
const sharpen = w < 1280 ? ',unsharp=5:5:0.55:5:5:0' : '';
const desktopF = `scale=${dw}:-2:flags=lanczos${sharpen}`;
const mobileF = `crop=ih*9/16:ih,scale=${mw}:${mh}:flags=lanczos${sharpen}`;
const desktop = await extract('desktop', Number(opt.desktop || 140), desktopF, 78);
const mobile = await extract('mobile', Number(opt.mobile || 80), mobileF, 74);
// Posters: the first frame (shown while loading) and the last one (the reduced-motion still).
const still = (at, filter, file) => execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(at), '-i', input, '-frames:v', '1', '-vf', filter, '-c:v', 'libwebp', '-quality', '80', resolve(out, file)]);
still(start, desktopF, 'poster.webp');
still(start, mobileF, 'poster-mobile.webp');
still(Math.max(start, end - 0.08), desktopF, 'poster-end.webp');
still(Math.max(start, end - 0.08), mobileF, 'poster-end-mobile.webp');

const seq = manifest.sequences[name];
seq.frames = { desktop: { count: desktop, width: dw, height: Math.round((dw * h) / w / 2) * 2 }, mobile: { count: mobile, width: mw, height: mh } };
if (opt.page || opt.provider) seq.source = { provider: opt.provider || (opt.page.includes('pixabay') ? 'Pixabay' : 'Pexels'), page: opt.page || '', author: opt.author || '', authorUrl: opt['author-url'] || '', note: opt.note || '' };
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`✓ ${name}: ${desktop} asztali + ${mobile} mobil képkocka (${span.toFixed(1)} s).`);
execFileSync('node', [resolve(root, 'scripts/example-photos.mjs')], { stdio: 'inherit' });
