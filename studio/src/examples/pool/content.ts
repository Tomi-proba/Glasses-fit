// Kékvíz Medence: a fictional pool builder and pool enclosure dealer near Budapest.

export const brand = {
  name: 'Kékvíz Medence',
  short: 'Kékvíz',
  tagline: 'Medenceépítés kulcsrakészen, teleszkópos medencefedések.',
  description: 'Vasbeton medencék kulcsrakészen, tervezéstől a feltöltésig, és teleszkópos medencefedések meglévő medencékre is. Budapest és Pest megye, ingyenes helyszíni felméréssel.',
  phone: '+36 23 555 0190',
  email: 'ajanlat@kekviz-medence.example',
  address: '2040 Budaörs, Szabadság út 118.',
  showroom: 'Bemutatóterem és iroda',
  hours: [
    ['Hétfő', '08:00-17:00'], ['Kedd', '08:00-17:00'], ['Szerda', '08:00-17:00'], ['Csütörtök', '08:00-17:00'], ['Péntek', '08:00-17:00'], ['Szombat', '09:00-13:00'],
  ] as [string, string][],
  area: 'Budapest, Pest megye, Fejér és Komárom-Esztergom megye',
  map: { lat: 47.4612, lon: 18.9586 },
};

// The seven phases of the opening scene (photo 06 is used later on the page).
export const phases = [
  { img: '01', name: 'Tervezés', text: 'Felmérjük a kertet, és 3D tervet készítünk a medencéről.' },
  { img: '02', name: 'Földmunka', text: 'Kitűzés, gépi földkiemelés, a föld elszállítása.' },
  { img: '03', name: 'Betonozás', text: 'Vasalt aljzat és zsalukő falak, beépített gépészeti csövekkel.' },
  { img: '04', name: 'Burkolás', text: 'Vízzáró réteg, medencefólia és fagyálló szegélykő.' },
  { img: '05', name: 'Feltöltés', text: 'Gépészet beüzemelése, vízkezelés, átadás.' },
  { img: '07', name: 'Fedés', text: 'A teleszkópos fedés sínen gördül, kézzel is egy perc alatt zárható.' },
  { img: '08', name: 'Kész', text: 'Áprilistól októberig úszható, télen is tiszta.' },
];

export const benefits = [
  ['Melegebb víz', 'Napos időben 6-8 fokkal melegebb, mint fedés nélkül, a fűtés kevesebbet dolgozik.'],
  ['Tisztább medence', 'Nem hullik bele levél, por és rovar, kevesebb vegyszer és porszívózás kell.'],
  ['Hosszabb szezon', 'Áprilistól októberig lehet úszni, fedés nélkül ez nagyjából június és augusztus között.'],
  ['Biztonság', 'Zárható ajtó és kulcs: gyerek és háziállat nem esik a vízbe.'],
];

export const steps = [
  ['Felmérés és terv', 'Kimegyünk, megnézzük a talajt, a lejtést és a közműveket. Egy héten belül 3D tervet és tételes árajánlatot küldünk.'],
  ['Földmunka', 'Kitűzzük a medence helyét, kiemeljük és elszállítjuk a földet. A gyepet, ahol lehet, megóvjuk.'],
  ['Vasbeton szerkezet', 'Vasalt aljzat, zsalukő falak, betöltés. A gépészet csövei ekkor kerülnek a falba.'],
  ['Gépészet és burkolás', 'Szűrő, szivattyú, igény szerint hőszivattyú és sósvízes vízkezelés. Medencefólia vagy mozaik, fagyálló szegélykő.'],
  ['Feltöltés és átadás', 'Feltöltjük, beállítjuk a vízkezelést, és megmutatjuk a karbantartást. A gyepet és a teraszt visszaállítjuk.'],
];

export const pools = [
  { name: 'Vasbeton medence, 6 × 3 m', price: 4_900_000, note: 'gépészettel, fóliával, szegélykővel' },
  { name: 'Vasbeton medence, 8 × 4 m', price: 6_900_000, note: 'gépészettel, fóliával, szegélykővel' },
  { name: 'Hőszivattyú', price: 690_000, note: 'beépítve, 8 × 4 m-es medencéhez' },
];

export interface Cover { name: string; height: string; price: number; text: string }
export const covers: Cover[] = [
  { name: 'Alacsony teleszkópos', height: '20-55 cm', price: 1_690_000, text: 'Alig látszik a kertben. Télen-nyáron véd, úszni nyitott állásban lehet.' },
  { name: 'Közepes teleszkópos', height: '90-130 cm', price: 2_490_000, text: 'Csukott állásban is lehet úszni a medence egy részén, a víz jobban melegszik.' },
  { name: 'Magas teleszkópos', height: '210-250 cm', price: 3_790_000, text: 'Állni és járni lehet alatta, a medence mellett kis terasz is elfér. Esőben is lehet úszni.' },
];
export const coverNote = 'Az árak 8 × 4 m-es medencére, beépítéssel értendők. Polikarbonát panelek, eloxált alumínium váz, zárható ajtó. Meglévő medencére is szerelünk.';

export const references = [
  { place: 'Budakeszi', year: 2025, text: '8 × 4 m vasbeton medence, közepes teleszkópos fedés, hőszivattyú' },
  { place: 'Érd', year: 2025, text: 'Meglévő medence felújítása, alacsony teleszkópos fedés' },
  { place: 'Szentendre', year: 2024, text: '10 × 4 m medence lépcsővel, sósvízes vízkezelés, fa terasz' },
  { place: 'Gödöllő', year: 2024, text: '6 × 3 m medence kis kertbe, magas teleszkópos fedés' },
  { place: 'Biatorbágy', year: 2023, text: '8 × 3,5 m medence lejtős telken, támfallal' },
];
export const quote = { text: 'Márciusban kezdték, május végén már úsztunk. Azóta októberig nyitva van a medence, a fedés alatt a víz is melegebb.', name: 'Kovács Anikó', role: 'Budakeszi' };

export const faq: [string, string][] = [
  ['Mennyibe kerül egy medence kulcsrakészen?', 'Egy 8 × 4 m-es vasbeton medence gépészettel, fóliával és szegélykővel 6 900 000 Ft-tól, egy 6 × 3 m-es 4 900 000 Ft-tól. A pontos árat a helyszíni felmérés után, tételesen írjuk meg.'],
  ['Mennyi ideig tart az építés?', 'A földmunkától a feltöltésig általában 5-7 hét. Tervezéssel és anyagrendeléssel együtt két-három hónappal a kívánt úszás előtt érdemes kezdeni.'],
  ['Kell építési engedély a medencéhez?', 'Az 50 m³-nél kisebb kerti medencéhez általában nem kell, de a helyi építési szabályzat ezt felülírhatja. A felméréskor ezt is ellenőrizzük.'],
  ['Meglévő medencére is szerelnek fedést?', 'Igen. Lemérjük a medencét és a körülötte lévő burkolatot, és arra méretre gyártjuk a fedést. A sínek a szegélykőre vagy mellé kerülnek.'],
  ['Mennyi a garancia?', 'A medence szerkezetére 10 év, a fóliára 5 év, a fedés vázára 10 év, a polikarbonát panelekre 5 év.'],
  ['Mennyibe kerül a felmérés?', 'Budapesten és Pest megyében ingyenes. Távolabb a kiszállás díját levonjuk az árból, ha minket választ.'],
];
export const ft = (n: number) => `${new Intl.NumberFormat('hu-HU').format(n).replace(/\s/g, ' ')} Ft`;
