// Photo slots of the example sites (see photos.json and scripts/example-photos.mjs).
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import manifest from './photos.json';
import { url } from '../lib/url';

export interface Slot { alt: string; ratio: [number, number]; query: string; source: null | { provider: string; page: string; author: string } }
const SLOTS = manifest.slots as Record<string, Slot>;

// Keep in sync with scripts/example-photos.mjs
export const widthsFor = (ratio: [number, number]) => (ratio[0] / ratio[1] >= 1.5 ? [960, 1600, 2400] : [640, 1280]);

export function photo(slot: string) {
  const def = SLOTS[slot];
  if (!def) throw new Error(`Unknown photo slot: ${slot}`);
  const widths = widthsFor(def.ratio);
  const file = (w: number) => `examples/photos/${slot}-${w}.webp`;
  // Build time check: slots without a downloaded file render as a placeholder.
  const ready = existsSync(resolve(process.cwd(), 'public', file(widths.at(-1)!)));
  return {
    ...def,
    ready,
    src: ready ? url(file(widths[Math.min(1, widths.length - 1)])) : '',
    srcset: ready ? widths.map((w) => `${url(file(w))} ${w}w`).join(', ') : '',
    width: widths.at(-1)!,
    height: Math.round((widths.at(-1)! * def.ratio[1]) / def.ratio[0]),
  };
}
