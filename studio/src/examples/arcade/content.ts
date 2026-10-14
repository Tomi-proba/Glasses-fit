// Pixel Pont Játékterem: a fictional arcade in Budapest. Shared by the Prémium and the Alap example.
// Machine names are made up on purpose: no real game titles or brands.

export const brand = {
  name: 'Pixel Pont',
  full: 'Pixel Pont Játékterem',
  slogan: 'Negyven gép, egy zseton kétszáz forint.',
  description: 'Játékterem Budapesten, a Nagy Diófa utcában: negyven régi és új játékgép, flipperek, léghoki, szülinapi bulik 8-30 főre.',
  phone: '+36 1 555 0187',
  email: 'jatek@pixelpont.example',
  address: '1072 Budapest, Nagy Diófa utca 9.',
  addressShort: 'Nagy Diófa u. 9.',
  transit: [
    ['Metró', 'M2 Blaha Lujza tér, 5 perc gyalog'],
    ['Villamos', '4-es, 6-os, Király utca megálló, 4 perc'],
    ['Autó', 'Nincs saját parkoló. A Klauzál téri mélygarázs 300 méterre van.'],
    ['Bejárat', 'Utcafronton, lépcső nélkül. Babakocsival és kerekesszékkel is bejárható.'],
  ] as [string, string][],
  map: { lat: 47.4983, lon: 19.0661 },
};

export interface Machine { name: string; kind: string; count: number; players: string; tokens: number; note: string }
export const machines: Machine[] = [
  { name: 'Csillagőr', kind: 'Űrlövöldözés', count: 6, players: '1-2', tokens: 1, note: 'Álló gép, eredeti joystickkal. A legrégebbi darabunk 1982-es.' },
  { name: 'Neon Futam', kind: 'Autóverseny', count: 4, players: '1-4', tokens: 2, note: 'Négy ülés összekötve, egymás ellen is mehettek.' },
  { name: 'Ütemhiba', kind: 'Ritmus, táncpadló', count: 2, players: '1-2', tokens: 2, note: 'Zenére lépsz a nyilakra. Cipőben is megy, mezítláb gyorsabb.' },
  { name: 'Labirintus', kind: 'Ügyességi', count: 8, players: '1', tokens: 1, note: 'Szellemek elől menekülsz egy útvesztőben. Gyerekeknek is.' },
  { name: 'Flipper', kind: 'Asztal', count: 6, players: '1-4', tokens: 2, note: 'Hetente állítjuk be őket, a döntés pontosan 6,5 fok.' },
  { name: 'Léghoki', kind: 'Asztal', count: 2, players: '2', tokens: 2, note: 'Hét gólig tart egy menet.' },
  { name: 'Ököl és Acél', kind: 'Verekedős', count: 6, players: '2', tokens: 1, note: 'Kétszemélyes gépek egymással szemben.' },
  { name: 'Kosárdobó', kind: 'Ügyességi', count: 3, players: '1', tokens: 1, note: 'Hatvan másodperc, ahány kosár, annyi jegy.' },
];

export const tokens = [
  { what: '1 zseton', price: 200, note: '' },
  { what: '30 zseton', price: 5000, note: '+5 ajándék' },
  { what: '60 zseton', price: 9000, note: '+15 ajándék' },
  { what: 'Korlátlan 2 óra', price: 5900, note: 'hétfő-csütörtök' },
  { what: 'Korlátlan 2 óra', price: 7900, note: 'péntek-vasárnap' },
];
export const tokenNotes = [
  'Zsetont a pultnál és a bejáratnál álló automatánál veszel, kártyával is.',
  'A megmaradt zseton nem jár le, legközelebb is jó.',
  'A jegyeket a pultnál ajándékra váltod.',
];

export interface Party { name: string; guests: string; length: string; price: number; includes: string[] }
export const parties: Party[] = [
  { name: 'Kis kör', guests: '8 főig', length: '2 óra', price: 39900, includes: ['40 zseton fejenként', 'Saját asztal a büfé mellett', 'Hely a tortának, gyertyát mi adunk'] },
  { name: 'Nagy kör', guests: '15 főig', length: '3 óra', price: 79900, includes: ['Korlátlan játék minden gépen', 'Két tálca pizza és üdítő', 'Bajnokság, oklevél a győztesnek'] },
  { name: 'Zárt terem', guests: '30 főig', length: '3 óra', price: 189000, includes: ['Az egész terem csak a tiétek', 'Korlátlan játék, saját zene', 'Szombat vagy vasárnap reggel 10-től'] },
];
export const partyNote = 'Foglalás legalább egy héttel előtte. Előleg 10 000 Ft, a többit a buli napján fizetitek.';

export const hours: [string, string][] = [
  ['Hétfő', '14:00-22:00'],
  ['Kedd', '14:00-22:00'],
  ['Szerda', '14:00-22:00'],
  ['Csütörtök', '14:00-22:00'],
  ['Péntek', '14:00-24:00'],
  ['Szombat', '10:00-24:00'],
  ['Vasárnap', '10:00-20:00'],
];
export const hoursNote = '18 év alatt 20 óráig maradhatsz felnőtt nélkül. Ünnepnapokon a vasárnapi nyitvatartás érvényes.';

// The reviews, shown as a high score table.
export const scores = [
  { name: 'ANNA', score: 99870, text: 'Tizenkét gyerek a szülinapon, egyik se nézett telefont.' },
  { name: 'BENCE', score: 87450, text: 'A flipperek tényleg be vannak állítva. Ez ritka.' },
  { name: 'ZSÓFI', score: 76300, text: 'Péntek este jöttünk, éjfélig maradtunk. A 60-as csomag megéri.' },
  { name: 'DÁVID', score: 65120, text: 'Gyerekkoromban ilyen helyre jártam. Most a fiammal jöttem.' },
  { name: 'RÉKA', score: 54990, text: 'Kedves személyzet, működő gépek, tiszta mosdó.' },
];

export const ft = (n: number) => `${new Intl.NumberFormat('hu-HU').format(n).replace(/\s/g, ' ')} Ft`;
export const pts = (n: number) => String(n).padStart(6, '0');
