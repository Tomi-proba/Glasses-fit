# DESIGN.md – Vonal Stúdió

Two visual systems live in this project:

## 1. The studio site (/, /tervezo, /osszegzes, …)
Direction chosen with the client: **Framer-style "working artboard"** (voltagent/awesome-design-md), with a neon blue accent.

- Canvas `#090909`, surfaces `#121212` / `#1a1a1a`, hairlines `#262626`, ink `#f5f5f3`, muted `#a3a3a0`.
- One accent: `#00d4ff`. It is used for links, focus, selection and progress, plus one drenched panel (the price panel on the home page). Primary buttons are off-white and turn accent on hover.
- Type: Bricolage Grotesque 600 for display, tight tracking (-0.028em) and balanced headings; Onest for body; Martian Mono only for data (step numbers, figures).
- Shape rule: buttons are pills, panels 20px, inputs 10px, media 14px.
- Layout families on the home page: split hero with 3D, sticky heading + numbered steps (a real sequence), drenched price panel + 2-column checklist, asymmetric 7/5 sample grid of live previews, FAQ accordion, contact split.
- Motion: the hero 3D object assembling from particles is the one authored moment; sections reveal once on scroll; reduced motion turns everything static.

## 2. The client template (the product)
Every visual decision is a token generated from the site config, so each customer's site has its own identity. The defaults ("Kezdj üresen") are neutral dark with the studio accent.

- Colours: primary (buttons, accent band), accent (links, icons, stars), background, text. Surface, line and muted tones are mixed from background and text, and the readable accent and primary tones are computed to reach WCAG AA.
- Type: any two fonts from the list, optional uppercase tracked headings, and a global scale from 85 to 125%.
- Shape and depth: one radius for media and cards, buttons as pill, rounded or square, shadows none, soft or strong, spacing compact, normal or airy.
- Motion: none, subtle, normal or strong. This scales the reveal distance and duration, the parallax, and the smooth-scroll inertia.
- Blocks keep consistent internals (section head, container widths, hairline rhythm), so any combination stays coherent.

## Rules kept
No eyebrows, no em dashes in visible copy, no gradient text, no glows, icons only from Phosphor (light), real labels above inputs, errors below inputs.
