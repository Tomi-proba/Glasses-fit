# DESIGN.md – Aura template visual system

Direction chosen with the client: **Bugatti-inspired austere luxury** (from voltagent/awesome-design-md), adapted for a hair salon with a neon blue accent.

## World
- Near-black canvas (`#070707`), off-white ink (`#f1f1ef`), one accent (`--accent`, default `#00d4ff`). No gradients on text, no glows, no grain.
- Light theme mirrors it: `#f3f3f1` canvas, `#0c0c0d` ink. The accent text tone (`--accent-ink`) is computed to stay at WCAG AA on either canvas.
- The accent appears only on: primary button outline/fill, hover hairlines, active nav underline, stars, form focus, and the 3D object's edges.

## Type
| Role | Face | Use |
| --- | --- | --- |
| Display | Tenor Sans 400, uppercase, tracking 0.08em | headlines, service names, wordmark, figures |
| Body | Hanken Grotesk 400 | running text, max ~56ch |
| Data | Martian Mono 300/400 | prices, opening hours, labels, captions, buttons |

Headlines are balanced; the hero headline stays at two lines on desktop.

## Shape
- Media (images, map) use `--radius` (default 0, configurable).
- Interactive controls are always pills (buttons) or circles (icon buttons).
- Structure is drawn with 1px hairlines (`--line`), never cards or shadows.

## Composition (one layout family per section)
1. Hero: split, copy left, 3D object right (stacked on mobile, object first).
2. About: full-width statement, then image + copy with a ruled three-cell spec row.
3. Services: two-column price list, hairline above each row, price in mono.
4. Gallery: 12-column mosaic (one large tile + two stacked, then three), repeating every six.
5. Testimonials: heading + controls left, one quote on stage right.
6. Contact: ruled definition list + hours left, underline form right, full-width grayscale map below.
7. Footer: oversized tracked wordmark, then links and socials.

## Motion
- One authored moment: the hero object assembling from scattered particles (2.6s, ease-out), then a slow sway and a pointer-driven tilt; particles part around the cursor.
- Hero headline tracking settles from wide to normal (visible from the first frame).
- Below-the-fold reveals only: clip-path for images, short rise for price rows. Parallax on the hero and the about image.
- Everything collapses to static under `prefers-reduced-motion`; no WebGL or a software renderer shows the still image.

## Rules kept
No eyebrows above headings, no section numbers, no em dashes in visible copy, no card grids, no emoji, icons only from Phosphor (light).
