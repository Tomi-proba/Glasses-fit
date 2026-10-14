# Vonal Stúdió – weboldal-készítő oldal tervezővel és ajánlatkéréssel

Egyetlen Astro projekt, egységes fejléccel, lábléccel és dizájnnal:

| Útvonal | Mi ez |
| --- | --- |
| `/` | A stúdió bemutatása: hero 3D-vel, hogyan működik, mit kapsz, minták, GYIK, kapcsolat |
| `/tervezo` | A tervező: előzetes terv élő előnézettel, a végén „Ajánlatot kérek erre a tervre” |
| `/ajanlatkeres` | Ajánlatkérő űrlap, a tervezőből a terv automatikusan csatolódik |
| `/koszonjuk` | Az elküldött ajánlatkérés utáni oldal |
| `/aszf`, `/adatvedelem` | Helyőrző jogi oldalak |
| `/sablon/elonezet` | A termék (ügyfél-sablon) előnézete, ezt tölti be a tervező |
| `/sablon/minta/<id>/…` | A tervező négy kiinduló mintája, minden aloldalukkal |
| `/peldak/ingatlan-premium`, `/peldak/ingatlan-alap` | Aurum Ingatlan példaoldal, Prémium 3D és Alap változatban |
| `/peldak/jatekterem-premium`, `/peldak/jatekterem-alap` | Pixel Pont Játékterem példaoldal, Prémium 3D és Alap változatban |

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
- Ugyanez a projekt később szerveroldali végpontokat is kap (Claude API szövegjavaslat, ajánlatkérés küldése), csak egy tárhely-adapter kell hozzá.

## Mappaszerkezet

