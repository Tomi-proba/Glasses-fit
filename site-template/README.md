# Prémium bemutatkozó weboldal-sablon + élő konfigurátor

Konfigurációvezérelt, egyoldalas céges weboldal-sablon (minta: **Aura Hair Studio**, fodrászszalon, neon kék kiemelő szín) és egy hozzá tartozó **élő konfigurátor**, amellyel az ügyfél lépésről lépésre testreszabhatja a saját oldalát, majd letöltheti kész, feltölthető weboldalként.

- **3D hero egy képből** Three.js-szel. Az ügyfél képéből (`hero.image`) részecskefelhő épül, amely betöltéskor összeáll, lassan forog, követi az egeret, és szétnyílik a mutató körül. A másik lehetőség egy domborított felület. Mobilon könnyített, a betöltés után, lazy módon töltődik be, és ha a 3D nem fut, az álló kép látszik.
- **GSAP + ScrollTrigger** görgetési animációk és parallax, **Lenis** sima görgetés.
- Dizájn: Bugatti-ihletésű, visszafogott luxus (fekete vászon, ritkított nagybetűs Tenor Sans címek, Hanken Grotesk szöveg, Martian Mono csak árakhoz, időkhöz és számokhoz, vékony vonalak, kerek gombok).
- Mikro-interakciók: alulról kitöltődő gombok, árlista-sorok kiemelő vonallal, finom kép-nagyítás a galériában, vélemény-karusszel.
- Sötét / világos téma, CSS változókra épülő színek, Google Fonts betűtípusok.
- SEO: meta tagek, Open Graph / Twitter kártya, `LocalBusiness` JSON-LD, `sitemap.xml`, `robots.txt`, előrenderelt HTML.
- Akadálymentesség: skip link, ARIA címkék, alt szövegek, látható fókusz, automatikusan kontrasztos kiemelő szín, `prefers-reduced-motion` támogatás (ilyenkor nincs 3D, nincs sima görgetés, és nincsenek animációk).
- Lighthouse (headless Chrome, helyi szerver gzippel): **99-100 / 100 / 100 / 100** mobilon és asztalin.

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
│       ├── hero3d.js       ← képből készülő Three.js 3D (külön, lazy-loaded chunk)
│       ├── icons.js        ← generált Phosphor ikonok (scripts/gen-icons.mjs)
│       └── configurator.js
└── scripts/build.mjs       ← esbuild bundle + előrenderelés + sitemap/robots + dev szerver
```

## Testreszabás új ügyfélre

### A) Konfigurátorral (ajánlott, fejlesztő nélkül is)

1. Nyisd meg a `configurator.html`-t (`npm run dev`, vagy a buildelt `dist/` bármilyen statikus tárhelyen).
2. Menj végig a 7 lépésen: **Alapadatok → Megjelenés → Szekciók → Szövegek → Képek → Elérhetőség → Összegzés**. Alul a folyamatjelző mutatja, hol tartasz („Lépés 3 / 7”), és a Vissza gombbal visszaléphetsz.
   Bal oldalon a beállítások, jobb oldalon az élő előnézet (asztali / tablet / mobil nézet). Mobilon alul válthatsz a beállítások és az előnézet között.
3. Minden változás azonnal megjelenik az előnézetben, és automatikusan mentődik a böngészőbe (localStorage).
4. Export (az Összegzés lépésben):
   - **Weboldal letöltése (.zip)**, ha az `allowZipExport` be van kapcsolva – kész, feltölthető statikus oldal: előrenderelt `index.html`, minifikált JS/CSS, a feltöltött képek külön fájlként (`assets/uploads/`), `sitemap.xml`, `robots.txt`, `site.config.json`.
   - **JSON letöltése / betöltése** – a `site.config.json`, amit később vissza lehet tölteni, vagy a fejlesztő a repóba tehet.

> A ZIP export a buildelt fájlokat csomagolja, ezért a konfigurátort a `dist/`-ből (vagy `npm run dev`-vel) kell futtatni, nem közvetlenül az `src/`-ből.

### B) Kézzel, a config fájlban

1. Másold le a `site-template` mappát (vagy hozz létre egy új configot, és buildeld azzal: `node scripts/build.mjs --config ugyfelek/bella.json`).
2. Szerkeszd a `site.config.json`-t (lásd lent), a képeket tedd a `public/assets/` alá.
3. `npm run build` → a `dist/` mappa tartalmát töltsd fel a tárhelyre.
4. **Fontos:** állítsd be a `meta.siteUrl`-t a végleges domainre (canonical URL, OG-kép, sitemap).

## Vásárlás (előkészítve, fizetés nélkül)

A konfigurátor utolsó lépése az **Összegzés**: a választott beállítások áttekintése, „Módosítás” gombokkal az egyes lépésekhez, és a **Megvásárlás – 250 000 Ft** gomb. A gomb egy megrendelő ablakot nyit (kapcsolattartó, számlázási adatok magánszemélynek vagy cégnek adószámmal, ÁSZF és adatkezelés elfogadása), majd egy helyőrző fizetési képernyőt. Kártyaterhelés nem történik.

| Fájl | Szerepe |
| --- | --- |
| `public/checkout.config.json` | **Ár** (`price`), pénznem, termék neve, `provider`, ÁSZF és adatkezelési URL, `allowZipExport`. Újrabuildelés nélkül módosítható. |
| `src/js/payment.js` | Különálló fizetési modul: `loadCheckoutConfig()`, `buildOrderPayload()`, `validateOrder()` és `startPayment()` |

**Ide kerül a valódi integráció:** a `startPayment(order, checkout)` függvény jól jelölt `PAYMENT PROVIDER INTEGRATION POINT` blokkja, Stripe és Barion vázlattal. A függvény `{ status: 'redirect', url }` értéket ad vissza, ilyenkor a konfigurátor átirányít a fizetési oldalra. A `provider` értéke a `checkout.config.json`-ből jön.

A vásárláskor elküldendő JSON-t a `buildOrderPayload()` állítja össze:

```jsonc
{
  "schemaVersion": 1,
  "orderId": "WEB-20261013-XXXX",
  "createdAt": "…",
  "product": { "sku": "premium-website", "name": "…", "price": 250000, "currency": "HUF" },
  "customer": { "name": "…", "email": "…", "phone": "…" },
  "billing": { "type": "person|company", "name": "…", "taxNumber": "…", "country": "HU", "zip": "…", "city": "…", "address": "…" },
  "consents": { "terms": true, "privacy": true, "marketing": false, "acceptedAt": "…" },
  "note": "…",
  "siteConfig": { /* a teljes site.config.json */ }
}
```

A helyőrző képernyőn ez a JSON megtekinthető és letölthető. **Fontos:** éles fizetésnél az árat a szervernek kell a saját konfigurációjából venni (a `product.sku` alapján), a böngészőből érkező árban nem szabad megbízni.

Mivel az oldal fizetős termék, a „kész weboldal ZIP” letöltés alapból ki van kapcsolva (`allowZipExport: false`). Átadáskor vagy belső használatra `true`-ra állítva megjelenik az Összegzés lépésben.

## `site.config.json` felépítése

| Kulcs | Leírás |
| --- | --- |
| `meta` | `lang`, `siteUrl`, `title`, `description`, `keywords`, `ogImage` – SEO és megosztás |
| `brand` | `name`, `shortName` (menüben), `tagline`, `logo` (üresen hagyva a név kezdőbetűje jelenik meg), `logoAlt` |
| `theme` | `mode`: `"dark"` / `"light"`, `accent`: hex szín, `headingFont` / `bodyFont` (lásd `FONTS` a `render.js`-ben: címsor- és szövegbetűk külön listában), `radius` (a képek és a térkép sarka, px; a gombok mindig kerekek) |
| `effect3d` | `"particles"` (részecskék), `"relief"` (domborított) vagy `"none"` (álló kép) |
| `sections.order` | A szekciók sorrendje: `hero`, `about`, `services`, `gallery`, `testimonials`, `contact` |
| `sections.enabled` | Szekciónként `true` / `false` – ki-be kapcsolás |
| `hero` | `title`, `subtitle`, `ctaText`, `ctaLink`, `secondaryText`, `secondaryLink`, `image` (a 3D forrásképe), `imageAlt` |
| `about` | `title`, `paragraphs[]`, `image`, `imageAlt`, `stats[]` (`value`, `suffix`, `label`) |
| `services` | `title`, `intro`, `items[]` (`icon`, `title`, `text`, `price`) – ikonok (Phosphor): `scissors, palette, droplet, sparkles, crown, flower, heart, star, leaf, sun, gift, dryer` |
| `gallery` | `title`, `intro`, `items[]` (`src`, `alt`, `caption`) |
| `testimonials` | `title`, `items[]` (`quote`, `name`, `role`, `rating` 0–5) |
| `contact` | `address`, `phone`, `email`, `hours[]`, `mapQuery` (Google Térkép keresés), `formEndpoint`, űrlap-szövegek |
| `social[]` | `type` (`instagram, facebook, tiktok, youtube, linkedin, x`) + `url` |
| `footer` | `text`, `copyright` |

Minden szekciónak van `navLabel` (menüfelirat) mezője. Kis feliratok a címek fölött szándékosan nincsenek, a cím önmagában hordozza az üzenetet.

### Színek és téma

A `render.js` a configból CSS változókat generál (`--accent`, `--accent-rgb`, `--accent-ink`, `--on-accent`, `--bg`, `--surface`, `--text`, `--muted`, `--border`, `--font-heading`, `--font-body`, `--radius`). A `site.css` kizárólag ezeket használja.
- `--on-accent`: a kiemelő színű gombok szövegszíne – automatikusan fekete vagy fehér, amelyik jobban olvasható.
- `--accent-ink`: a kiemelő szín szövegként használt változata; ha a választott szín nem elég kontrasztos a háttérrel (pl. neon kék világos témán), automatikusan sötétítjük / világosítjuk, amíg el nem éri a WCAG AA 4.5:1 arányt.

### Kapcsolati űrlap

- Ha a `contact.formEndpoint` meg van adva (pl. [Formspree](https://formspree.io) `https://formspree.io/f/xxxx`), az űrlap AJAX-szal oda küld.
- Ha üres, az űrlap a látogató e-mail kliensét nyitja meg a kitöltött üzenettel (`mailto:`).
- Beépített honeypot mező véd az egyszerű spam botok ellen.

