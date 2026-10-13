// Example sites generated from the same template: each entry overrides the default config.
// They power the home page gallery and the "start from this sample" option in the configurator.
import base from './site.config.json';

const clone = (v) => JSON.parse(JSON.stringify(v));

function merge(target, patch) {
  for (const [k, v] of Object.entries(patch)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && target[k] && typeof target[k] === 'object') merge(target[k], v);
    else target[k] = v;
  }
  return target;
}

// Placeholder gallery: the bundled abstract artworks with industry-specific captions.
const gallery = (title, captions) => ({
  navLabel: 'Galéria',
  title,
  intro: '',
  items: captions.map((caption, i) => ({ src: `assets/gallery/work-${i + 1}.svg`, alt: `Helyőrző kép: ${caption}`, caption })),
});

const PATCHES = {
  aura: {
    label: 'Fodrászszalon',
    style: 'Sötét, neon kék, részecskés 3D',
    patch: {},
  },
  rozmaring: {
    label: 'Bisztró',
    style: 'Világos, smaragd, domborított 3D',
    patch: {
      meta: { title: 'Rozmaring Bisztró | Szezonális konyha a Belvárosban', description: 'Szezonális, helyi alapanyagokból főzött ebédek és vacsorák. Asztalfoglalás online.' },
      brand: { name: 'Rozmaring Bisztró', shortName: 'Rozmaring', activity: 'bisztró és étterem', tagline: 'Szezonális konyha, lassú esték.', logo: '' },
      theme: { mode: 'light', accent: '#138a5e', headingFont: 'Bodoni Moda', bodyFont: 'Figtree', radius: 12 },
      effect3d: 'relief',
      hero: { title: 'Ami ma a piacon a legjobb.', subtitle: 'Hetente változó menü helyi termelők alapanyagaiból, csendes belső udvarral.', ctaText: 'Asztalfoglalás', secondaryText: 'Étlap', image: 'assets/hero/cooking-pot.webp', imageAlt: 'Fazék, a bisztró jelképe' },
      about: { title: 'Kis konyha, nagy odafigyelés.', paragraphs: ['A Rozmaring 2017 óta főz a Belváros egyik csendes udvarában. Minden reggel a piacról indulunk, és az alapján írjuk a napi menüt.', 'Huszonnégy hely, nyitott konyha, és egy borlap, amelyet magyar kistermelőktől válogattunk.'], stats: [{ value: '2017', suffix: '', label: 'óta nyitva' }, { value: '24', suffix: '', label: 'hely a teremben' }, { value: '40', suffix: '+', label: 'helyi termelő' }] },
      services: { navLabel: 'Étlap', title: 'Ebéd, vacsora, rendezvény', intro: 'A menü hetente változik, a heti ajánlatot az Instagramon is közzétesszük.', items: [
        { icon: 'sun', title: 'Napi ebédmenü', text: 'Leves és főétel hétköznap 12 és 15 óra között.', price: '3 900 Ft' },
        { icon: 'star', title: 'Kóstolómenü', text: 'Öt fogás az évszak legjavából, borpárosítással is kérhető.', price: '14 500 Ft' },
        { icon: 'leaf', title: 'Vegetáriánus menü', text: 'Teljes értékű, húsmentes fogások minden nap.', price: '3 600 Ft' },
        { icon: 'gift', title: 'Zártkörű rendezvény', text: 'Születésnapra, céges vacsorára akár 24 főig.', price: 'egyedi ajánlat' },
      ] },
      testimonials: { title: 'Vendégeink mondták', items: [
        { quote: 'Évek óta ide járunk ebédelni, és még egyszer sem csalódtunk. A kóstolómenü külön élmény.', name: 'Fehér Anna', role: 'törzsvendég', rating: 5 },
        { quote: 'Kedves kiszolgálás, átgondolt borlap, és az udvar nyáron verhetetlen.', name: 'Varga Bence', role: 'vacsora', rating: 5 },
      ] },
      contact: { title: 'Foglalj asztalt', intro: 'Hívj minket, vagy írj, és visszaigazoljuk a foglalást.', address: '1052 Budapest, Példa köz 4.', hours: [{ days: 'Kedd-Szombat', time: '12:00-22:00' }, { days: 'Vasárnap-Hétfő', time: 'Zárva' }], formSubmitText: 'Foglalás küldése' },
      gallery: gallery('A konyhából', ['Őszi tökleves', 'A belső udvar', 'Kóstolómenü', 'Házi kenyér', 'Borválogatás', 'Desszert']),
      footer: { text: 'Szezonális konyha a Belvárosban.' },
    },
  },
  kardos: {
    label: 'Ügyvédi iroda',
    style: 'Sötét, arany, domborított 3D',
    patch: {
      meta: { title: 'Kardos és Társa Ügyvédi Iroda | Üzleti és ingatlanjog', description: 'Társasági jog, ingatlanügyletek és szerződések. Első konzultáció online is.' },
      brand: { name: 'Kardos és Társa Ügyvédi Iroda', shortName: 'Kardos', activity: 'ügyvédi iroda', tagline: 'Világos tanács, biztos döntés.', logo: '' },
      theme: { mode: 'dark', accent: '#e2b04a', headingFont: 'Italiana', bodyFont: 'Manrope', radius: 0 },
      effect3d: 'relief',
      hero: { title: 'Jogi biztonság üzleti tempóban.', subtitle: 'Társasági jog, ingatlanügyletek és szerződések vállalkozásoknak és magánszemélyeknek.', ctaText: 'Konzultáció', secondaryText: 'Szakterületek', image: 'assets/hero/scales.webp', imageAlt: 'Mérleg, az igazságszolgáltatás jelképe' },
      about: { title: 'Huszonkét év a tárgyalóasztal mindkét oldalán.', paragraphs: ['Irodánk kis csapattal, közvetlen partneri kapcsolattal dolgozik. Minden ügyért egy felelős ügyvéd felel az első egyeztetéstől a lezárásig.', 'Díjainkat előre, írásban rögzítjük, így nincs meglepetés a számlán.'], stats: [{ value: '22', suffix: '', label: 'év gyakorlat' }, { value: '3', suffix: '', label: 'ügyvéd' }, { value: '1200', suffix: '+', label: 'lezárt ügy' }] },
      services: { navLabel: 'Szakterületek', title: 'Szakterületek', intro: 'Az első, harmincperces konzultáció díja beszámít a megbízásba.', items: [
        { icon: 'crown', title: 'Társasági jog', text: 'Cégalapítás, módosítás, átalakulás és tulajdonosi megállapodások.', price: 'óradíj 32 000 Ft' },
        { icon: 'leaf', title: 'Ingatlanjog', text: 'Adásvétel, ellenjegyzés, bérleti és fejlesztési szerződések.', price: 'ügyérték 0,5%-tól' },
        { icon: 'star', title: 'Szerződések', text: 'Szerződések megírása, véleményezése és tárgyalása.', price: '45 000 Ft-tól' },
        { icon: 'heart', title: 'Családjog', text: 'Házassági vagyonjogi szerződés, válás, öröklés.', price: 'óradíj 28 000 Ft' },
      ] },
      testimonials: { title: 'Ügyfeleink mondták', items: [
        { quote: 'A cégátalakítás minden lépését előre elmagyarázták, és a határidőket napra pontosan tartották.', name: 'Tóth Gergely', role: 'ügyvezető', rating: 5 },
        { quote: 'Gyors, érthető válaszok, és végig ugyanaz az ügyvéd foglalkozott velünk.', name: 'Molnár Kata', role: 'ingatlanvásárlás', rating: 5 },
      ] },
      contact: { title: 'Kérjen időpontot', intro: 'Írja le röviden az ügyét, egy munkanapon belül jelentkezünk.', address: '1054 Budapest, Példa tér 2.', hours: [{ days: 'Hétfő-Péntek', time: '8:30-17:30' }], formSubmitText: 'Üzenet küldése' },
      gallery: gallery('Az irodáról', ['Tárgyaló', 'Könyvtár', 'Csapatunk', 'Ügyféltér', 'Recepció', 'Irodaház']),
      footer: { text: 'Üzleti és ingatlanjog Budapesten.' },
    },
  },
  eromuhely: {
    label: 'Edzőstúdió',
    style: 'Sötét, korall, részecskés 3D',
    patch: {
      meta: { title: 'Erőműhely | Személyi edzés és kiscsoportos órák', description: 'Személyi edzés, kiscsoportos erőnléti órák és mozgásfelmérés. Első alkalom ingyenes.' },
      brand: { name: 'Erőműhely Edzőstúdió', shortName: 'Erőműhely', activity: 'edzőstúdió', tagline: 'Erősebb minden héten.', logo: '' },
      theme: { mode: 'dark', accent: '#ff5d4f', headingFont: 'Syncopate', bodyFont: 'Jost', radius: 4 },
      effect3d: 'particles',
      hero: { title: 'Erő, ami a mindennapokban is látszik.', subtitle: 'Személyi edzés és nyolcfős kiscsoportok, felméréssel és követhető fejlődéssel.', ctaText: 'Ingyenes próbaedzés', secondaryText: 'Órarend', image: 'assets/hero/barbell.webp', imageAlt: 'Súlyzórúd, az edzőstúdió jelképe' },
      about: { title: 'Kis csoportok, valódi figyelem.', paragraphs: ['Az Erőműhelyben egy órán legfeljebb nyolcan edzenek, így az edző mindenkire figyel. Minden új tag mozgásfelméréssel kezd.', 'Nem bérletet árulunk, hanem tervet: negyedévente mérjük a fejlődést, és ehhez igazítjuk a programot.'], stats: [{ value: '8', suffix: '', label: 'fő egy csoportban' }, { value: '5', suffix: '', label: 'edző' }, { value: '350', suffix: '+', label: 'aktív tag' }] },
      services: { navLabel: 'Edzések', title: 'Edzések és bérletek', intro: 'Az első próbaedzés és a mozgásfelmérés ingyenes.', items: [
        { icon: 'star', title: 'Személyi edzés', text: 'Egyéni program, technikai oktatás, heti egy-három alkalom.', price: '12 000 Ft / alkalom' },
        { icon: 'heart', title: 'Kiscsoportos erőnléti óra', text: 'Nyolcfős csoportok reggel és este, minden szinten.', price: '29 000 Ft / hó' },
        { icon: 'leaf', title: 'Mobilitás és stretching', text: 'Ízületkímélő óra ülőmunkát végzőknek.', price: '4 500 Ft / alkalom' },
        { icon: 'sun', title: 'Táplálkozási tanácsadás', text: 'Étrend a célodhoz és a napirendedhez igazítva.', price: '18 000 Ft' },
      ] },
      testimonials: { title: 'Tagjaink mondták', items: [
        { quote: 'Fél év alatt megszűnt a derékfájásom, és először élvezem a rendszeres edzést.', name: 'Kiss Ádám', role: 'tag 2023 óta', rating: 5 },
        { quote: 'A kis csoport miatt tényleg odafigyelnek a technikára. Nagyon jó a hangulat.', name: 'Balogh Lili', role: 'esti csoport', rating: 5 },
      ] },
      contact: { title: 'Gyere el egy próbaedzésre', intro: 'Írj, és egyeztetünk egy időpontot az ingyenes felméréshez.', address: '1134 Budapest, Példa utca 31.', hours: [{ days: 'Hétfő-Péntek', time: '6:30-21:00' }, { days: 'Szombat', time: '8:00-13:00' }], formSubmitText: 'Jelentkezés' },
      gallery: gallery('Az edzőteremből', ['Erőnléti zóna', 'Kiscsoportos óra', 'Mobilitás', 'Személyi edzés', 'Felmérés', 'Öltöző']),
      footer: { text: 'Személyi edzés és kiscsoportos órák.' },
    },
  },
};

export const SAMPLES = Object.entries(PATCHES).map(([id, s]) => ({
  id,
  label: s.label,
  style: s.style,
  config: merge(clone(base), s.patch),
}));

export const defaultConfig = () => clone(base);
export const sampleConfig = (id) => clone((SAMPLES.find((s) => s.id === id) || SAMPLES[0]).config);
