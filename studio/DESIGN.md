# DESIGN.md – Vonal Stúdió

Direction (from the client's references, a surreal painted "pear" site and a photoreal showroom gallery):
**the picture is the page.** Full-bleed photo or scroll-driven video, with the interface as a thin layer on top.

## Rules for every page
- Two text styles only: one display serif in one size, and one small sans in one size (labels are the same size, uppercase and tracked). No third size, no bold emphasis, no italic headlines.
- Interface: 1px lines (frames, dividers, hairline inputs), small square buttons, underlined text links, tiny words in the corners, an optional hotspot ring.
- Never: cards, pills, shadows, glassmorphism, gradient text, icon rows, eyebrows above titles, three equal cards in a row.
- Scroll moves from scene to scene (100svh pictures, pinned video sequences, a pinned film strip), with quiet typographic plates in between.
- Copy: short, concrete sentences a local business would write. No slogans in threes, no dash constructions.
- Every font was tested with "Őszi szőlőfürt, árvíztűrő tükörfúrógép".

## Per site
| Site | Display | Small | Colour |
| --- | --- | --- | --- |
| Vonal Stúdió (/, tervező, ajánlatkérés) | Instrument Serif | Geist (+ Geist Mono for step numbers) | near-black, neon blue only for links and focus |
| Aurum Ingatlan | Newsreader, upright, light | Instrument Sans | warm near-black; the picture carries the colour |
| Pixel Pont Játékterem | Tiny5 (pixel) | VT323 | black room, pink and cyan neon, a blue CRT; taken from the arcade photo |

Shared grammar for the examples: `src/examples/exhibit.css` (Pixel Pont has its own `arcade.css`: the arcade is a game, so its UI is a game menu, but it keeps the rules: two typefaces, 1px lines, no cards). Pixel fonts were checked visually: Press Start 2P, Pixelify Sans and Silkscreen draw ő/ű wrong, Tiny5 and VT323 get them right. Prémium adds the scroll-driven video, hover previews, the pinned film strip and slow zooms; Alap keeps the same scenes with still photos and one fade.

## The client template (the product)
Every visual decision is a token generated from the site config (see README). Unchanged by this direction.
