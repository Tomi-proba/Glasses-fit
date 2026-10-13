# Prémium bemutatkozó weboldal-sablon + élő konfigurátor

Konfigurációvezérelt, egyoldalas céges weboldal-sablon (minta: **Aura Hair Studio**, fodrászszalon, neon kék kiemelő szín) és egy hozzá tartozó **élő konfigurátor**, amellyel az ügyfél lépésről lépésre testreszabhatja a saját oldalát, majd letöltheti kész, feltölthető weboldalként.

- **3D hero** Three.js-szel: részecske-galaxis, folyékony gömb vagy hullámzó pontrács; egérmozgásra reagál, mobilon könnyített, és csak a betöltés után, lazy módon töltődik be.
- **GSAP + ScrollTrigger** görgetési animációk és parallax, **Lenis** sima görgetés.
- Mikro-interakciók: mágneses gombok, 3D-ben dőlő kártyák fénycsóvával, hover effektek.
- Sötét / világos téma, CSS változókra épülő színek, Google Fonts betűtípusok.
- SEO: meta tagek, Open Graph / Twitter kártya, `LocalBusiness` JSON-LD, `sitemap.xml`, `robots.txt`, előrenderelt HTML.
- Akadálymentesség: skip link, ARIA címkék, alt szövegek, látható fókusz, automatikusan kontrasztos kiemelő szín, `prefers-reduced-motion` támogatás (ilyenkor nincs 3D, nincs sima görgetés, és nincsenek animációk).
- Lighthouse (headless Chrome, helyi szerver gzippel): **100 / 100 / 100 / 100** mobilon és asztalin is.

## Gyors kezdés

```bash
cd site-template
npm install
npm run dev        # build + figyelés + szerver: http://localhost:5173
```

| URL | Mi ez |
| --- | --- |
| `http://localhost:5173/` | A mintaoldal |
| `http://localhost:5173/configurator.html` | Az élő konfigurátor |

`npm run build` csak buildel (`dist/`), `npm run preview` buildel és kiszolgálja a `dist/` mappát.

## Mappaszerkezet

```
site-template/
├── site.config.json        ← MINDEN tartalom, szín, kép és elérhetőség itt van
├── public/assets/          ← logó, favicon, OG-kép, galériaképek (változtatás nélkül másolódnak)
├── src/
│   ├── index.html          ← oldal-sablon ({{HEAD}}, {{BODY}} helyőrzőkkel)
│   ├── configurator.html
│   ├── css/site.css        ← az oldal stílusai (csak CSS változókat használ a témához)
│   ├── css/configurator.css
│   └── js/
│       ├── render.js       ← közös renderelő: config → HTML (build, előnézet és ZIP export is ezt használja)
│       ├── main.js         ← Lenis, GSAP animációk, interakciók, űrlap, előnézet-fogadás
│       ├── hero3d.js       ← Three.js effektek (külön, lazy-loaded chunk)
│       └── configurator.js
└── scripts/build.mjs       ← esbuild bundle + előrenderelés + sitemap/robots + dev szerver
```

## Testreszabás új ügyfélre

### A) Konfigurátorral (ajánlott, fejlesztő nélkül is)

1. Nyisd meg a `configurator.html`-t (`npm run dev`, vagy a buildelt `dist/` bármilyen statikus tárhelyen).
2. Menj végig a 7 lépésen: **Alapadatok → Megjelenés → Szekciók → Szövegek → Képek → Elérhetőség → Mentés & export**.
   Bal oldalon a beállítások, jobb oldalon az élő előnézet (asztali / tablet / mobil nézet). Mobilon alul válthatsz a beállítások és az előnézet között.
3. Minden változás azonnal megjelenik az előnézetben, és automatikusan mentődik a böngészőbe (localStorage).
4. Export:
   - **Weboldal letöltése (.zip)** – kész, feltölthető statikus oldal: előrenderelt `index.html`, minifikált JS/CSS, a feltöltött képek külön fájlként (`assets/uploads/`), `sitemap.xml`, `robots.txt`, `site.config.json`.
   - **JSON letöltése / betöltése** – a `site.config.json`, amit később vissza lehet tölteni, vagy a fejlesztő a repóba tehet.

> A ZIP export a buildelt fájlokat csomagolja, ezért a konfigurátort a `dist/`-ből (vagy `npm run dev`-vel) kell futtatni, nem közvetlenül az `src/`-ből.

### B) Kézzel, a config fájlban

1. Másold le a `site-template` mappát (vagy hozz létre egy új configot, és buildeld azzal: `node scripts/build.mjs --config ugyfelek/bella.json`).
2. Szerkeszd a `site.config.json`-t (lásd lent), a képeket tedd a `public/assets/` alá.
3. `npm run build` → a `dist/` mappa tartalmát töltsd fel a tárhelyre.
4. **Fontos:** állítsd be a `meta.siteUrl`-t a végleges domainre (canonical URL, OG-kép, sitemap).

## `site.config.json` felépítése

