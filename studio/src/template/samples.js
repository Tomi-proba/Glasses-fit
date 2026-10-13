// Starting points for the configurator. They are ordinary configs: after picking one,
// every text, colour, block and page can be changed. "Kezdj üresen" uses the blank config.
import blank from './site.config.json';
import { newId } from './blocks.js';

const clone = (v) => JSON.parse(JSON.stringify(v));
const block = (type, props) => ({ id: newId(), type, bg: 'default', hidden: false, ...props });
const page = (id, title, blocks, slug = id) => ({ id, title, slug: id === 'home' ? '' : slug, showInNav: true, blocks });
const theme = (o) => ({ ...clone(blank.theme), ...o, colors: { ...blank.theme.colors, ...o.colors } });
const art = (id, file) => `assets/samples/${id}/${file}.svg`;
const galleryItems = (id, caps) => caps.map((caption, i) => ({ src: art(id, `work-${i + 1}`), alt: `Helyőrző kép: ${caption}`, caption }));
const members = (id, list) => list.map(([name, role, bio = ''], i) => ({ photo: art(id, `team-${i + 1}`), name, role, bio }));

const SAMPLE_DEFS = [
  {
    id: 'aura', label: 'Fodrászszalon', style: 'Sötét, neon kék, részecskés 3D',
    config: () => ({
      meta: { title: 'Aura Hair Studio | Prémium fodrászszalon Budapesten', description: 'Precíziós vágás, egyedi festés és luxus hajápolás a belvárosban. Foglalj időpontot online.' },
      brand: { name: 'Aura Hair Studio', activity: 'fodrászszalon', tagline: 'Prémium fodrászat a belváros szívében.', logo: 'assets/logo.svg', logoAlt: 'Aura Hair Studio', ctaText: 'Időpontfoglalás', ctaLink: 'contact' },
      theme: theme({ mode: 'dark', colors: { background: '#070707', text: '#f1f1ef', primary: '#00d4ff', accent: '#00d4ff' }, headingFont: 'Tenor Sans', bodyFont: 'Hanken Grotesk', headingCase: 'upper', radius: 0, shadow: 'none', buttonStyle: 'outline', motion: 'normal' }),
      contact: { address: '1061 Budapest, Példa utca 12.', phone: '+36 1 234 5678', email: 'hello@example.com', hours: [{ days: 'Hétfő-Péntek', time: '9:00-20:00' }, { days: 'Szombat', time: '9:00-15:00' }, { days: 'Vasárnap', time: 'Zárva' }] },
      social: [{ type: 'instagram', url: 'https://instagram.com/' }, { type: 'facebook', url: 'https://facebook.com/' }],
      footer: { text: 'Prémium fodrászat a belváros szívében.', copyright: 'Minden jog fenntartva.' },
      pages: [
        page('home', 'Főoldal', [
          block('hero', { title: 'A hajad. A te történeted.', subtitle: 'Precíziós vágás, egyedi színek és nyugodt, prémium élmény a belváros szívében.', ctaText: 'Időpontfoglalás', ctaLink: 'contact', secondaryText: 'Árak', secondaryLink: 'page:arak', visual: 'particles', image: 'assets/hero/hero-object.webp', imageAlt: 'Olló részecskékből', layout: 'split' }),
          block('imageText', { title: 'Tizenkét év szenvedély, minden tincsben.', body: ['Az Aura Hair Studio 2014-ben azzal a céllal nyílt meg, hogy a szalonélményt újragondolja: kevesebb sietség, több figyelem.', 'Kizárólag professzionális, környezettudatos termékekkel dolgozunk, és minden szolgáltatás előtt konzultálunk veled.'], image: art('aura', 'about'), imageAlt: 'Helyőrző kép: hullámzó tincsek kékben', imageSide: 'left' }),
          block('stats', { title: '', items: [{ value: '2014', suffix: '', label: 'óta a Példa utcában' }, { value: '6', suffix: '', label: 'stylist a csapatban' }, { value: '8400', suffix: '+', label: 'elégedett vendég' }] }),
          block('cards', { title: 'Szolgáltatások', intro: 'Minden kezelés konzultációval indul.', columns: '3', bg: 'muted', items: [
            { icon: 'scissors', title: 'Precíziós vágás', text: 'Arcformához és életstílushoz igazított vágás.' },
            { icon: 'palette', title: 'Festés és balayage', text: 'Természetes átmenetek, kíméletes színek.' },
            { icon: 'droplet', title: 'Mélyápoló kezelés', text: 'Regeneráló rituálék a selymes hajért.' },
          ] }),
          block('gallery', { title: 'Munkáink', layout: 'mosaic', items: galleryItems('aura', ['Karamell balayage', 'Aszimmetrikus bob', 'Platina tónus', 'Alkalmi konty', 'Textúrált fade', 'Vörösréz ragyogás']) }),
          block('testimonials', { title: 'Vendégeink mondták', items: [
            { quote: 'Végre valaki tényleg meghallgatta, mit szeretnék. A balayage még jobb lett, mint amit elképzeltem.', name: 'Kovács Petra', role: 'törzsvendég 2019 óta', rating: 5 },
            { quote: 'Nyugodt, gyönyörű hely, ahol tényleg kikapcsolok. A vágás hetekkel később is tökéletesen áll.', name: 'Nagy Dániel', role: 'férfi vágás', rating: 5 },
          ] }),
          block('ctaBand', { title: 'Foglalj időpontot még ma.', text: 'Írj vagy hívj, 24 órán belül visszajelzünk.', buttonText: 'Időpontfoglalás', buttonLink: 'contact', bg: 'accent' }),
        ]),
        page('arak', 'Árak', [
          block('pricing', { title: 'Árlista', intro: 'Az árak a hajhossztól függően változhatnak.', note: 'Az árak bruttó árak.', items: [
            { name: 'Precíziós vágás', description: 'Mosással és szárítással.', price: '12 900 Ft-tól' },
            { name: 'Festés és balayage', description: 'Konzultációval és ápolással.', price: '24 900 Ft-tól' },
            { name: 'Mélyápoló kezelés', description: 'Keratinos és plex regeneráló rituálé.', price: '9 900 Ft-tól' },
            { name: 'Alkalmi frizura', description: 'Próbafrizurával.', price: '18 900 Ft-tól' },
          ] }),
          block('faq', { title: 'Gyakori kérdések', items: [{ q: 'Mennyi idővel előre foglaljak?', a: 'Hétköznapra általában 3-5 nappal előre, hétvégére egy-két héttel.' }, { q: 'Lemondhatom az időpontot?', a: 'Igen, 24 órával előtte díjmentesen.' }] }),
        ]),
        page('kapcsolat', 'Kapcsolat', [
          block('contactForm', { title: 'Foglalj időpontot', intro: 'Írj nekünk vagy hívj, 24 órán belül visszajelzünk.', showDetails: true, submitText: 'Üzenet küldése', successText: 'Köszönjük, hamarosan jelentkezünk.' }),
          block('map', { title: '', query: '', height: 'normal' }),
        ]),
      ],
    }),
  },
  {
    id: 'rozmaring', label: 'Bisztró', style: 'Világos, smaragd, domborított 3D',
    config: () => ({
      meta: { title: 'Rozmaring Bisztró | Szezonális konyha', description: 'Szezonális, helyi alapanyagokból főzött ebédek és vacsorák. Asztalfoglalás online.' },
      brand: { name: 'Rozmaring Bisztró', activity: 'bisztró és étterem', tagline: 'Szezonális konyha, lassú esték.', logo: '', logoAlt: '', ctaText: 'Asztalfoglalás', ctaLink: 'contact' },
      theme: theme({ mode: 'light', colors: { background: '#f6f5f0', text: '#171614', primary: '#138a5e', accent: '#138a5e' }, headingFont: 'Bodoni Moda', bodyFont: 'Figtree', radius: 14, shadow: 'soft', buttonShape: 'rounded', motion: 'subtle' }),
      contact: { address: '1052 Budapest, Példa köz 4.', phone: '+36 1 555 0101', email: 'asztal@example.com', hours: [{ days: 'Kedd-Szombat', time: '12:00-22:00' }, { days: 'Vasárnap-Hétfő', time: 'Zárva' }] },
      social: [{ type: 'instagram', url: 'https://instagram.com/' }],
      footer: { text: 'Szezonális konyha a Belvárosban.', copyright: 'Minden jog fenntartva.' },
      pages: [
        page('home', 'Főoldal', [
          block('hero', { title: 'Ami ma a piacon a legjobb.', subtitle: 'Hetente változó menü helyi termelők alapanyagaiból, csendes belső udvarral.', ctaText: 'Asztalfoglalás', ctaLink: 'contact', secondaryText: 'Étlap', secondaryLink: 'page:etlap', visual: 'relief', image: 'assets/hero/cooking-pot.webp', imageAlt: 'Fazék, a bisztró jelképe', layout: 'split' }),
          block('imageText', { title: 'Kis konyha, nagy odafigyelés.', body: ['A Rozmaring 2017 óta főz a Belváros egyik csendes udvarában.', 'Minden reggel a piacról indulunk, és az alapján írjuk a napi menüt.'], image: art('rozmaring', 'about'), imageAlt: 'Helyőrző kép: szezonális alapanyagok', imageSide: 'right', bg: 'muted' }),
          block('gallery', { title: 'A konyhából', layout: 'grid', items: galleryItems('rozmaring', ['Őszi tökleves', 'A belső udvar', 'Kóstolómenü', 'Házi kenyér', 'Borválogatás', 'Desszert']) }),
          block('testimonials', { title: 'Vendégeink mondták', items: [{ quote: 'Évek óta ide járunk ebédelni, és még egyszer sem csalódtunk.', name: 'Fehér Anna', role: 'törzsvendég', rating: 5 }] }),
          block('booking', { title: 'Foglalj asztalt', text: 'Hétköznap délben és este is várunk, hétvégére érdemes előre foglalni.', buttonText: 'Asztalfoglalás', buttonLink: 'contact', note: 'Csoportoknak 8 főtől egyedi menü.', bg: 'muted' }),
        ]),
        page('etlap', 'Étlap', [
          block('pricing', { title: 'Ebéd', intro: 'Hétköznap 12 és 15 óra között.', items: [{ name: 'Napi menü', description: 'Leves és főétel.', price: '3 900 Ft' }, { name: 'Vegetáriánus menü', description: 'Teljes értékű, húsmentes fogások.', price: '3 600 Ft' }] }),
          block('pricing', { title: 'Vacsora', intro: '', items: [{ name: 'Kóstolómenü', description: 'Öt fogás, borpárosítással is kérhető.', price: '14 500 Ft' }, { name: 'Séf ajánlata', description: 'Az évszak legjava.', price: '6 900 Ft-tól' }] }),
        ]),
        page('kapcsolat', 'Kapcsolat', [block('contactForm', { title: 'Asztalfoglalás', intro: 'Írd meg, hány főre és mikorra foglalnál.', showDetails: true, submitText: 'Foglalás küldése', successText: 'Köszönjük, hamarosan visszaigazoljuk.' }), block('map', {})]),
      ],
    }),
  },
  {
    id: 'kardos', label: 'Ügyvédi iroda', style: 'Sötét, arany, szögletes',
    config: () => ({
      meta: { title: 'Kardos és Társa Ügyvédi Iroda', description: 'Társasági jog, ingatlanügyletek és szerződések. Első konzultáció online is.' },
      brand: { name: 'Kardos és Társa', activity: 'ügyvédi iroda', tagline: 'Világos tanács, biztos döntés.', logo: '', logoAlt: '', ctaText: 'Konzultáció', ctaLink: 'contact' },
      theme: theme({ mode: 'dark', colors: { background: '#0b0b0d', text: '#efece6', primary: '#e2b04a', accent: '#e2b04a' }, headingFont: 'Italiana', bodyFont: 'Manrope', headingCase: 'upper', radius: 0, shadow: 'none', buttonShape: 'square', buttonStyle: 'outline', motion: 'subtle' }),
      contact: { address: '1054 Budapest, Példa tér 2.', phone: '+36 1 444 2020', email: 'iroda@example.com', hours: [{ days: 'Hétfő-Péntek', time: '8:30-17:30' }] },
      social: [{ type: 'linkedin', url: 'https://linkedin.com/' }],
      footer: { text: 'Üzleti és ingatlanjog Budapesten.', copyright: 'Minden jog fenntartva.' },
      pages: [
        page('home', 'Főoldal', [
          block('hero', { title: 'Jogi biztonság üzleti tempóban.', subtitle: 'Társasági jog, ingatlanügyletek és szerződések vállalkozásoknak és magánszemélyeknek.', ctaText: 'Konzultáció', ctaLink: 'contact', secondaryText: 'Díjak', secondaryLink: 'page:dijak', visual: 'relief', image: 'assets/hero/scales.webp', imageAlt: 'Mérleg', layout: 'split' }),
          block('imageText', { title: 'Huszonkét éve a vállalkozások oldalán.', body: ['Kis csapat vagyunk, ezért minden ügyet irodavezető ügyvéd felügyel.', 'Díjainkat előre, írásban rögzítjük, így nincs meglepetés.'], image: art('kardos', 'about'), imageAlt: 'Helyőrző kép: az iroda', imageSide: 'left', bg: 'muted' }),
          block('cards', { title: 'Szakterületek', intro: '', columns: '2', items: [
            { icon: 'crown', title: 'Társasági jog', text: 'Cégalapítás, módosítás, átalakulás és tulajdonosi megállapodások.' },
            { icon: 'globe', title: 'Ingatlanjog', text: 'Adásvétel, ellenjegyzés, bérleti és fejlesztési szerződések.' },
            { icon: 'pen', title: 'Szerződések', text: 'Szerződések megírása, véleményezése és tárgyalása.' },
            { icon: 'heart', title: 'Családjog', text: 'Házassági vagyonjogi szerződés, válás, öröklés.' },
          ] }),
          block('stats', { title: '', bg: 'muted', items: [{ value: '22', suffix: '', label: 'év gyakorlat' }, { value: '3', suffix: '', label: 'ügyvéd' }, { value: '1200', suffix: '+', label: 'lezárt ügy' }] }),
          block('team', { title: 'Az iroda', intro: '', members: members('kardos', [['dr. Kardos Péter', 'irodavezető ügyvéd', 'Társasági és ingatlanjog.'], ['dr. Simon Eszter', 'ügyvéd', 'Szerződések és családjog.'], ['dr. Bodnár Máté', 'ügyvéd', 'Ingatlanügyletek.']]) }),
          block('ctaBand', { title: 'Beszéljük meg az ügyét.', text: 'Az első, harmincperces konzultáció díja beszámít a megbízásba.', buttonText: 'Konzultáció', buttonLink: 'contact', bg: 'accent' }),
        ]),
        page('dijak', 'Díjak', [
          block('pricing', { title: 'Díjaink', intro: 'Díjainkat előre, írásban rögzítjük.', items: [{ name: 'Konzultáció', description: '30 perc, online vagy személyesen.', price: '18 000 Ft' }, { name: 'Szerződés véleményezése', description: '', price: '45 000 Ft-tól' }, { name: 'Ingatlan adásvétel', description: 'Szerkesztés és ellenjegyzés.', price: 'ügyérték 0,5%-tól' }] }),
          block('faq', { title: 'Gyakori kérdések', items: [{ q: 'Lehet online konzultálni?', a: 'Igen, videóhívásban is.' }] }),
        ]),
        page('kapcsolat', 'Kapcsolat', [block('contactForm', { title: 'Kérjen időpontot', intro: 'Írja le röviden az ügyét, egy munkanapon belül jelentkezünk.', showDetails: true, submitText: 'Üzenet küldése', successText: 'Köszönjük, hamarosan jelentkezünk.' }), block('map', {})]),
      ],
    }),
  },
  {
    id: 'eromuhely', label: 'Edzőstúdió', style: 'Sötét, korall, erős animációk',
    config: () => ({
      meta: { title: 'Erőműhely Edzőstúdió', description: 'Személyi edzés, kiscsoportos erőnléti órák és mozgásfelmérés. Az első alkalom ingyenes.' },
      brand: { name: 'Erőműhely', activity: 'edzőstúdió', tagline: 'Erősebb minden héten.', logo: '', logoAlt: '', ctaText: 'Próbaedzés', ctaLink: 'contact' },
      theme: theme({ mode: 'dark', colors: { background: '#0a0a0a', text: '#f4f2ee', primary: '#ff5d4f', accent: '#ff5d4f' }, headingFont: 'Archivo', bodyFont: 'Jost', headingCase: 'upper', fontScale: 1.05, radius: 6, shadow: 'strong', buttonShape: 'rounded', motion: 'strong' }),
      contact: { address: '1134 Budapest, Példa utca 31.', phone: '+36 30 555 7788', email: 'edzes@example.com', hours: [{ days: 'Hétfő-Péntek', time: '6:30-21:00' }, { days: 'Szombat', time: '8:00-13:00' }] },
      social: [{ type: 'instagram', url: 'https://instagram.com/' }, { type: 'tiktok', url: 'https://tiktok.com/' }],
      footer: { text: 'Személyi edzés és kiscsoportos órák.', copyright: 'Minden jog fenntartva.' },
      pages: [
        page('home', 'Főoldal', [
          block('hero', { title: 'Erő, ami a hétköznapokban is látszik.', subtitle: 'Személyi edzés és nyolcfős kiscsoportok felméréssel és követhető fejlődéssel.', ctaText: 'Ingyenes próbaedzés', ctaLink: 'contact', secondaryText: 'Bérletek', secondaryLink: 'page:berletek', visual: 'particles', image: 'assets/hero/barbell.webp', imageAlt: 'Súlyzórúd', layout: 'split' }),
          block('imageText', { title: 'Nem gépsor, hanem műhely.', body: ['Szabad súlyok, saját tempó és egy edző, aki figyel a technikádra.', 'Minden tag felméréssel kezd, és havonta mérjük a fejlődést.'], image: art('eromuhely', 'about'), imageAlt: 'Helyőrző kép: edzés közben', imageSide: 'right', bg: 'muted' }),
          block('gallery', { title: 'A teremből', layout: 'mosaic', items: galleryItems('eromuhely', ['Szabad súlyok', 'Kiscsoportos óra', 'Mobilitás', 'Felmérés', 'Reggeli edzés', 'Közösség']) }),
          block('stats', { title: '', items: [{ value: '8', suffix: '', label: 'fő egy csoportban' }, { value: '5', suffix: '', label: 'edző' }, { value: '350', suffix: '+', label: 'aktív tag' }] }),
          block('cards', { title: 'Edzések', intro: 'Az első próbaedzés és a felmérés ingyenes.', columns: '4', bg: 'muted', items: [
            { icon: 'star', title: 'Személyi edzés', text: 'Egyéni program és technikai oktatás.' },
            { icon: 'heart', title: 'Kiscsoport', text: 'Nyolcfős erőnléti órák minden szinten.' },
            { icon: 'leaf', title: 'Mobilitás', text: 'Ízületkímélő óra ülőmunkát végzőknek.' },
            { icon: 'sun', title: 'Táplálkozás', text: 'Étrend a célodhoz igazítva.' },
          ] }),
          block('team', { title: 'Edzőink', intro: '', members: members('eromuhely', [['Horváth Bence', 'vezetőedző'], ['Lakatos Nóra', 'mobilitás és jóga'], ['Papp Zoltán', 'erőnléti edző']]) }),
          block('testimonials', { title: 'Tagjaink mondták', items: [{ quote: 'Fél év alatt megszűnt a derékfájásom, és először élvezem a rendszeres edzést.', name: 'Kiss Ádám', role: 'tag 2023 óta', rating: 5 }] }),
          block('booking', { title: 'Gyere el egy próbaedzésre', text: 'Válassz időpontot online, az első alkalom ingyenes.', buttonText: 'Időpontot foglalok', buttonLink: 'contact', note: '', bg: 'accent' }),
        ]),
        page('berletek', 'Bérletek', [
          block('pricing', { title: 'Bérletek', intro: '', items: [{ name: 'Személyi edzés', description: 'Alkalmanként.', price: '12 000 Ft' }, { name: 'Kiscsoportos havibérlet', description: 'Korlátlan óra.', price: '29 000 Ft / hó' }, { name: 'Mobilitás óra', description: '', price: '4 500 Ft' }] }),
          block('faq', { title: 'Kérdések', items: [{ q: 'Kezdőként is jöhetek?', a: 'Igen, minden új tag felméréssel kezd, és a szintjéhez illő csoportba kerül.' }] }),
        ]),
        page('kapcsolat', 'Kapcsolat', [block('contactForm', { title: 'Jelentkezz próbaedzésre', intro: 'Írj, és egyeztetünk egy időpontot.', showDetails: true, submitText: 'Jelentkezés', successText: 'Köszönjük, hamarosan jelentkezünk.' }), block('map', {})]),
      ],
    }),
  },
];

const merged = (overrides) => ({ ...clone(blank), ...overrides, version: 2 });

export const SAMPLES = SAMPLE_DEFS.map((s) => ({ id: s.id, label: s.label, style: s.style, config: merged(s.config()) }));
export const blankConfig = () => clone(blank);
export const defaultConfig = blankConfig;
export const sampleConfig = (id) => clone((SAMPLES.find((s) => s.id === id) || SAMPLES[0]).config);
