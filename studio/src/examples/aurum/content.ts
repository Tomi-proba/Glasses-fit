// Aurum Ingatlan: a fictional luxury real estate agency. Shared by the Prémium and the Alap example.

export const brand = {
  name: 'Aurum Ingatlan',
  tagline: 'Ingatlaniroda Budán és a Balaton-felvidéken.',
  description: 'Eladó otthonok Budán és a Balaton-felvidéken. Évente negyven megbízás, mindegyik személyesen bejárva. Értékbecslés két munkanapon belül.',
  phone: '+36 1 555 0142',
  email: 'iroda@aurum-ingatlan.example',
  address: '1126 Budapest, Kiss János altábornagy utca 27.',
  hours: 'Hétfő-péntek 9:00-18:00, szombaton előzetes egyeztetéssel',
  // Map centre (Budapest XII., Hegyvidék) for the OpenStreetMap embed.
  map: { lat: 47.4939, lon: 19.0157 },
};

export const stats = [
  { value: 18, suffix: '', label: 'év a prémium piacon' },
  { value: 640, suffix: '+', label: 'eladott ingatlan' },
  { value: 41, suffix: ' nap', label: 'átlagos értékesítési idő' },
  { value: 4.9, suffix: '', label: 'ügyfélértékelés, 5-ből', decimals: 1 },
];

export type PropertyType = 'Villa' | 'Penthouse' | 'Lakás' | 'Családi ház';
export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  location: string;
  price: number; // HUF
  rooms: number;
  area: number; // m²
  lot?: number; // m²
  baths: number;
  badge?: string;
  summary: string;
  description: string[];
  features: string[];
  photos: string[]; // photo slots
}