| Kulcs | Leírás |
| --- | --- |
| `meta` | `lang`, `siteUrl`, `title`, `description`, `keywords`, `ogImage` – SEO és megosztás |
| `brand` | `name`, `shortName` (menüben), `tagline`, `logo` (üresen hagyva a név kezdőbetűje jelenik meg), `logoAlt` |
| `theme` | `mode`: `"dark"` / `"light"`, `accent`: hex szín, `headingFont` / `bodyFont` (lásd `FONTS` a `render.js`-ben), `radius` (px) |
| `effect3d` | `"particles"`, `"blob"`, `"waves"` vagy `"none"` |
| `sections.order` | A szekciók sorrendje: `hero`, `about`, `services`, `gallery`, `testimonials`, `contact` |
| `sections.enabled` | Szekciónként `true` / `false` – ki-be kapcsolás |
| `hero` | `eyebrow`, `title`, `subtitle`, `ctaText`, `ctaLink`, `secondaryText`, `secondaryLink` |
| `about` | `title`, `paragraphs[]`, `image`, `imageAlt`, `stats[]` (`value`, `suffix`, `label`) |
| `services` | `title`, `intro`, `items[]` (`icon`, `title`, `text`, `price`) – ikonok: `scissors, palette, droplet, sparkles, razor, heart, star, crown, leaf, sun, gift, calendar` |
| `gallery` | `title`, `intro`, `items[]` (`src`, `alt`, `caption`) |
| `testimonials` | `title`, `items[]` (`quote`, `name`, `role`, `rating` 0–5) |
| `contact` | `address`, `phone`, `email`, `hours[]`, `mapQuery` (Google Térkép keresés), `formEndpoint`, űrlap-szövegek |
| `social[]` | `type` (`instagram, facebook, tiktok, youtube, linkedin, x`) + `url` |
| `footer` | `text`, `copyright` |

Minden szekciónak van `navLabel` (menüfelirat) és `eyebrow` (kis felirat a cím fölött) mezője is.

### Színek és téma

A `render.js` a configból CSS változókat generál (`--accent`, `--accent-rgb`, `--accent-ink`, `--on-accent`, `--bg`, `--surface`, `--text`, `--muted`, `--border`, `--font-heading`, `--font-body`, `--radius`). A `site.css` kizárólag ezeket használja.
- `--on-accent`: a kiemelő színű gombok szövegszíne – automatikusan fekete vagy fehér, amelyik jobban olvasható.
- `--accent-ink`: a kiemelő szín szövegként használt változata; ha a választott szín nem elég kontrasztos a háttérrel (pl. neon kék világos témán), automatikusan sötétítjük / világosítjuk, amíg el nem éri a WCAG AA 4.5:1 arányt.

### Kapcsolati űrlap

- Ha a `contact.formEndpoint` meg van adva (pl. [Formspree](https://formspree.io) `https://formspree.io/f/xxxx`), az űrlap AJAX-szal oda küld.
- Ha üres, az űrlap a látogató e-mail kliensét nyitja meg a kitöltött üzenettel (`mailto:`).
- Beépített honeypot mező véd az egyszerű spam botok ellen.

### Új 3D effekt hozzáadása

A `src/js/hero3d.js`-ben írj egy `makeXxx(ctx)` függvényt, amely `{ object, material, update(t) }` objektumot ad vissza, vedd fel a `FACTORIES`-be, és a `render.js` `EFFECTS` listájába (így a konfigurátorban is megjelenik).

## Teljesítmény

- Az oldal előrenderelt HTML, a 3D-t pedig a `load` esemény után, üresjáratban tölti be a böngésző – így nem lassítja az első megjelenítést.
- Mobilon kevesebb részecske / poligon, alacsonyabb pixelarány és nincs egérkövetés; a renderelés szünetel, ha a hero nem látható vagy a fül a háttérben van.
- Szoftveres WebGL-en (GPU nélküli gépen) a 3D kimarad, és a CSS-es fényhatás marad. Hibakereséshez a `?3d=force` paraméterrel mégis bekapcsolható.
- A Google Fonts CSS nem blokkolja a renderelést (`display=swap`).
- Éles tárhelyen kapcsold be a gzip/brotli tömörítést (a legtöbb tárhelyen alapból be van kapcsolva) és a hosszú cache-t a `js/chunks/` fájlokra.
- A Lighthouse 100-as pontszámokat headless Chrome-ban mértük, ahol GPU nincs, ezért a 3D kimaradt. Valódi GPU-val a Three.js chunk (~540 KB minifikálva, ~135 KB gzippel) a betöltés után még letöltődik és lefut, ez a TBT-t valamennyire növelheti.

## Licencek

Three.js (MIT), GSAP (ingyenes, a GSAP licenc szerint), Lenis (MIT), JSZip (MIT / GPLv3), esbuild (MIT). A minta-galériaképek generált, absztrakt SVG-k – éles használat előtt cseréld le őket valódi fotókra.
