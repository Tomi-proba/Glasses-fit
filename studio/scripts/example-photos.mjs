// Downloads the example sites' photos listed in src/examples/photos.json, converts them to WebP
// in a few widths and writes CREDITS.md.
//
//   npm run example-photos            downloads missing files only
//   npm run example-photos -- --force re-downloads everything
//
// Only Unsplash (https://unsplash.com/license) and Pexels (https://www.pexels.com/license/) photos
// are allowed. Each slot's `source` looks like:
//   { "provider": "Unsplash", "page": "https://unsplash.com/photos/<id>", "download": "<direct image URL>",
//     "author": "Photographer Name", "authorUrl": "https://unsplash.com/@handle" }
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const force = process.argv.includes('--force');
const manifest = JSON.parse(await readFile(resolve(root, 'src/examples/photos.json'), 'utf8'));
const ALLOWED = /^https:\/\/(images\.unsplash\.com|unsplash\.com|images\.pexels\.com|www\.pexels\.com)\//;
// Keep in sync with src/examples/photos.ts
const widthsFor = (ratio) => (ratio[0] / ratio[1] >= 1.5 ? [960, 1600, 2400] : [640, 1280]);
const exists = (p) => access(p).then(() => true, () => false);

let done = 0;
let missing = 0;
for (const [slot, def] of Object.entries(manifest.slots)) {
  const src = def.source;
  if (!src?.download) { missing++; continue; }
  if (!ALLOWED.test(src.download) || !ALLOWED.test(src.page || '')) throw new Error(`${slot}: csak Unsplash vagy Pexels kép használható.`);
  const widths = widthsFor(def.ratio);
  const out = (w) => resolve(root, `public/examples/photos/${slot}-${w}.webp`);
  if (!force && (await exists(out(widths.at(-1))))) { done++; continue; }
  const res = await fetch(src.download);
  if (!res.ok) throw new Error(`${slot}: letöltés sikertelen (${res.status}).`);
  const input = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(out(widths[0])), { recursive: true });
  for (const w of widths) {
    const h = Math.round((w * def.ratio[1]) / def.ratio[0]);
    await sharp(input).resize(w, h, { fit: 'cover', position: 'attention' }).webp({ quality: 72, effort: 5 }).toFile(out(w));
  }
  done++;
  console.log(`✓ ${slot}`);
}

const rows = Object.entries(manifest.slots)
  .filter(([, d]) => d.source?.download)
  .map(([slot, d]) => `| \`${slot}\` | ${d.alt} | [${d.source.author}](${d.source.authorUrl || d.source.page}) | ${d.source.provider} | ${d.source.page} |`);
const sequences = JSON.parse(await readFile(resolve(root, 'src/examples/sequences.json'), 'utf8')).sequences;
const videoRows = Object.entries(sequences)
  .filter(([, d]) => d.source)
  .map(([key, d]) => `| \`${key}\` | ${d.label} | ${d.source.author ? `[${d.source.author}](${d.source.authorUrl || d.source.page})` : ''} | ${d.source.provider} | ${d.source.page || d.source.note || ''} |`);
await writeFile(resolve(root, 'CREDITS.md'), `# Képek és videók forrása

A példaoldalak (\`/peldak/…\`) fotói az [Unsplash](https://unsplash.com/license) és a [Pexels](https://www.pexels.com/license/) oldalról származnak. Mindkét licenc ingyenes, kereskedelmi célú felhasználást is megenged, a forrásmegjelölés nem kötelező, de itt feltüntetjük.

| Hely | Kép | Fotós | Forrás | Eredeti |
| --- | --- | --- | --- | --- |
${rows.join('\n') || '| | Még nincs letöltött kép. | | | |'}

## Videók

A görgetés-vezérelt jelenetek (a Prémium példaoldalak) videói a megrendelő saját felvételei, vagy a [Pexels](https://www.pexels.com/license/), illetve a [Pixabay](https://pixabay.com/service/license-summary/) oldalról származnak, ingyenes licenccel. Képkockákra bontva szerepelnek az oldalon.

| Jelenet | Tartalom | Készítő | Forrás | Eredeti |
| --- | --- | --- | --- | --- |
${videoRows.join('\n') || '| | Még nincs videó. | | | |'}
`);
console.log(`${done} kép kész, ${missing} helyhez még nincs forrás megadva. CREDITS.md frissítve.`);