export const properties: Property[] = [
  {
    id: 'szepvolgy', title: 'Panorámás villa a Szépvölgyben', type: 'Villa', location: 'Budapest II., Szépvölgy',
    price: 489_000_000, rooms: 6, area: 412, lot: 1450, baths: 4, badge: 'Új a kínálatban',
    summary: 'Négyszintes, déli fekvésű villa medencével és zavartalan kilátással a városra.',
    description: [
      'A 2021-ben épült villa a Szépvölgy egyik legcsendesebb utcájában áll, mégis tíz perc alatt elérhető a belváros. A nappali és az étkező egyetlen, hat méter belmagasságú térben nyílik a teraszra és a medencére.',
      'A felső szinten négy hálószoba, mindegyik saját fürdővel. A szuterénben wellness-részleg szaunával, borospince és háromállásos garázs kapott helyet.',
    ],
    features: ['Fűtött sókristályos medence', 'Szauna és gőzkabin', 'Háromállásos garázs', 'Okosotthon-rendszer', 'Napelemes rendszer, A++ energetika'],
    photos: ['aurum/p1-1', 'aurum/p1-2', 'aurum/p1-3'],
  },
  {
    id: 'duna-penthouse', title: 'Penthouse a Duna fölött', type: 'Penthouse', location: 'Budapest V., Belváros',
    price: 265_000_000, rooms: 4, area: 186, baths: 2, badge: 'Exkluzív',
    summary: 'Kétszintes penthouse 120 m²-es tetőterasszal és közvetlen panorámával a Lánchídra.',
    description: [
      'A 2019-ben teljes körűen felújított, liftes palotaház legfelső két szintjén. A tetőteraszról a Lánchíd, a Budai Vár és a Parlament is látszik.',
      'Padlófűtés, hűtés minden helyiségben, egyedi tervezésű konyha olasz gépekkel. Az épülethez két teremgarázs-hely tartozik.',
    ],
    features: ['120 m²-es tetőterasz', 'Panoráma a Lánchídra', 'Két teremgarázs-hely', 'Recepciós szolgálat', 'Padlófűtés és hűtés'],
    photos: ['aurum/p2-1', 'aurum/p2-2', 'aurum/p2-3'],
  },
  {
    id: 'fured', title: 'Mediterrán ház Balatonfüreden', type: 'Családi ház', location: 'Balatonfüred, Tamás-hegy',
    price: 219_000_000, rooms: 5, area: 248, lot: 1020, baths: 3,
    summary: 'Napfényes, mediterrán hangulatú ház érett kerttel és panorámával a tóra.',
    description: [
      'A Tamás-hegy déli lejtőjén álló ház minden szobájából látszik a Balaton. A nagy, fedett terasz nyári nappaliként használható, a kert levendulával és olajfákkal beültetett.',
      'Az ingatlan állandó lakhatásra és nyaralónak is kiváló, a part gyalog tizenöt perc.',
    ],
    features: ['Panoráma a Balatonra', 'Fedett terasz kemencével', 'Automata öntözőrendszer', 'Dupla garázs', 'Hőszivattyús fűtés'],
    photos: ['aurum/p3-1', 'aurum/p3-2', 'aurum/p3-3'],
  },
  {
    id: 'andrassy', title: 'Polgári lakás az Andrássy úton', type: 'Lakás', location: 'Budapest VI., Terézváros',
    price: 159_000_000, rooms: 4, area: 142, baths: 2,
    summary: 'Gondosan felújított, 3,8 méter belmagasságú lakás eredeti stukkókkal és parkettával.',
    description: [
      'A műemléki védettségű bérpalota második emeletén lévő lakást úgy újították fel, hogy minden eredeti részlete megmaradt: a stukkók, a kazettás ajtók és a halszálkás parketta.',
      'Az utcafronti szalonból az Andrássy út fáira látni, a hálószobák csendes, zöld belső udvarra néznek.',
    ],
    features: ['3,8 m belmagasság', 'Eredeti stukkók és parketta', 'Felújított lift', 'Belső udvari hálószobák', 'Tároló a pincében'],
    photos: ['aurum/p4-1', 'aurum/p4-2', 'aurum/p4-3'],
  },
  {
    id: 'budakeszi', title: 'Modern ikerház Budakeszin', type: 'Családi ház', location: 'Budakeszi, Erdőalja',
    price: 138_000_000, rooms: 5, area: 176, lot: 540, baths: 2,
    summary: 'Új építésű, kulcsrakész ikerházfél az erdő szélén, saját kerttel.',
    description: [
      'A 2024-ben átadott ikerház az erdő határán áll, mégis öt percre van az iskoláktól és a bevásárlástól. A földszinti nappali teljes szélességében nyílik a kertre.',
      'Hőszivattyú, padlófűtés, hővisszanyerős szellőztetés: a rezsi egy hasonló méretű panellakásénál is alacsonyabb.',
    ],
    features: ['Kulcsrakész átadás', 'Hővisszanyerős szellőztetés', 'Saját kert és terasz', 'Két beálló', 'Erdőre néző hálószobák'],
    photos: ['aurum/p5-1', 'aurum/p5-2', 'aurum/p5-3'],
  },
  {
    id: 'tihany', title: 'Borvidéki birtok Tihanyban', type: 'Villa', location: 'Tihany, Belső-tó',
    price: 395_000_000, rooms: 7, area: 320, lot: 4800, baths: 4, badge: 'Ritkaság',
    summary: 'Felújított kőház saját szőlővel, borospincével és kilátással a Belső-tóra.',
    description: [
      'A 19. századi présházból kialakított birtok a félsziget legszebb részén fekszik. A kőfalak és a gerendák megmaradtak, a gépészet és a nyílászárók teljesen újak.',
      'A 3000 m²-es szőlőben olaszrizling és pinot noir terem, a boltíves pince húsz hordónak ad helyet. Vendégházként vagy családi birtokként is működtethető.',
    ],
    features: ['3000 m² saját szőlő', 'Boltíves borospince', 'Különálló vendégház', 'Kilátás a Belső-tóra', 'Felújított 19. századi kőház'],
    photos: ['aurum/p6-1', 'aurum/p6-2', 'aurum/p6-3'],
  },
];

