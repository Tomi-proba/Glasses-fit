// Takes the screenshots of the example sites shown on the home page ("Munkáink"), with the 3D running.
//
//   npm run build && npm run preview          (in another terminal)
//   npm run example-shots -- [base-url]       default: http://127.0.0.1:4321/
//
// Needs Playwright with Chromium (npx playwright install chromium). Rerun after the photos change.
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright').catch(() => {
  console.error('A szkripthez Playwright kell: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
});
const root = resolve(fileURLToPath(import.meta.url), '../..');
const base = (process.argv[2] || 'http://127.0.0.1:4321/').replace(/\/?$/, '/');
const out = resolve(root, 'public/images/examples');
await mkdir(out, { recursive: true });

const PAGES = ['ingatlan-premium', 'ingatlan-alap', 'etterem-premium', 'etterem-alap'];
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'],
});
for (const slug of PAGES) {
  for (const [kind, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: kind === 'mobile' ? 2 : 1, isMobile: kind === 'mobile', hasTouch: kind === 'mobile' });
    const page = await ctx.newPage();
    // Skip the restaurant intro and hide the sample strip: the card shows the site itself.
    await page.addInitScript(() => {
      try { sessionStorage.setItem('fuszerkert:intro-seen', '1'); sessionStorage.setItem('sample-bar:hidden', '1'); } catch { /* about:blank */ }
    });
    await page.goto(`${base}peldak/${slug}/?3d=force`, { waitUntil: 'load' });
    await page.waitForTimeout(slug.endsWith('premium') ? 9000 : 2500);
    const png = await page.screenshot({ type: 'png' });
    const widths = kind === 'desktop' ? [1280, 720] : [390];
    for (const w of widths) await sharp(png).resize(w).webp({ quality: 74 }).toFile(resolve(out, `${slug}-${kind}-${w}.webp`));
    console.log(`✓ ${slug} ${kind}`);
    await ctx.close();
  }
}
await browser.close();
