// Block catalogue: one declarative definition per block type.
// The renderer uses `defaults()` to fill missing props; the configurator builds its editor
// forms from `fields`, so a new block type only needs an entry here plus a renderer.
//
// Field types: text, textarea, paragraphs, markdown, image, select, link, toggle, number, icon, list.

const uid = () => Math.random().toString(36).slice(2, 9);
export const newId = uid;

const SECTION = [
  { key: 'title', label: 'Cím', type: 'text' },
  { key: 'intro', label: 'Bevezető', type: 'textarea', rows: 2 },
];
const STYLE = [
  { key: 'bg', label: 'Háttér', type: 'select', options: [['default', 'Alap'], ['muted', 'Tónusos'], ['accent', 'Kiemelő szín']] },
  { key: 'hidden', label: 'Elrejtve az oldalon', type: 'toggle' },
];

export const ICON_CHOICES = ['scissors', 'palette', 'droplet', 'sparkles', 'crown', 'flower', 'heart', 'star', 'leaf', 'sun', 'gift', 'dryer', 'calendar', 'clock', 'pin', 'phone', 'mail', 'check', 'rocket', 'globe', 'gauge', 'headset', 'lock', 'pen', 'devices', 'eye'];

export const BLOCK_TYPES = {
  hero: {
    label: 'Nyitókép', icon: 'sparkles', hint: 'Nagy cím, szlogen, gombok és 3D elem',
    defaults: () => ({ title: 'A címed ide kerül.', subtitle: 'Egy-két mondat arról, miben vagy a legjobb.', ctaText: 'Kapcsolat', ctaLink: '', secondaryText: '', secondaryLink: '', visual: 'particles', image: 'assets/hero/hero-object.webp', imageAlt: '', layout: 'split' }),
    fields: [
      { key: 'title', label: 'Főcím', type: 'textarea', rows: 2, hint: 'Rövid, 6-8 szó.' },
      { key: 'subtitle', label: 'Alcím', type: 'textarea', rows: 2 },
      { key: 'ctaText', label: 'Fő gomb szövege', type: 'text' },
      { key: 'ctaLink', label: 'Fő gomb célja', type: 'link' },
      { key: 'secondaryText', label: 'Második gomb szövege', type: 'text', hint: 'Üresen hagyva nem jelenik meg.' },
      { key: 'secondaryLink', label: 'Második gomb célja', type: 'link' },
      { key: 'visual', label: 'Látvány', type: 'select', options: [['particles', '3D: részecskékből kirajzolódó kép'], ['relief', '3D: domborított kép'], ['image', 'Álló kép'], ['none', 'Nincs kép']] },
      { key: 'image', label: 'Kép (ebből készül a 3D elem)', type: 'image', alt: 'imageAlt', alpha: true, maxSize: 900, hint: 'Jól körülhatárolt tárgy vagy logó, átlátszó vagy egyszínű háttéren.' },
      { key: 'layout', label: 'Elrendezés', type: 'select', options: [['split', 'Szöveg balra, kép jobbra'], ['center', 'Középre igazított szöveg']] },
    ],
  },
  text: {
    label: 'Szöveg', icon: 'pen', hint: 'Cím és bekezdések',
    defaults: () => ({ title: 'Rólunk', body: ['Írd ide a bemutatkozó szöveget.'], align: 'left' }),
    fields: [
      { key: 'title', label: 'Cím', type: 'text' },
      { key: 'body', label: 'Szöveg', type: 'paragraphs', rows: 6, hint: 'A bekezdéseket üres sorral válaszd el.' },
      { key: 'align', label: 'Igazítás', type: 'select', options: [['left', 'Balra'], ['center', 'Középre']] },
    ],
  },
  imageText: {
    label: 'Kép és szöveg', icon: 'layout', hint: 'Kép az egyik oldalon, szöveg a másikon',
    defaults: () => ({ title: 'Egy jó kép mindent elmond.', body: ['Mutasd meg a helyet, a csapatot vagy a munkádat, és írj mellé pár mondatot.'], image: 'assets/gallery/about.svg', imageAlt: '', imageSide: 'left', ctaText: '', ctaLink: '' }),
    fields: [
      { key: 'title', label: 'Cím', type: 'text' },
      { key: 'body', label: 'Szöveg', type: 'paragraphs', rows: 5 },
      { key: 'image', label: 'Kép', type: 'image', alt: 'imageAlt' },
      { key: 'imageSide', label: 'Kép helye', type: 'select', options: [['left', 'Balra'], ['right', 'Jobbra']] },
      { key: 'ctaText', label: 'Gomb szövege', type: 'text', hint: 'Üresen hagyva nincs gomb.' },
      { key: 'ctaLink', label: 'Gomb célja', type: 'link' },
    ],
  },
  cards: {
    label: 'Szolgáltatások / kártyák', icon: 'devices', hint: 'Ikon, cím és rövid leírás csoportban',
    defaults: () => ({ title: 'Szolgáltatások', intro: '', columns: '3', items: [
      { icon: 'star', title: 'Első szolgáltatás', text: 'Rövid leírás.' },
      { icon: 'heart', title: 'Második szolgáltatás', text: 'Rövid leírás.' },
      { icon: 'leaf', title: 'Harmadik szolgáltatás', text: 'Rövid leírás.' },
    ] }),
    fields: [...SECTION,
      { key: 'columns', label: 'Oszlopok', type: 'select', options: [['2', '2'], ['3', '3'], ['4', '4']] },
      { key: 'items', label: 'Kártyák', type: 'list', itemLabel: 'title', newItem: () => ({ icon: 'star', title: 'Új kártya', text: 'Rövid leírás.' }), fields: [
        { key: 'icon', label: 'Ikon', type: 'icon' }, { key: 'title', label: 'Cím', type: 'text' }, { key: 'text', label: 'Leírás', type: 'textarea', rows: 2 },
      ] }],
  },
  pricing: {
    label: 'Árlista', icon: 'cart', hint: 'Tételek leírással és árral',
    defaults: () => ({ title: 'Árak', intro: '', note: '', items: [
      { name: 'Első tétel', description: 'Rövid leírás.', price: '10 000 Ft' },
      { name: 'Második tétel', description: 'Rövid leírás.', price: '15 000 Ft' },
    ] }),
    fields: [...SECTION,
      { key: 'items', label: 'Tételek', type: 'list', itemLabel: 'name', newItem: () => ({ name: 'Új tétel', description: '', price: '' }), fields: [
        { key: 'name', label: 'Megnevezés', type: 'text' }, { key: 'description', label: 'Leírás', type: 'textarea', rows: 2 }, { key: 'price', label: 'Ár', type: 'text' },
      ] },
      { key: 'note', label: 'Megjegyzés az árlista alatt', type: 'text' }],
  },
  gallery: {
    label: 'Galéria', icon: 'eye', hint: 'Képek mozaikban vagy rácsban',
    defaults: () => ({ title: 'Galéria', intro: '', layout: 'mosaic', items: [1, 2, 3, 4, 5, 6].map((n) => ({ src: `assets/gallery/work-${n}.svg`, alt: 'Helyőrző kép', caption: '' })) }),
    fields: [...SECTION,
      { key: 'layout', label: 'Elrendezés', type: 'select', options: [['mosaic', 'Mozaik'], ['grid', 'Egyenletes rács']] },
      { key: 'items', label: 'Képek', type: 'list', itemLabel: 'caption', newItem: () => ({ src: '', alt: '', caption: '' }), fields: [
        { key: 'src', label: 'Kép', type: 'image', alt: 'alt' }, { key: 'caption', label: 'Képaláírás', type: 'text' },
      ] }],
  },
  testimonials: {
    label: 'Vélemények', icon: 'star', hint: 'Ügyfélvélemények csillagokkal',
    defaults: () => ({ title: 'Ügyfeleink mondták', items: [{ quote: 'Gyors, pontos és nagyon kedves csapat. Csak ajánlani tudom.', name: 'Ügyfél neve', role: '', rating: 5 }] }),
    fields: [{ key: 'title', label: 'Cím', type: 'text' },
      { key: 'items', label: 'Vélemények', type: 'list', itemLabel: 'name', newItem: () => ({ quote: '', name: 'Új vélemény', role: '', rating: 5 }), fields: [
        { key: 'quote', label: 'Vélemény', type: 'textarea', rows: 3 }, { key: 'name', label: 'Név', type: 'text' }, { key: 'role', label: 'Megjegyzés', type: 'text' },
        { key: 'rating', label: 'Értékelés', type: 'select', number: true, options: [[5, '5 csillag'], [4, '4 csillag'], [3, '3 csillag'], [0, 'Nincs']] },
      ] }],
  },
  team: {
    label: 'Csapat', icon: 'headset', hint: 'Munkatársak fotóval és szereppel',
    defaults: () => ({ title: 'A csapat', intro: '', members: [{ photo: '', name: 'Munkatárs neve', role: 'Szerepkör', bio: '' }, { photo: '', name: 'Munkatárs neve', role: 'Szerepkör', bio: '' }] }),
    fields: [...SECTION,
      { key: 'members', label: 'Munkatársak', type: 'list', itemLabel: 'name', newItem: () => ({ photo: '', name: 'Új munkatárs', role: '', bio: '' }), fields: [
        { key: 'photo', label: 'Fotó', type: 'image', maxSize: 800 }, { key: 'name', label: 'Név', type: 'text' }, { key: 'role', label: 'Szerepkör', type: 'text' }, { key: 'bio', label: 'Rövid bemutatkozás', type: 'textarea', rows: 2 },
      ] }],
  },
  faq: {
    label: 'GYIK', icon: 'plus', hint: 'Lenyitható kérdések és válaszok',
    defaults: () => ({ title: 'Gyakori kérdések', items: [{ q: 'Hogyan foglalhatok időpontot?', a: 'Telefonon, e-mailben vagy a kapcsolati űrlapon.' }] }),
    fields: [{ key: 'title', label: 'Cím', type: 'text' },
      { key: 'items', label: 'Kérdések', type: 'list', itemLabel: 'q', newItem: () => ({ q: 'Új kérdés?', a: '' }), fields: [
        { key: 'q', label: 'Kérdés', type: 'text' }, { key: 'a', label: 'Válasz', type: 'textarea', rows: 3 },
      ] }],
  },
  stats: {
    label: 'Számlálók', icon: 'gauge', hint: 'Kiemelt számok, görgetéskor felpörögnek',
    defaults: () => ({ title: '', items: [{ value: '10', suffix: '+', label: 'év tapasztalat' }, { value: '500', suffix: '+', label: 'elégedett ügyfél' }, { value: '5', suffix: '', label: 'munkatárs' }] }),
    fields: [{ key: 'title', label: 'Cím (nem kötelező)', type: 'text' },
      { key: 'items', label: 'Számok', type: 'list', itemLabel: 'label', newItem: () => ({ value: '1', suffix: '', label: 'új adat' }), fields: [
        { key: 'value', label: 'Szám', type: 'text' }, { key: 'suffix', label: 'Utótag', type: 'text' }, { key: 'label', label: 'Felirat', type: 'text' },
      ] }],
  },
  booking: {
    label: 'Időpontfoglalás', icon: 'calendar', hint: 'Kiemelt foglalás gomb (külső rendszer vagy telefon)',
    defaults: () => ({ title: 'Foglalj időpontot', text: 'Válassz időpontot online, vagy hívj minket.', buttonText: 'Időpontfoglalás', buttonLink: '', note: '' }),
    fields: [
      { key: 'title', label: 'Cím', type: 'text' }, { key: 'text', label: 'Szöveg', type: 'textarea', rows: 2 },
      { key: 'buttonText', label: 'Gomb szövege', type: 'text' },
      { key: 'buttonLink', label: 'Gomb célja', type: 'link', hint: 'Például a foglalási rendszered linkje (Calendly, Booksy, Salonic) vagy tel:+36...' },
      { key: 'note', label: 'Apró szöveg a gomb alatt', type: 'text' },
    ],
  },
  video: {
    label: 'Videó', icon: 'rocket', hint: 'YouTube vagy Vimeo videó, kattintásra töltődik be',
    defaults: () => ({ title: '', url: '', caption: '' }),
    fields: [
      { key: 'title', label: 'Cím (nem kötelező)', type: 'text' },
      { key: 'url', label: 'Videó linkje', type: 'text', hint: 'YouTube vagy Vimeo link. A videó csak kattintásra töltődik be, így nem lassítja az oldalt.' },
      { key: 'caption', label: 'Képaláírás', type: 'text' },
    ],
  },
  map: {
    label: 'Térkép', icon: 'pin', hint: 'Beágyazott Google Térkép',
    defaults: () => ({ title: '', query: '', height: 'normal' }),
    fields: [
      { key: 'title', label: 'Cím (nem kötelező)', type: 'text' },
      { key: 'query', label: 'Keresett cím', type: 'text', hint: 'Üresen hagyva az Elérhetőségeknél megadott címet mutatja.' },
      { key: 'height', label: 'Magasság', type: 'select', options: [['compact', 'Alacsony'], ['normal', 'Közepes'], ['tall', 'Magas']] },
    ],
  },
  contactForm: {
    label: 'Kapcsolat űrlap', icon: 'mail', hint: 'Űrlap és elérhetőségek',
    defaults: () => ({ title: 'Írj nekünk', intro: 'Egy munkanapon belül válaszolunk.', showDetails: true, submitText: 'Üzenet küldése', successText: 'Köszönjük, megkaptuk az üzenetedet.', endpoint: '' }),
    fields: [...SECTION,
      { key: 'showDetails', label: 'Elérhetőségek és nyitvatartás mutatása', type: 'toggle' },
      { key: 'submitText', label: 'Küldés gomb', type: 'text' },
      { key: 'successText', label: 'Sikeres küldés üzenete', type: 'text' },
      { key: 'endpoint', label: 'Űrlap fogadó címe (nem kötelező)', type: 'text', hint: 'Például Formspree. Üresen hagyva az űrlap a látogató levelezőprogramját nyitja meg.' }],
  },
  ctaBand: {
    label: 'CTA sáv', icon: 'next', hint: 'Feltűnő sáv egy felhívással és gombbal',
    defaults: () => ({ title: 'Készen állsz?', text: 'Foglalj időpontot még ma.', buttonText: 'Kapcsolat', buttonLink: '', bg: 'accent' }),
    fields: [
      { key: 'title', label: 'Cím', type: 'text' }, { key: 'text', label: 'Szöveg', type: 'textarea', rows: 2 },
      { key: 'buttonText', label: 'Gomb szövege', type: 'text' }, { key: 'buttonLink', label: 'Gomb célja', type: 'link' },
    ],
  },
  freeText: {
    label: 'Szabad szöveg', icon: 'pen', hint: 'Formázott szöveg: **félkövér**, *dőlt*, listák, linkek',
    defaults: () => ({ body: '## Alcím\n\nIde bármit írhatsz. **Félkövér**, *dőlt* és [link](https://example.com) is használható.\n\n- első pont\n- második pont' }),
    fields: [{ key: 'body', label: 'Szöveg', type: 'markdown', rows: 10, hint: '## alcím, **félkövér**, *dőlt*, [szöveg](https://link), - listaelem. HTML nem használható.' }],
  },
};

// Every block also gets the shared style fields.
for (const def of Object.values(BLOCK_TYPES)) def.fields = [...def.fields, ...STYLE];

export const BLOCK_ORDER = ['hero', 'text', 'imageText', 'cards', 'pricing', 'gallery', 'testimonials', 'team', 'faq', 'stats', 'booking', 'video', 'map', 'contactForm', 'ctaBand', 'freeText'];

export function createBlock(type) {
  return { id: uid(), type, bg: 'default', hidden: false, ...BLOCK_TYPES[type].defaults() };
}

/** Block props with defaults filled in for anything a saved config is missing. */
export function withDefaults(block) {
  const def = BLOCK_TYPES[block.type];
  return def ? { bg: 'default', hidden: false, ...def.defaults(), ...block } : block;
}

export function duplicateBlock(block) {
  return { ...structuredClone(block), id: uid() };
}

export function slugify(text) {
  return String(text || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'oldal';
}