### A 3D elem képből

A `hero3d.js` a képből számol mélységet, AI-modell vagy külső szolgáltatás nélkül:
1. Kiválasztja a tárgyat: az átlátszó pixeleket, vagy ha nincs átlátszóság, a sarkok színétől eltérő részeket.
2. A maszkot elmosva lekerekített „térfogatot” kap, ehhez keveri a kép világosságát.
3. Ebből lesz a részecskék mélysége, vagy a domborított felület magassága.

Legjobb forráskép: egy jól körülhatárolt tárgy vagy logó, átlátszó vagy egyszínű háttéren. A konfigurátorban feltöltött képet a böngésző kicsinyíti és WebP-be menti.

Ha valódi 3D modell (.glb) kell, ingyenes online eszközzel (például Microsoft TRELLIS vagy Tencent Hunyuan3D-2 a Hugging Face-en) képből előállítható. A beépítéséhez egy `GLTFLoader`-es effektet kell felvenni a `FACTORIES` listába.

Új effekt: a `hero3d.js`-ben írj egy `makeXxx(ctx, map)` függvényt, amely `{ object, material, geometry }` objektumot ad vissza, vedd fel a `FACTORIES`-be és a `render.js` `EFFECTS` listájába.

## Teljesítmény

- Az oldal előrenderelt HTML, a 3D-t pedig a `load` esemény után, üresjáratban tölti be a böngésző, így nem lassítja az első megjelenítést.
- Mobilon kevesebb részecske / poligon, alacsonyabb pixelarány és nincs egérkövetés; a renderelés szünetel, ha a hero nem látható vagy a fül a háttérben van.
- Szoftveres WebGL-en (GPU nélküli gépen) a 3D kimarad, és az álló kép látszik. Hibakereséshez a `?3d=force` paraméterrel mégis bekapcsolható.
- A Google Fonts CSS nem blokkolja a renderelést (`display=swap`).
- Éles tárhelyen kapcsold be a gzip/brotli tömörítést (a legtöbb tárhelyen alapból be van kapcsolva) és a hosszú cache-t a `js/chunks/` fájlokra.
- A Lighthouse 100-as pontszámokat headless Chrome-ban mértük, ahol GPU nincs, ezért a 3D kimaradt. Valódi GPU-val a Three.js chunk (~540 KB minifikálva, ~135 KB gzippel) a betöltés után még letöltődik és lefut, ez a TBT-t valamennyire növelheti.

## Licencek

Three.js (MIT), GSAP (ingyenes, a GSAP licenc szerint), Lenis (MIT), JSZip (MIT / GPLv3), esbuild (MIT). A minta-galériaképek generált, absztrakt SVG-k – éles használat előtt cseréld le őket valódi fotókra.

## Fejlesztői eszközök a repóban

| Eszköz | Hol | Mire |
| --- | --- | --- |
| Taste skill | `.claude/skills/taste-skill` | dizájnszabályok a generikus „AI-külső” ellen |
| Impeccable | `.claude/skills/impeccable` | dizájnszabályok és automatikus ellenőrző: `sh .claude/skills/impeccable/scripts/impeccable detect --json site-template/dist/index.html` |
| Playwright CLI | `npm i -g @playwright/cli@0.1.22`, skill: `.claude/skills/playwright-cli`, beállítás: `.playwright/cli.config.json` | screenshotok asztali és mobil nézetben |
| Phosphor ikonok | `npm run icons` | a használt ikonok újragenerálása `src/js/icons.js`-be |
