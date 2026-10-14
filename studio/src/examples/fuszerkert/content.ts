// Fűszerkert Bisztró: a fictional spice-led bistro. Shared by the Prémium and the Alap example.

export const brand = {
  name: 'Fűszerkert Bisztró',
  short: 'Fűszerkert',
  tagline: 'Szezonális konyha, a fűszerek szerelmeseinek.',
  description: 'Szezonális bisztró a Klauzál tér mellett: saját fűszerkeverékek, helyi alapanyagok, napi ajánlat. Asztalfoglalás online.',
  phone: '+36 1 555 0187',
  email: 'asztal@fuszerkert.example',
  address: '1072 Budapest, Klauzál tér 9.',
  map: { lat: 47.4975, lon: 19.0655 },
};

export const hours = [
  { days: 'Hétfő', time: 'Zárva' },
  { days: 'Kedd-csütörtök', time: '12:00-22:00' },
  { days: 'Péntek-szombat', time: '12:00-23:00' },
  { days: 'Vasárnap', time: '12:00-16:00' },
];

/** Spices: label + Phosphor icon name, shown when a dish is hovered. */
export const SPICES: Record<string, { label: string; icon: string }> = {
  paprika: { label: 'füstölt paprika', icon: 'pepper' },
  pirospaprika: { label: 'pirospaprika', icon: 'pepper' },
  kurkuma: { label: 'kurkuma', icon: 'flowerTulip' },
  kapor: { label: 'kapor', icon: 'plant' },
  gyomber: { label: 'gyömbér', icon: 'flame' },
  rozmaring: { label: 'rozmaring', icon: 'leaf' },
  kakukkfu: { label: 'kakukkfű', icon: 'leaf' },
  safrany: { label: 'sáfrány', icon: 'flower' },
  komeny: { label: 'kömény', icon: 'grains' },
  fahej: { label: 'fahéj', icon: 'coffeeBean' },
  kardamom: { label: 'kardamom', icon: 'coffeeBean' },
  szegfuszeg: { label: 'szegfűszeg', icon: 'flame' },
  citrus: { label: 'citromhéj', icon: 'orangeSlice' },
};

export interface Dish { name: string; desc: string; price: number; spice: keyof typeof SPICES; veg?: boolean }
export const menu: { id: string; title: string; icon: string; dishes: Dish[] }[] = [
  {
    id: 'eloetelek', title: 'Előételek', icon: 'bowl', dishes: [
      { name: 'Füstölt paprikás padlizsánkrém', desc: 'Faszénen sült padlizsán, házi kovászos lepény', price: 2900, spice: 'paprika', veg: true },
      { name: 'Kurkumás lencsefasírt', desc: 'Mentás joghurt, pirított mag, savanyított hagyma', price: 3400, spice: 'kurkuma', veg: true },
      { name: 'Pácolt pisztráng', desc: 'Kapros tejföl, ropogós rozskenyér, citrus', price: 3900, spice: 'kapor' },
    ],
  },
  {
    id: 'levesek', title: 'Levesek', icon: 'cookingPot', dishes: [
      { name: 'Gulyásleves szürkemarhából', desc: 'Csipetkével, ahogy a nagymamánk főzte', price: 3200, spice: 'pirospaprika' },
      { name: 'Sütőtökkrémleves', desc: 'Pirított tökmag, tökmagolaj, friss gyömbér', price: 2800, spice: 'gyomber', veg: true },
    ],
  },
  {
    id: 'foetelek', title: 'Főételek', icon: 'forkKnife', dishes: [
      { name: 'Rozmaringos báránycsülök', desc: 'Lassan sütve, krémes polenta, sült fokhagyma', price: 7900, spice: 'rozmaring' },
      { name: 'Kakukkfüves kacsamell', desc: 'Szilvás pecsenyelé, zellerpüré, pirított dió', price: 7400, spice: 'kakukkfu' },
      { name: 'Sáfrányos rizottó', desc: 'Grillezett idényzöldség, érlelt kecskesajt', price: 5600, spice: 'safrany', veg: true },
      { name: 'Köményes sertéstarja', desc: 'Házi savanyú káposzta, burgonyalángos', price: 6200, spice: 'komeny' },
    ],
  },
  {
    id: 'desszertek', title: 'Desszertek', icon: 'cookie', dishes: [
      { name: 'Fahéjas szilvás pite', desc: 'Vaníliafagylalt, karamellizált dió', price: 2600, spice: 'fahej', veg: true },
      { name: 'Kardamomos csokoládéfondant', desc: 'Narancsos krémfraîche', price: 2900, spice: 'kardamom', veg: true },
    ],
  },
  {
    id: 'italok', title: 'Italok', icon: 'wine', dishes: [
      { name: 'Házi gyömbérlimonádé', desc: 'Friss gyömbér, lime, menta', price: 1400, spice: 'gyomber', veg: true },
      { name: 'Fűszeres forralt bor', desc: 'Szezonális, villányi kékfrankosból', price: 1900, spice: 'szegfuszeg', veg: true },
    ],
  },
];

/** Daily special by weekday (0 = vasárnap). Monday is closed. */
export const specials: Record<number, { name: string; desc: string; price: number; spice: keyof typeof SPICES } | null> = {
  0: { name: 'Vasárnapi rozmaringos csirke', desc: 'Egészben sütve, citromos burgonyával', price: 5400, spice: 'rozmaring' },
  1: null,
  2: { name: 'Kurkumás csicseriborsó-curry', desc: 'Kókusztejjel, basmati rizzsel, korianderrel', price: 3900, spice: 'kurkuma' },
  3: { name: 'Paprikás harcsa', desc: 'Túrós csuszával, pirított szalonnával', price: 4600, spice: 'pirospaprika' },
  4: { name: 'Köményes marhapofa', desc: 'Lassan párolva, petrezselymes galuskával', price: 4800, spice: 'komeny' },
  5: { name: 'Sáfrányos halleves', desc: 'Balatoni süllő és ponty, fokhagymás pirítós', price: 4200, spice: 'safrany' },
  6: { name: 'Kakukkfüves vaddisznóragu', desc: 'Áfonyás vörösboros mártás, házi nudli', price: 5200, spice: 'kakukkfu' },
};

export const gallery = ['fuszerkert/g1', 'fuszerkert/g2', 'fuszerkert/g3', 'fuszerkert/g4', 'fuszerkert/g5', 'fuszerkert/g6'];

export const reviews = [
  { quote: 'A sáfrányos rizottó miatt már háromszor visszajöttünk. A pincér minden fogásnál elmondta, melyik fűszer honnan jön.', name: 'Kertész Dóra', source: 'Google, 5/5' },
  { quote: 'Végre egy hely, ahol a gulyás tényleg gulyás. Hangulatos, nem túl hangos, a forralt bor pedig kötelező.', name: 'Bakos András', source: 'Google, 5/5' },
  { quote: 'Születésnapra foglaltunk asztalt, kaptunk egy kis kóstolót a konyhától. Ilyen figyelmesség ritka.', name: 'Fodor Zsófia', source: 'TripAdvisor, 5/5' },
];

export const formatFt = (n: number) => `${new Intl.NumberFormat('hu-HU').format(n)} Ft`;
