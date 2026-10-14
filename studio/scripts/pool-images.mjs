// Kékvíz Medence: prepares the eight photos of the same garden (AI-generated, the client's own).
//
//   npm run pool-images -- <folder with 01-ures-kert.webp … 08-fedes-zarva.webp>
//
// All photos are shot from the same point, but a few are off by a pixel or two. Each file gets the
// shift measured against 01 (see SHIFT), so the cross-fades do not jump. Output, for every photo:
//   public/examples/pool/<nn>-1600.webp, -1100.webp   desktop (never upscaled)
//   public/examples/pool/<nn>-m.webp                  phones: a narrower crop around the pool
import { readdir, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const src = process.argv[2];
if (!src) { console.error('Add meg a képek mappáját.'); process.exit(1); }
const out = resolve(root, 'public/examples/pool');
await mkdir(out, { recursive: true });

// Measured offsets in source pixels (x, y): positive y moves the picture down.
const SHIFT = { '01': [0, 0], '02': [0, 0], '03': [0, 2], '04': [0, 2], '05': [0, 2], '06': [0, 0], '07': [0, 2], '08': [0, 2] };
// Phone crop: the pool and its surroundings, a little right of centre.
const MOBILE = { left: 0.24, width: 0.64 };

for (const file of (await readdir(src)).filter((f) => /^0\d-.*\.(webp|png|jpe?g)$/i.test(f)).sort()) {
  const nn = file.slice(0, 2);
  const img = sharp(resolve(src, file));
  const { width, height } = await img.metadata();
  const [dx, dy] = SHIFT[nn] ?? [0, 0];
  // shift by extending one edge and cropping the other, so the size stays the same
  const shifted = await img
    .extend({ top: Math.max(dy, 0), bottom: Math.max(-dy, 0), left: Math.max(dx, 0), right: Math.max(-dx, 0), extendWith: 'copy' })
    .extract({ left: Math.max(-dx, 0), top: Math.max(-dy, 0), width, height })
    .toBuffer();
  for (const w of [1600, 1100]) {
    await sharp(shifted).resize(Math.min(w, width)).webp({ quality: 70, effort: 6 }).toFile(resolve(out, `${nn}-${w}.webp`));
  }
  const cw = Math.round(width * MOBILE.width);
  await sharp(shifted).extract({ left: Math.round(width * MOBILE.left), top: 0, width: cw, height }).resize(Math.min(cw, 900)).webp({ quality: 68, effort: 6 }).toFile(resolve(out, `${nn}-m.webp`));
  console.log(`✓ ${nn} ${file}`);
}
