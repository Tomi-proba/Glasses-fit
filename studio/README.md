# Vonal Stúdió – weboldal-készítő oldal beépített tervezővel

Egyetlen Astro projekt, egységes fejléccel, lábléccel és dizájnnal:

| Útvonal | Mi ez |
| --- | --- |
| `/` | A stúdió bemutatása: hero 3D-vel, hogyan működik, mit kapsz, minták, GYIK, kapcsolat |
| `/tervezo` | A tervező: bal oldalon a beállítások, jobb oldalon a sablon élő előnézete |
| `/osszegzes` | Összegzés, nagy előnézet, megrendelő űrlap, „Megvásárlás – 250 000 Ft” |
| `/koszonjuk` | Sikeres megrendelés utáni oldal |
| `/aszf`, `/adatvedelem` | Helyőrző jogi oldalak |
| `/sablon/elonezet` | A termék (ügyfél-sablon) előnézete, ezt tölti be a tervező |
| `/sablon/minta/<id>/…` | A négy minta weboldal, minden aloldalukkal |

## Indítás

```bash
cd studio
npm install
npm run dev          # http://localhost:4321
npm run build        # dist/
npm run preview      # a buildelt oldal kiszolgálása
```

GitHub Pages-re a `.github/workflows/deploy-pages.yml` buildel, `BASE_PATH=/Glasses-fit/` beállítással.

## Miért Astro?

- Valódi, statikusan előrenderelt útvonalak (gyors, SEO-barát), közös layouttal. A navigáció oldalak között CSS View Transitions-szel finom.
- Alapból nem küld JavaScriptet; csak a 3D, a tervező és az animációk töltődnek be ott, ahol kellenek (Lighthouse 97-100).
- Ugyanez a projekt később szerveroldali végpontokat is kap (Claude API szövegjavaslat, fizetés, rendelés-küldés), csak egy tárhely-adapter kell hozzá.

## Mappaszerkezet

```
studio/
├── src/config/business.ts      ← a stúdió neve, elérhetősége, ÁRA (pricing.amount)
├── src/layouts/Layout.astro    ← közös fejléc, lábléc, SEO, Lenis + GSAP
├── src/layouts/TemplatePage.astro ← a termék egy oldalának renderelése
├── src/pages/                  ← útvonalak (lásd fent), sitemap.xml, robots.txt
├── src/components/Hero3D.astro ← a főoldal 3D eleme
├── src/lib/
│   ├── configurator.js         ← a tervező
│   ├── store.js                ← mentés a böngészőbe (terv, ügyféladatok, utolsó rendelés)
│   ├── payment.js              ← startPayment(): IDE KERÜL a Stripe/Barion
│   ├── order.js                ← buildOrder(), validateOrder(), submitOrder(): IDE KERÜL az e-mail/adatbázis
│   └── ai-copy.js              ← suggestCopy(): IDE KERÜL a Claude API (szerveren keresztül)
├── src/template/               ← AZ ÜGYFÉL-SABLON (a termék)
│   ├── blocks.js               ← a 16 blokktípus leírása (mezők, alapértékek)
│   ├── render.js               ← config → HTML (oldalak, blokkok, téma, menü)
│   ├── template.css            ← a sablon stílusa, csak CSS változókból
│   ├── runtime.js              ← animációk, 3D, karusszel, videó, űrlap, előnézet-híd
│   ├── hero3d.js               ← képből készülő Three.js 3D
│   ├── site.config.json        ← üres kiindulás („Kezdj üresen”)
│   ├── samples.js              ← minták („Kezdj egy mintával”)
│   └── standalone.html         ← oldalsablon az exporthoz
├── public/template/assets/     ← a sablon képei (3D forrásképek, galéria, logó)
└── scripts/export-site.mjs     ← önálló weboldal exportja egy configból
```

## A termék: blokkalapú ügyfél-sablon

A sablon egy **site config** objektumból épül (2-es verzió):

```jsonc
{
  "version": 2,
  "meta":    { "title", "description", "siteUrl", "ogImage", "lang" },
  "brand":   { "name", "activity" /* szabad szöveg */, "tagline", "logo", "ctaText", "ctaLink" },
  "theme": {
    "mode": "dark|light",
    "colors": { "primary", "accent", "background", "text" },
    "headingFont", "bodyFont", "headingCase": "normal|upper",
    "fontScale": 0.85-1.25, "radius": 0-32, "shadow": "none|soft|strong",
    "spacing": "compact|normal|airy", "buttonShape": "pill|rounded|square",
    "buttonStyle": "solid|outline", "motion": "none|subtle|normal|strong"
  },
  "contact": { "address", "phone", "email", "hours": [...] },
  "social": [...], "footer": { "text", "copyright" },
  "pages": [
    { "id": "home", "title": "Főoldal", "slug": "", "showInNav": true,
      "blocks": [ { "id", "type": "hero", "bg": "default|muted|accent", "hidden": false, ...mezők } ] }
  ]
}
```