```
studio/
├── src/config/business.ts      ← a stúdió neve, elérhetősége
├── src/config/pricing.json     ← CSOMAGOK ÉS ÁRAK (Alap, Prémium 3D, „-tól” árak)
├── src/layouts/Layout.astro    ← közös fejléc, lábléc, SEO, Lenis + GSAP
├── src/layouts/TemplatePage.astro ← a termék egy oldalának renderelése
├── src/pages/                  ← útvonalak (lásd fent), sitemap.xml, robots.txt
├── src/examples/               ← A PÉLDAOLDALAK (Aurum Ingatlan, Pixel Pont Játékterem)
│   ├── aurum/                  ← tartalom, oldal, stílus, szűrő és galéria, ld.ts (strukturált adat)
│   ├── arcade/                 ← Pixel Pont: tartalom, Prémium (berepülés + játékmenü), Alap, warp.js (fénycsíkok), sound.js
│   ├── motion-premium.js       ← Prémium: Lenis, GSAP reveal, számlálók, parallax, 3D döntés
│   ├── motion-basic.js         ← Alap: egyszerű beúszás
│   └── photos.json             ← a fotók helyei (alt szöveg, arány, forrás, fotós)
├── src/lib/
│   ├── configurator.js         ← a tervező
│   ├── store.js                ← mentés a böngészőbe (terv, csomag, ajánlatkérő piszkozat)
│   ├── seo.ts                  ← JSON-LD segédek, INDEX_EXAMPLES kapcsoló
│   ├── quote.js                ← validateQuote(), buildQuoteRequest(), sendQuoteRequest(): IDE KERÜL az e-mail-küldés
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
├── scripts/export-site.mjs     ← önálló weboldal exportja egy configból
├── scripts/example-photos.mjs  ← példaoldal-fotók letöltése (WebP) és a CREDITS.md megírása
└── scripts/example-shots.mjs   ← a „Munkáink” képernyőképei a példaoldalakról
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

A bemenet lehet egy site config, vagy a teljes ajánlatkérés JSON-je (ekkor a `design`-t használja). A kimenet:
- oldalanként egy `index.html`: a főoldal a gyökérben, az aloldalak a `/<slug>/` mappákban, relatív linkekkel;
- minifikált CSS és JS (a Three.js külön, lazy-loaded chunk);
- a feltöltött képek fájlként kibontva (`assets/uploads/`);
- `sitemap.xml`, `robots.txt` és `site.config.json`.

A mappa bármilyen statikus tárhelyre feltölthető. Élesítés előtt állítsd be a `meta.siteUrl`-t a végleges domainre.

## Üzleti modell: ajánlatkérés (nincs online fizetés)

A látogató a tervezőben ötletet kap és megmutatja, milyen oldalt szeretne; a végleges oldalt a stúdió készíti el.

- **Csomagok és árak:** `src/config/pricing.json`. Itt módosítható a név, a „-tól” ár (`priceFrom`), a leírás és a lista; a főoldal csomag-összehasonlítója, a tervező csomagválasztója és az ajánlatkérő is ebből olvas. Az árak alanyi adómentesek, nincs ÁFA, és nincs havidíj.
- **Tervező:** az első lépésben választható a csomag. Alapnál a 3D lehetőségek „Prémium” jelölést kapnak és nem választhatók (a nyitókép álló képként jelenik meg). Csak a fő beállítások maradtak: téma, színek, betűtípusok, 3D be/ki, oldalak, blokkok és sorrendjük, szövegek, képek, elérhetőségek.
- **Ajánlatkérés (`/ajanlatkeres`):** a tervező végéről (`?terv=1`, a terv csatolva, a csomag és az aloldalak száma előtöltve) vagy közvetlenül (`?csomag=alap|premium`). Validáció mezőnként, honeypot mező és minimális kitöltési idő a spam ellen, a félkész űrlap a böngészőben megmarad.
- **Küldés:** `buildQuoteRequest()` egy JSON-be gyűjti az űrlapot és a tervet (`design`, 2-es verziójú site config). A `sendQuoteRequest()` most csak helyben ment egy összefoglalót a /koszonjuk oldalnak; a függvényben jól jelölt helyen van a Formspree és a Resend / saját backend bekötésének vázlata. API-kulcs csak szerveren lehet.

## Szöveg javaslat (Claude API, később)

A tervező „Szöveg javaslat” gombja most egyszerű sablonszöveget ad (`src/lib/ai-copy.js`). Élesítéshez:
1. Kell egy szerveroldali végpont: `src/pages/api/szoveg-javaslat.ts`, Astro adapterrel.
2. Ez hívja az Anthropic API-t a cégnévvel, a tevékenységgel és a szlogennel.
3. Az `AI_COPY_ENABLED` értékét `true`-ra kell állítani.

Az API-kulcs csak a szerveren lehet.

## Példaoldalak (/peldak/…)

Két kitalált cég, mindkettő mindkét csomagban, ugyanazzal a tartalommal. A példaoldalakon nincs kódból rajzolt 3D: csak valódi fotók és videók.

- **Prémium:**
  - **Görgetés-vezérelt videó a heróban:** képkocka-sorozat canvasra rajzolva, a GSAP ScrollTrigger rögzíti (pin) a szekciót. Lefelé görgetve előre, felfelé visszafelé halad.
  - **Betöltés:** a képkockák a háttérben töltődnek (előbb minden nyolcadik), közben vékony folyamatjelző látszik. Az oldalt nem tartja vissza: addig az első képkocka áll a helyén.
  - **Szövegrétegek:** görgetésre jelennek meg és tűnnek el.
  - **Fotók:** lassú zoom, parallax, maszkolt felfedés.
  - **Aurum Ingatlan:** a hero a megrendelő saját videója (a ház felé közelít, belép az ajtón, a nappaliba érkezik).
  - **Pixel Pont Játékterem:** nincs videó. A nyitókép a megrendelő saját (AI-generált) játékgépfotója, a képernyőjén villogó pixeles felirat. Kattintásra, Enterre, Space-re vagy görgetésre a kamera berepül a képernyőbe neon fénycsíkok között (Three.js, asztali gépen bloom), a végén villanás, és a képernyő lesz az oldal: retró játékmenü (Gépeink, Árak és zsetonok, Szülinapi bulik, Nyitvatartás, Hol vagyunk, High score, Kapcsolat), nyilakkal és Enterrel is kezelhető. A pixeles hangok alapból némák. Csökkentett mozgásnál rögtön a menü jelenik meg.
- **Alap:** ugyanaz a tartalom görgetés-vezérelt videó, GSAP és Lenis nélkül, fotós nyitóképpel és egyszerű beúszással.
- **Mindegyiken:** lebegő „Ez egy mintaoldal” sáv. Az „Ilyet szeretnék” gomb az ajánlatkérőre visz, előre kiválasztott csomaggal. Csökkentett mozgásnál nincs animáció, a videó helyén az utolsó képkocka látszik.

### Videók

```bash
npm run video-frames -- aurum-walk video.mp4 --desktop 144 --mobile 84 --provider "Saját felvétel" --note "…"
npm run video-frames -- <név> video.mp4 --start 1 --end 9 --provider Pexels --page <URL> --author "Név"
```

A szkript:
- WebP képkockákat készít asztali (legfeljebb 1600 px széles) és mobil (9:16-os, középre vágott) méretben;
- a kis felbontású forrást nem nagyítja fel, hanem enyhén élesíti;
- elkészíti az első és az utolsó képkockát állóképnek;
- kitölti a `src/examples/sequences.json`-t, és frissíti a `CREDITS.md`-t.

Asztali nézetben a `grain` beállítás finom sötét szélt és filmszemcsét ad a videóhoz. Külső videó csak Pexelsről vagy Pixabayről származhat.

### Fotók

Csak Unsplash vagy Pexels kép használható. A helyük a `src/examples/photos.json`-ben van; amíg egy kép nincs letöltve, a helyén „Fotó helye” keret látszik.

1. Minden helyhez töltsd ki a `source` mezőt: `provider`, `page`, `download` (közvetlen kép URL), `author`, `authorUrl`.
2. `npm run example-photos`: letölti, WebP-be alakítja (640/1280 vagy 960/1600/2400 px), és megírja a `CREDITS.md`-t.
3. `npm run build && npm run preview`, majd egy másik terminálban `npm run example-shots`: frissíti a főoldal képernyőképeit (Playwright kell hozzá).

## Keresőoptimalizálás (Google és AI-keresők)

### Ami a kódban kész

- **Minden fontos adat valódi HTML-szöveg**, nem canvasban, képen vagy csak kattintás után betöltve: cégnév, cím, telefon, e-mail, nyitvatartás, árak, szolgáltatások, GYIK.
  - Pixel Pont Prémium: a játékmenü minden „képernyője” benne van a HTML-ben. Animáció közben a menü rétege rejtett, a nem aktív képernyők `hidden`-ek, mint egy füles felületen. Ez ugyanaz a tartalom, amit a látogató a menüben lát, nem rejtett kulcsszó, így megfelel a Google irányelveinek.
  - Aurum: az ingatlanok teljes leírása a HTML-ben van (rejtett `<article>`), a felugró ablak ebből készít másolatot. Korábban `<template>`-ben volt, azt a keresők nem olvassák.
  - Görgetés-vezérelt videó alatt is valódi `<h1>` és szöveg van, a canvas csak a kép.
- **Strukturált adat (schema.org, JSON-LD):**
  - Főoldal: `ProfessionalService` a csomagokkal és a „-tól” árakkal (`OfferCatalog`), plus `FAQPage`.
  - Aurum: `RealEstateAgent` címmel, koordinátával, nyitvatartással, munkatársakkal, az eladó ingatlanokkal (`Offer` + `SingleFamilyResidence`/`Apartment`, alapterület, szobaszám), plus `FAQPage`.
  - Pixel Pont: `EntertainmentBusiness` címmel, koordinátával, nyitvatartással (`OpeningHoursSpecification`), zseton- és szülinapi árakkal (`OfferCatalog`), akadálymentességgel, plus `FAQPage`.
  - Az adatok ugyanabból a `content.ts`-ből jönnek, amiből az oldal, ezért nem csúsznak el egymástól (`src/examples/*/ld.ts`, `src/lib/seo.ts`).
- **Oldalanként egyedi** `<title>`, meta description, kanonikus URL, Open Graph és Twitter kártya. A megosztási képek mérete 1200×630 (`public/images/og/`, az `npm run example-shots` újragenerálja).
- **`sitemap.xml`**, **`robots.txt`** és **`llms.txt`**. A robots.txt név szerint is engedi az AI-keresők robotjait (GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended stb.), csak a tervező belső előnézeti oldalait és a köszönőoldalt zárja ki. Az `llms.txt` rövid, sima szöveges összefoglaló az AI-asszisztenseknek (csomagok, árak, oldalak).
- **GYIK-szekció** mindhárom oldalon (főoldal, Aurum, Pixel Pont), a valószínű kérdésekkel.

### A példaoldalak indexelése

A két példacég kitalált, a címük és a telefonszámuk sem valódi. Ha a Google vagy egy AI-kereső indexelné őket, valódi embereket küldhetne egy nem létező játékterembe. Ezért élesben `noindex`-esek, és kimaradnak a sitemapből. A SEO-beállításuk ettől még teljes.

Ügyféloldalnál (vagy a mérés kedvéért) így kapcsolható be az indexelés:

```bash
INDEX_EXAMPLES=1 BASE_PATH=/Glasses-fit/ npm run build
```

### Amit az ügyfélnek kell beállítania

A kód csak a felét adja. Ezek nélkül a helyi keresésben (térkép, „játékterem a közelben”) nem fog megjelenni:

1. **Saját domain.** A `robots.txt`-t és a `sitemap.xml`-t a keresők csak a domain gyökeréből olvassák (`https://pelda.hu/robots.txt`). GitHub Pages alútvonalon (`/Glasses-fit/`) ezek nem a gyökérben vannak, saját domainnel igen. A buildhez: `SITE_URL=https://pelda.hu BASE_PATH=/`.
2. **Google Cégprofil** (business.google.com):
   - Cégnév, cím és telefonszám betűre ugyanúgy, mint az oldalon és a JSON-LD-ben.
   - Kategória (pl. „Játékterem”, „Ingatlaniroda”), nyitvatartás (ünnepnapokkal), fotók, weboldal-link.
   - Ellenőrzés (képeslap, telefon vagy videó). Ez hozza a térképes és helyi találatokat, és a Gemini is innen veszi a helyi adatokat.
3. **Google Search Console** (search.google.com/search-console):
   - Tartomány-tulajdon hozzáadása DNS TXT rekorddal, a `sitemap.xml` beküldése.
   - Az „URL-ellenőrzés” eszközzel a fő oldalak indexelésének kérése.
   - Az „Bővített találatok” jelentés figyelése (strukturált adat hibák).
4. **Bing Webmaster Tools** (bing.com/webmasters): a ChatGPT keresője és a Copilot a Bing indexére épül. A Search Console-ból egy kattintással importálható, plusz IndexNow.
5. **Apple Business Connect** (Apple Térkép, Siri) és **Facebook/Instagram oldal**: ugyanazokkal az adatokkal. Ha megvan, a profil linkjei kerüljenek a `business.ts` `social` listájába, ezek bekerülnek a `sameAs` mezőbe.
6. **Vélemények:** a Cégprofilban kérjen értékelést az ügyfeleitől, és válaszoljon rájuk. A helyi rangsorolásban ez az egyik legerősebb jel. Az oldalon lévő véleményekhez ne tegyünk `Review`/`AggregateRating` jelölést, mert a Google saját oldalon gyűjtött értékeléseknél nem ad ilyen találatot, és félrevezetőnek minősítheti.
7. **Ha változik valami** (ár, nyitvatartás, cím): a `content.ts`-ben kell átírni, az oldal és a strukturált adat együtt frissül. A Cégprofilban külön is át kell írni.
8. **Ellenőrzés élesítés után:** Google Rich Results Test (search.google.com/test/rich-results) és Schema Markup Validator (validator.schema.org).

Megjegyzés: a Google 2023 óta csak kormányzati és egészségügyi oldalaknál mutat GYIK-bővített találatot. A `FAQPage` jelölés ettől még hasznos: az AI-keresők (Gemini, ChatGPT, Perplexity) és a Bing kérdés-válasz párként olvassák.

## Akadálymentesség és teljesítmény

- Látható fókusz, skip link, ARIA címkék, alt szövegek, kontrasztos színek.
- A `prefers-reduced-motion` és a „Nincs” animáció-beállítás kikapcsolja a mozgást és a 3D-t (ilyenkor az álló kép látszik).
- 3D csak hardveres WebGL-en fut, mobilon könnyítve. Hibakereséshez: `?3d=force`.
- Lighthouse 13.5 (headless Chrome, helyi `astro preview`, `/Glasses-fit/` alútvonal, `INDEX_EXAMPLES=1` build), teljesítmény / akadálymentesség / bevált gyakorlatok / SEO, 2026-10-14:

  | Oldal | Mobil | Asztali | LCP (mobil) |
  | --- | --- | --- | --- |
  | Főoldal | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1,0 s |
  | Tervező | 99 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 2,0 s |
  | Ajánlatkérés | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1,0 s |
  | Aurum Prémium | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1,8 s |
  | Aurum Alap | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1,3 s |
  | Pixel Pont Prémium | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1,7 s |
  | Pixel Pont Alap | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 1,2 s |

  Az alapértelmezett (noindex-es) buildben a minták SEO-pontja 66: egyetlen hibás pont van, hogy az oldal nem indexelhető, és ez szándékos.
- Ami a teljesítményhez kellett: a görgetés-vezérelt videó képkockái csak az oldal és a betűk betöltése után kezdenek letöltődni, és a töltőképernyő már nem tartja vissza az oldalt (vékony folyamatjelző lett belőle). A példaoldalak betűtípus-CSS-e nem blokkolja a megjelenést, a Pixel Pont nyitóképe előtöltődik.
