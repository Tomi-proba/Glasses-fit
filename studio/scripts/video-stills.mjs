// Fills photo slots with stills taken from a video (e.g. the client's own footage).
//
//   npm run video-stills -- <video.mp4> aurum/about=9.6 aurum/p1-1=0.8 … [--note "…"]
//
// Each still is cropped to the slot's aspect ratio around the centre and saved in the slot's sizes.
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const args = process.argv.slice(2);
const input = args.shift();
const noteAt = args.indexOf('--note');
const note = noteAt >= 0 ? args.splice(noteAt, 2)[1] : 'Állókép a megrendelő videójából';
const manifestPath = resolve(root, 'src/examples/photos.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
// Keep in sync with src/examples/photos.ts
const widthsFor = (ratio) => (ratio[0] / ratio[1] >= 1.5 ? [960, 1600, 2400] : [640, 1280]);

for (const pair of args) {
  const [slot, at] = pair.split('=');
  const def = manifest.slots[slot];
  if (!def) throw new Error(`Ismeretlen fotóhely: ${slot}`);
  const png = execFileSync('ffmpeg', ['-v', 'error', '-ss', at, '-i', input, '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-']);
  for (const w of widthsFor(def.ratio)) {
    const h = Math.round((w * def.ratio[1]) / def.ratio[0]);
    const out = resolve(root, `public/examples/photos/${slot}-${w}.webp`);
    await mkdir(dirname(out), { recursive: true });
    await sharp(png).resize(w, h, { fit: 'cover', position: 'centre', kernel: 'lanczos3' }).sharpen({ sigma: 0.6 }).webp({ quality: 80 }).toFile(out);
  }
  def.source = { provider: 'Saját felvétel', page: '', author: '', note: `${note} (${at} mp)` };
  console.log(`✓ ${slot} ← ${at} mp`);
}
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