- **Nincs kötött cégtípus:** a tevékenység szabad szöveg. A minták csak kiindulópontok, utána minden módosítható.
- **Blokkok (16 típus, mindegyik többször is):** nyitókép (3D), szöveg, kép és szöveg, szolgáltatások/kártyák, árlista, galéria, vélemények, csapat, GYIK, számlálók, időpontfoglalás-gomb, videó (YouTube/Vimeo, kattintásra töltődik), térkép, kapcsolat űrlap, CTA sáv, szabad szöveg (HTML nélküli, egyszerű formázással: `##`, `**`, `*`, `[link](url)`, `- lista`).
- **Aloldalak:** tetszőleges számú oldal, a menü automatikusan frissül. A linkmezők célja lehet egy oldal (`page:<id>`), a kapcsolat űrlap (`contact`) vagy egyedi link.
- **Színek** CSS változókként (`--primary`, `--accent`, `--bg`, `--text` és ezekből számolt felület, vonal, halvány szöveg). A kontrasztot automatikusan biztosítja (WCAG AA).

### Új blokktípus hozzáadása

1. `src/template/blocks.js`: új bejegyzés a `BLOCK_TYPES`-ba (`label`, `icon`, `defaults()`, `fields`) és a `BLOCK_ORDER`-be.
2. `src/template/render.js`: renderelő függvény az `R` objektumba ugyanazzal a kulccsal.
3. `src/template/template.css`: stílus `.block-<típus>` alatt.

A tervező a `fields` leírásból automatikusan elkészíti a szerkesztő űrlapot.

## Export: önálló, élesíthető weboldal

```bash
npm run export-site -- rendeles.json [kimeneti-mappa]
```

A bemenet lehet egy site config, vagy a teljes rendelés JSON-je (ekkor a `siteConfig`-ot használja). A kimenet:
- oldalanként egy `index.html`: a főoldal a gyökérben, az aloldalak a `/<slug>/` mappákban, relatív linkekkel;
- minifikált CSS és JS (a Three.js külön, lazy-loaded chunk);
- a feltöltött képek fájlként kibontva (`assets/uploads/`);
- `sitemap.xml`, `robots.txt` és `site.config.json`.

A mappa bármilyen statikus tárhelyre feltölthető. Élesítés előtt állítsd be a `meta.siteUrl`-t a végleges domainre.

## Vásárlás (előkészítve, fizetés nélkül)

- **Ár:** `src/config/business.ts` → `pricing.amount` (250 000 Ft, alanyi adómentes, a `taxNote` szöveggel).
- **Folyamat:** `/osszegzes` → `validateOrder()` → `buildOrder()` (config + ügyfél + számlázás + elfogadások egy JSON-ben) → `startPayment()` (most helyőrző ablak) → `submitOrder()` (most csak helyben menti a rendelés összefoglalóját) → `/koszonjuk`.
- **Bekötés később:** a jól jelölt blokkok a `payment.js`-ben (Stripe Checkout / Barion vázlattal) és az `order.js`-ben (e-mail vagy adatbázis). Az árat mindig a szerver vegye a saját konfigurációjából, a böngészőtől kapottban nem szabad megbízni.

## Szöveg javaslat (Claude API, később)

A tervező „Szöveg javaslat” gombja most egyszerű sablonszöveget ad (`src/lib/ai-copy.js`). Élesítéshez:
1. Kell egy szerveroldali végpont: `src/pages/api/szoveg-javaslat.ts`, Astro adapterrel.
2. Ez hívja az Anthropic API-t a cégnévvel, a tevékenységgel és a szlogennel.
3. Az `AI_COPY_ENABLED` értékét `true`-ra kell állítani.

Az API-kulcs csak a szerveren lehet.

## Akadálymentesség és teljesítmény

- Látható fókusz, skip link, ARIA címkék, alt szövegek, kontrasztos színek.
- A `prefers-reduced-motion` és a „Nincs” animáció-beállítás kikapcsolja a mozgást és a 3D-t (ilyenkor az álló kép látszik).
- 3D csak hardveres WebGL-en fut, mobilon könnyítve. Hibakereséshez: `?3d=force`.
- Lighthouse (headless Chrome, `/Glasses-fit/` alútvonal, gzippel), teljesítmény / akadálymentesség / bevált gyakorlatok / SEO:
  - Főoldal: mobilon 99/100/100/100, asztalin 100/100/100/100.
  - Tervező: mobilon 97/100/100/100, asztalin 100/100/100/100.
  - A minták SEO-pontja azért alacsonyabb, mert szándékosan `noindex`-esek.