export const services = [
  { text: 'Értékbecslés két munkanapon belül, írásban.' },
  { text: 'Fotó, drónfelvétel és videós bejárás minden megbízáshoz.' },
  { text: 'Ha nem szeretnéd nyilvánosan hirdetni, csak ellenőrzött vevőknek mutatjuk meg.' },
  { text: 'Az ügyvédet és a hitelszakértőt is mi szervezzük.' },
];

export const agents = [
  { name: 'dr. Varga Eszter', role: 'alapító, ügyvezető', area: 'Budai villák, befektetés', phone: '+36 30 555 0110', photo: 'aurum/agent-1' },
  { name: 'Kiss-Halmi Bence', role: 'senior tanácsadó', area: 'Belváros, penthouse-ok', phone: '+36 30 555 0124', photo: 'aurum/agent-2' },
  { name: 'Tóth Lilla', role: 'tanácsadó', area: 'Balaton-felvidék, birtokok', phone: '+36 30 555 0137', photo: 'aurum/agent-3' },
];

export const testimonials = [
  { quote: 'Hat hét alatt eladták a házunkat, ráadásul a kért ár felett. Eszter minden lépésnél pontosan elmondta, mi következik.', name: 'Molnár Gábor és Kati', role: 'eladók, Budapest II.' },
  { quote: 'Külföldről vásároltunk, egyszer sem kellett hazautaznunk a bejárásokig. A 3D bejárás és a videóhívások mindent megmutattak.', name: 'Szabó Réka', role: 'vevő, Balatonfüred' },
  { quote: 'Nem akartuk, hogy a szomszédok tudjanak az eladásról. Az off-market értékesítés pontosan így működött.', name: 'dr. Halász Péter', role: 'eladó, Budapest XII.' },
];

export const FILTERS = {
  type: ['Villa', 'Penthouse', 'Lakás', 'Családi ház'] as PropertyType[],
  price: [[150_000_000, '150 M Ft-ig'], [250_000_000, '250 M Ft-ig'], [400_000_000, '400 M Ft-ig']] as [number, string][],
  rooms: [3, 4, 5, 6],
};

export const formatHuf = (n: number) => `${new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 }).format(Math.round(n / 1_000_000))} M Ft`;

export const openingRows: [string, string][] = [
  ['Hétfő', '09:00-18:00'], ['Kedd', '09:00-18:00'], ['Szerda', '09:00-18:00'], ['Csütörtök', '09:00-18:00'], ['Péntek', '09:00-18:00'],
];

// The questions sellers and buyers ask first (also written as FAQPage structured data).
export const faq: [string, string][] = [
  ['Mennyibe kerül az értékbecslés?', 'Semmibe, és nem kötelez megbízásra. Bejárjuk az ingatlant, és két munkanapon belül írásban elküldjük a becsült piaci árat, összehasonlító eladásokkal.'],
  ['Mekkora a jutalék?', 'A vételár 2,5%-a, ÁFA-val együtt. Csak sikeres eladás után kell fizetni, a fotózás, a videó és a hirdetések ára benne van.'],
  ['Mennyi idő alatt adják el az ingatlant?', 'Az elmúlt két évben átlagosan 41 nap telt el a megbízástól az adásvételi szerződésig.'],
  ['Meg lehet hirdetés nélkül is eladni?', 'Igen. Ha nem szeretnéd, hogy nyilvános legyen, csak ellenőrzött vevőknek mutatjuk meg (off-market értékesítés).'],
  ['Milyen környéken dolgoznak?', 'Budán, főleg a II., XI. és XII. kerületben, a Belvárosban, Budakeszin és a Balaton-felvidéken, Balatonfüredtől Tihanyig.'],
  ['Segítenek az ügyvédben és a hitelben?', 'Igen. Az adásvételt ingatlanjogász ügyvéd készíti, a vevőknek független hitelszakértőt ajánlunk. Mindkettőt mi szervezzük.'],
];
