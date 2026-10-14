// Quote requests (/ajanlatkeres): collect, validate and hand over everything we need to
// prepare a personalised offer. The design from the tervező is attached when the visitor wants.
import pricing from '../config/pricing.json';
import { saveLastQuote } from './store.js';

export const QUOTE_SCHEMA_VERSION = 1;

/** Choices shared by the form markup and the JSON, so labels never drift apart. */
export const QUOTE_OPTIONS = {
  package: [...pricing.packages.map((p) => [p.id, p.name]), ['unsure', 'Még nem tudom']],
  pages: [['1', 'Egy oldal'], ['2-3', '2-3 oldal'], ['4-6', '4-6 oldal'], ['7+', '7 vagy több'], ['unsure', 'Még nem tudom']],
  assets: [['yes', 'Igen'], ['partly', 'Részben'], ['no', 'Nem']],
  domain: [['yes', 'Igen, van'], ['no', 'Még nincs'], ['unsure', 'Nem tudom']],
  deadline: [['asap', 'Minél hamarabb'], ['1m', 'Egy hónapon belül'], ['1-3m', '1-3 hónapon belül'], ['flexible', 'Nincs konkrét határidő']],
};
export const ASSET_KINDS = [['logo', 'Logó'], ['texts', 'Szövegek'], ['photos', 'Fotók']];

const label = (list, value) => QUOTE_OPTIONS[list].find(([v]) => v === value)?.[1] || '';
const clean = (v) => String(v ?? '').trim();

function requestId() {
  const rnd = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().padStart(6, '0');
  return `AJ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${rnd}`;
}

/**
 * Field-level validation. Returns { fieldName: message } for every invalid field.
 * @param {Record<string, string|boolean>} f  the form's values
 */
export function validateQuote(f) {
  const errors = {};
  const filled = (k) => clean(f[k]) !== '';
  if (!filled('name')) errors.name = 'Add meg a neved.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean(f.email))) errors.email = 'Érvényes e-mail címet adj meg, ide küldjük az ajánlatot.';
  if (filled('phone') && !/^[+\d][\d\s/()-]{6,}$/.test(clean(f.phone))) errors.phone = 'Ellenőrizd a telefonszámot, vagy hagyd üresen.';
  if (!filled('company')) errors.company = 'Add meg a cég nevét. Ha még nincs, a tervezett nevet is írhatod.';
  if (clean(f.activity).length < 3) errors.activity = 'Írd le pár szóban, mivel foglalkozol.';
  if (!label('package', f.package)) errors.package = 'Válassz csomagot, vagy jelöld, hogy még nem tudod.';
  if (!label('pages', f.pages)) errors.pages = 'Válaszd ki, nagyjából hány oldal kell.';
  for (const [k] of ASSET_KINDS) if (!label('assets', f[`asset_${k}`])) errors[`asset_${k}`] = 'Válassz egy lehetőséget.';
  if (!label('domain', f.domain)) errors.domain = 'Válassz egy lehetőséget.';
  if (!label('deadline', f.deadline)) errors.deadline = 'Válaszd ki, mikorra kell az oldal.';
  const bad = clean(f.examples).split(/\s+/).filter(Boolean).find((u) => !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}/i.test(u));
  if (bad) errors.examples = `Ez nem tűnik linknek: ${bad.slice(0, 40)}. Soronként egy linket írj.`;
  if (clean(f.notes).length > 3000) errors.notes = 'Legfeljebb 3000 karakter fér el.';
  if (f.privacy !== true) errors.privacy = 'Az ajánlatkéréshez el kell fogadnod az adatkezelési tájékoztatót.';
  return errors;
}

/**
 * Basic spam protection: a hidden honeypot field that people never fill in, and a minimum
 * time on the page (bots submit instantly). Real protection belongs on the server too.
 */
export function looksLikeSpam(f, startedAt) {
  return clean(f.website) !== '' || Date.now() - startedAt < 3000;
}

/**
 * Collects the form and the optional tervező design into one JSON object.
 * @param {{ fields: Record<string, string|boolean>, design?: object|null, designPackage?: string }} input
 */
export function buildQuoteRequest({ fields: f, design = null, designPackage = '' }) {
  const pkg = pricing.packages.find((p) => p.id === f.package);
  return {
    schemaVersion: QUOTE_SCHEMA_VERSION,
    requestId: requestId(),
    createdAt: new Date().toISOString(),
    source: design ? 'tervezo' : 'direct',
    contact: { name: clean(f.name), email: clean(f.email), phone: clean(f.phone), company: clean(f.company) },
    project: {
      activity: clean(f.activity),
      package: { id: f.package, label: label('package', f.package), priceFrom: pkg ? pkg.priceFrom : null, currency: pricing.currency },
      pages: { id: f.pages, label: label('pages', f.pages) },
      assets: Object.fromEntries(ASSET_KINDS.map(([k]) => [k, { id: f[`asset_${k}`], label: label('assets', f[`asset_${k}`]) }])),
      domain: { id: f.domain, label: label('domain', f.domain), name: clean(f.domainName) },
      examples: clean(f.examples).split(/\s+/).filter(Boolean),
      deadline: { id: f.deadline, label: label('deadline', f.deadline) },
      notes: clean(f.notes),
      // The example site the visitor came from ("Ilyet szeretnék"), if any.
      example: clean(f.example),
    },
    consents: { privacy: f.privacy === true, acceptedAt: new Date().toISOString() },
    // The full design from the tervező (site config v2), or null when the request came without one.
    // Uploaded images are inside it as data URLs, so it can be large.
    design,
    designPackage: design ? designPackage : '',
    vatNote: pricing.vatNote,
  };
}

/**
 * Sends the quote request.
 *
 * ┌─────────────────────────────────────────────────────────────────────────────────────┐
 * │ IDE KERÜL A KÜLDÉS. Most csak helyben menti az összefoglalót, hogy a /koszonjuk      │
 * │ oldal megszólíthassa a látogatót. Élesítéskor válassz egyet:                         │
 * │                                                                                       │
 * │  A) Formspree (backend nélkül):                                                       │
 * │     await fetch('https://formspree.io/f/<FORM_ID>', { method: 'POST',                 │
 * │       headers: { 'Content-Type': 'application/json', Accept: 'application/json' },     │
 * │       body: JSON.stringify(request) });                                                │
 * │                                                                                       │
 * │  B) Resend vagy saját backend: egy szerveroldali végpont (pl. src/pages/api/          │
 * │     ajanlatkeres.ts Astro adapterrel), ami ellenőrzi az adatokat, e-mailt küld        │
 * │     (Resend API kulccsal, csak a szerveren!) és/vagy adatbázisba ment:                 │
 * │     await fetch(`${BASE}api/ajanlatkeres`, { method: 'POST',                           │
 * │       headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) });│
 * │                                                                                       │
 * │ Hiba esetén adj vissza { ok: false, message }, az űrlap kiírja.                       │
 * └─────────────────────────────────────────────────────────────────────────────────────┘
 */
export async function sendQuoteRequest(request) {
  // PLACEHOLDER: nothing leaves the browser yet.
  saveLastQuote({ requestId: request.requestId, createdAt: request.createdAt, name: request.contact.name, email: request.contact.email, hasDesign: !!request.design });
  return { ok: true, requestId: request.requestId };
}
