// Live configurator: edits a site.config.json object step by step, streams it to the
// preview iframe, autosaves to localStorage and exports JSON or a ready-to-host ZIP.
import JSZip from 'jszip';
import {
  EFFECTS,
  FONTS,
  SECTION_IDS,
  SECTION_LABELS,
  SERVICE_ICONS,
  SOCIAL_TYPES,
  buildPage,
  buildRobots,
  buildSitemap,
  contrast,
  esc,
  icon,
} from './render.js';

const STORAGE_KEY = 'site-configurator:v1';
const STEP_KEY = 'site-configurator:step';

const ACCENTS = [
  ['Neon kék', '#00d4ff'],
  ['Elektromos lila', '#8b5cf6'],
  ['Menta', '#22e3a1'],
  ['Arany', '#e8b44a'],
  ['Rózsa', '#ff4d8d'],
  ['Narancs', '#ff7a30'],
  ['Korall', '#ff5a5f'],
  ['Királykék', '#3b6cff'],
];

const SOCIAL_LABELS = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', youtube: 'YouTube', linkedin: 'LinkedIn', x: 'X (Twitter)' };

const $ = (sel, root = document) => root.querySelector(sel);

let defaults = null;
let config = null;
let step = 0;

/* ------------------------------------------------------------- utilities */

const clone = (v) => structuredClone(v);

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function setPath(obj, path, value) {
  const keys = path.split('.');
  let o = obj;
  keys.slice(0, -1).forEach((k, i) => {
    if (o[k] == null) o[k] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    o = o[k];
  });
  o[keys.at(-1)] = value;
}

/** Fills in keys missing from `saved` (e.g. after a template update) from `base`. */
function mergeDefaults(base, saved) {
  if (Array.isArray(base) || Array.isArray(saved)) return saved ?? base;
  if (base && typeof base === 'object') {
    const out = { ...base };
    for (const [k, v] of Object.entries(saved || {})) out[k] = k in base ? mergeDefaults(base[k], v) : v;
    return out;
  }
  return saved ?? base;
}

function slugify(text) {
  return String(text || 'weboldal')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'weboldal';
}

function toast(message, kind = 'ok') {
  const el = $('#toast');
  el.textContent = message;
  el.dataset.kind = kind;
  el.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { el.hidden = true; }, 3200);
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Reads an uploaded image, downscales it and returns a data URL (SVGs are kept as-is). */
function readImage(file, maxSize) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Csak képfájl tölthető fel.'));
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      if (file.type === 'image/svg+xml') return resolve(reader.result);
      const img = new Image();
      img.onerror = () => reject(new Error('A kép nem olvasható.'));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        const keepAlpha = file.type === 'image/png' && maxSize <= 600;
        resolve(canvas.toDataURL(keepAlpha ? 'image/png' : 'image/webp', 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* --------------------------------------------------------- form controls */

const uid = (() => { let n = 0; return () => `f${++n}`; })();

function field(label, path, { type = 'text', hint = '', rows = 0, placeholder = '', kind = '' } = {}) {
  const id = uid();
  let value = getPath(config, path);
  if (kind === 'paragraphs') value = (value || []).join('\n\n');
  const attrs = `id="${id}" data-path="${esc(path)}"${kind ? ` data-kind="${kind}"` : ''} placeholder="${esc(placeholder)}"${hint ? ` aria-describedby="${id}-hint"` : ''}`;
  const control = rows
    ? `<textarea ${attrs} rows="${rows}">${esc(value)}</textarea>`
    : `<input ${attrs} type="${type}" value="${esc(value)}">`;
  return `<div class="f"><label for="${id}">${esc(label)}</label>${control}${hint ? `<p class="hint" id="${id}-hint">${esc(hint)}</p>` : ''}</div>`;
}

function select(label, path, options) {
  const id = uid();
  const value = getPath(config, path);
  const opts = options.map(([v, text]) => `<option value="${esc(v)}"${String(v) === String(value) ? ' selected' : ''}>${esc(text)}</option>`).join('');
  return `<div class="f"><label for="${id}">${esc(label)}</label><select id="${id}" data-path="${esc(path)}">${opts}</select></div>`;
}

function imageField(label, path, { alt, maxSize = 1600, hint = '' } = {}) {
  const id = uid();
  const value = getPath(config, path);
  return `<div class="f img-field">
    <span class="label">${esc(label)}</span>
    <div class="img-row">
      <div class="thumb">${value ? `<img src="${esc(value)}" alt="">` : '<span>Nincs kép</span>'}</div>
      <div class="img-actions">
        <label class="cfg-btn ghost sm file-btn" for="${id}">Kép feltöltése<input id="${id}" type="file" accept="image/*" data-image="${esc(path)}" data-max="${maxSize}"></label>
        ${value ? `<button type="button" class="cfg-btn ghost sm" data-action="clear-image" data-path="${esc(path)}">Eltávolítás</button>` : ''}
      </div>
    </div>
    ${hint ? `<p class="hint">${esc(hint)}</p>` : ''}
    ${alt ? field('Alternatív szöveg (akadálymentesség)', alt, { hint: 'Röviden írd le, mi látható a képen.' }) : ''}
  </div>`;
}

function listControls(list, i, length) {
  return `<div class="item-tools">
    <button type="button" class="icon-btn" data-action="move" data-list="${list}" data-index="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="Feljebb">↑</button>
    <button type="button" class="icon-btn" data-action="move" data-list="${list}" data-index="${i}" data-dir="1" ${i === length - 1 ? 'disabled' : ''} aria-label="Lejjebb">↓</button>
    <button type="button" class="icon-btn danger" data-action="remove" data-list="${list}" data-index="${i}" aria-label="Törlés">✕</button>
  </div>`;
}

function group(title, body, { open = false, section = '' } = {}) {
  return `<details class="group"${open ? ' open' : ''}${section ? ` data-section="${section}"` : ''}><summary>${esc(title)}</summary><div class="group-body">${body}</div></details>`;
}

/* ------------------------------------------------------------------ steps */

const STEPS = [
  {
    title: 'Alapadatok',
    lead: 'Kezdjük a cég nevével és a legfontosabb üzenettel.',
    render: () => `
      ${field('Cégnév', 'brand.name', { placeholder: 'pl. Aura Hair Studio' })}
      ${field('Rövid név (menüben)', 'brand.shortName', { hint: 'A fejlécben jelenik meg, ha a teljes név túl hosszú.' })}
      ${field('Szlogen', 'brand.tagline')}
      <h3 class="sub">Hero szekció</h3>
      ${field('Felső kis felirat', 'hero.eyebrow')}
      ${field('Főcím', 'hero.title', { rows: 2 })}
      ${field('Alcím', 'hero.subtitle', { rows: 3 })}
      <div class="row">${field('Gomb szövege', 'hero.ctaText')}${field('Második gomb', 'hero.secondaryText')}</div>
      <h3 class="sub">Keresőoptimalizálás</h3>
      ${field('Oldal címe (böngészőfül, Google)', 'meta.title', { hint: 'Ideálisan 50–60 karakter.' })}
      ${field('Leírás (Google találat)', 'meta.description', { rows: 3, hint: 'Ideálisan 120–160 karakter.' })}
      <div class="row">${field('Weboldal címe (URL)', 'meta.siteUrl', { type: 'url', placeholder: 'https://www.cegnev.hu' })}${select('Nyelv', 'meta.lang', [['hu', 'Magyar'], ['en', 'English'], ['de', 'Deutsch']])}</div>`,
  },
  {
    title: 'Megjelenés',
    lead: 'Szín, téma, betűtípus és a 3D hatás.',
    render: () => {
      const mode = config.theme.mode;
      const accent = config.theme.accent;
      const swatches = ACCENTS.map(([name, hex]) => `<button type="button" class="swatch${hex.toLowerCase() === String(accent).toLowerCase() ? ' on' : ''}" style="--c:${hex}" data-action="accent" data-value="${hex}" aria-label="${name}" title="${name}"></button>`).join('');
      const fonts = Object.keys(FONTS).map((f) => [f, f]);
      const effects = Object.entries(EFFECTS).map(([k, label]) => `<label class="choice${config.effect3d === k ? ' on' : ''}">
          <input type="radio" name="effect3d" value="${k}" data-path="effect3d" ${config.effect3d === k ? 'checked' : ''}>
          <span class="choice-art art-${k}" aria-hidden="true"></span><span>${label}</span></label>`).join('');
      const textOnBg = mode === 'light' ? [246, 245, 242] : [7, 8, 12];
      const rgb = String(accent).replace('#', '').match(/.{2}/g)?.map((h) => parseInt(h, 16)) || [0, 0, 0];
      const ratio = contrast(rgb, textOnBg);
      return `
      <div class="f"><span class="label">Téma</span>
        <div class="segmented" role="radiogroup" aria-label="Téma">
          <label><input type="radio" name="mode" value="dark" data-path="theme.mode" ${mode !== 'light' ? 'checked' : ''}><span>🌙 Sötét</span></label>
          <label><input type="radio" name="mode" value="light" data-path="theme.mode" ${mode === 'light' ? 'checked' : ''}><span>☀️ Világos</span></label>
        </div>
      </div>
      <div class="f"><span class="label">Kiemelő szín</span>
        <div class="swatches">${swatches}</div>
        <div class="color-row">
          <input type="color" id="accent-picker" value="${esc(accent)}" data-path="theme.accent" aria-label="Egyedi szín">
          <input type="text" id="accent-hex" value="${esc(accent)}" data-path="theme.accent" data-kind="hex" aria-label="Szín hex kódja" maxlength="7" spellcheck="false">
        </div>
        <p class="hint">${ratio < 3 ? '⚠️ Ez a szín kevésbé olvasható ezen a háttéren – a szövegekhez automatikusan kontrasztosabb árnyalatot használunk.' : '✓ Jó kontraszt a háttérrel.'}</p>
      </div>
      <div class="row">${select('Címsor betűtípus', 'theme.headingFont', fonts)}${select('Szöveg betűtípus', 'theme.bodyFont', fonts)}</div>
      <div class="f"><label for="radius">Lekerekítés: <output id="radius-out">${config.theme.radius}px</output></label>
        <input id="radius" type="range" min="0" max="36" step="2" value="${config.theme.radius}" data-path="theme.radius" data-kind="number"></div>
      <div class="f"><span class="label">3D effekt a hero szekcióban</span><div class="choices">${effects}</div>
        <p class="hint">Mobilon automatikusan könnyített változat fut, a „csökkentett mozgás” beállítású eszközökön pedig kikapcsol.</p></div>`;
    },
  },
  {
    title: 'Szekciók',
    lead: 'Kapcsold ki-be a szekciókat, és húzd őket a kívánt sorrendbe.',
    render: () => {
      const items = config.sections.order.map((id, i, arr) => `<li class="sec-item${config.sections.enabled[id] === false ? ' off' : ''}" draggable="true" data-id="${id}">
          <span class="handle" aria-hidden="true">⋮⋮</span>
          <button type="button" class="sec-name" data-action="goto" data-id="${id}">${esc(SECTION_LABELS[id])}</button>
          <div class="item-tools">
            <button type="button" class="icon-btn" data-action="move" data-list="sections.order" data-index="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="${esc(SECTION_LABELS[id])} feljebb">↑</button>
            <button type="button" class="icon-btn" data-action="move" data-list="sections.order" data-index="${i}" data-dir="1" ${i === arr.length - 1 ? 'disabled' : ''} aria-label="${esc(SECTION_LABELS[id])} lejjebb">↓</button>
          </div>
          <label class="switch"><input type="checkbox" data-path="sections.enabled.${id}" ${config.sections.enabled[id] !== false ? 'checked' : ''}><span class="sr-only">${esc(SECTION_LABELS[id])} megjelenítése</span><span class="track" aria-hidden="true"></span></label>
        </li>`).join('');
      return `<ul class="sec-list" id="sec-list" role="list">${items}</ul>
        <p class="hint">Tipp: a szekció nevére kattintva az előnézet odagörget. A sorrendet húzással vagy a nyilakkal módosíthatod.</p>
        <h3 class="sub">Menü feliratok</h3>
        ${SECTION_IDS.filter((id) => id !== 'hero').map((id) => field(SECTION_LABELS[id], `${id}.navLabel`)).join('')}`;
    },
  },
  {
    title: 'Szövegek',
    lead: 'Töltsd fel tartalommal az egyes szekciókat.',
    render: () => {
      const services = config.services.items.map((it, i, arr) => `<div class="item">
          <div class="item-head"><strong>${icon(it.icon, 'mini')} ${esc(it.title || `Szolgáltatás ${i + 1}`)}</strong>${listControls('services.items', i, arr.length)}</div>
          <div class="row">${select('Ikon', `services.items.${i}.icon`, SERVICE_ICONS.map((n) => [n, n]))}${field('Ár', `services.items.${i}.price`)}</div>
          ${field('Megnevezés', `services.items.${i}.title`)}
          ${field('Leírás', `services.items.${i}.text`, { rows: 2 })}
        </div>`).join('');
      const testimonials = config.testimonials.items.map((it, i, arr) => `<div class="item">
          <div class="item-head"><strong>${esc(it.name || `Vélemény ${i + 1}`)}</strong>${listControls('testimonials.items', i, arr.length)}</div>
          ${field('Vélemény', `testimonials.items.${i}.quote`, { rows: 3 })}
          <div class="row">${field('Név', `testimonials.items.${i}.name`)}${field('Megjegyzés', `testimonials.items.${i}.role`)}</div>
          ${select('Értékelés', `testimonials.items.${i}.rating`, [[5, '★★★★★'], [4, '★★★★'], [3, '★★★'], [0, 'Nincs']])}
        </div>`).join('');
      const stats = config.about.stats.map((s, i, arr) => `<div class="item compact">
          <div class="row three">${field('Szám', `about.stats.${i}.value`, { type: 'text' })}${field('Utótag', `about.stats.${i}.suffix`)}${field('Felirat', `about.stats.${i}.label`)}</div>
          ${listControls('about.stats', i, arr.length)}
        </div>`).join('');
      return `
        ${group('Rólunk', `${field('Felirat', 'about.eyebrow')}${field('Cím', 'about.title', { rows: 2 })}
          ${field('Bemutatkozás', 'about.paragraphs', { rows: 7, kind: 'paragraphs', hint: 'A bekezdéseket üres sorral válaszd el.' })}
          <h4>Számok</h4>${stats}<button type="button" class="cfg-btn ghost sm" data-action="add" data-list="about.stats">+ Szám hozzáadása</button>`, { open: true, section: 'about' })}
        ${group('Szolgáltatások', `${field('Felirat', 'services.eyebrow')}${field('Cím', 'services.title', { rows: 2 })}${field('Bevezető', 'services.intro', { rows: 2 })}
          ${services}<button type="button" class="cfg-btn ghost sm" data-action="add" data-list="services.items">+ Szolgáltatás hozzáadása</button>`, { section: 'services' })}
        ${group('Referenciák', `${field('Felirat', 'gallery.eyebrow')}${field('Cím', 'gallery.title', { rows: 2 })}${field('Bevezető', 'gallery.intro', { rows: 2 })}
          <p class="hint">A képeket a „Képek” lépésben töltheted fel.</p>`, { section: 'gallery' })}
        ${group('Vélemények', `${field('Felirat', 'testimonials.eyebrow')}${field('Cím', 'testimonials.title', { rows: 2 })}
          ${testimonials}<button type="button" class="cfg-btn ghost sm" data-action="add" data-list="testimonials.items">+ Vélemény hozzáadása</button>`, { section: 'testimonials' })}
        ${group('Kapcsolat szövegei', `${field('Felirat', 'contact.eyebrow')}${field('Cím', 'contact.title', { rows: 2 })}${field('Bevezető', 'contact.intro', { rows: 2 })}
          ${field('Küldés gomb', 'contact.formSubmitText')}${field('Sikeres küldés üzenete', 'contact.formSuccess')}`, { section: 'contact' })}
        ${group('Lábléc', `${field('Lábléc szöveg', 'footer.text')}${field('Copyright szöveg', 'footer.copyright')}`)}`;
    },
  },
  {
    title: 'Képek',
    lead: 'Logó, bemutatkozó kép és referenciafotók.',
    render: () => {
      const gallery = config.gallery.items.map((it, i, arr) => `<div class="item">
          <div class="item-head"><strong>${esc(it.caption || `Kép ${i + 1}`)}</strong>${listControls('gallery.items', i, arr.length)}</div>
          ${imageField('Kép', `gallery.items.${i}.src`, { alt: `gallery.items.${i}.alt` })}
          ${field('Képaláírás', `gallery.items.${i}.caption`)}
        </div>`).join('');
      return `
        ${imageField('Logó', 'brand.logo', { maxSize: 400, alt: 'brand.logoAlt', hint: 'Négyzetes SVG vagy PNG ajánlott. Ha üres, a cégnév kezdőbetűje jelenik meg.' })}
        ${imageField('Bemutatkozó kép (Rólunk)', 'about.image', { alt: 'about.imageAlt' })}
        ${imageField('Megosztási kép (Facebook, Messenger stb.)', 'meta.ogImage', { maxSize: 1200, hint: 'Ajánlott méret: 1200 × 630 px.' })}
        <h3 class="sub">Galéria</h3>
        ${gallery}
        <button type="button" class="cfg-btn ghost sm" data-action="add" data-list="gallery.items">+ Kép hozzáadása</button>
        <p class="hint">A feltöltött képeket automatikusan átméretezzük és tömörítjük (WebP), hogy az oldal gyors maradjon.</p>`;
    },
  },
  {
    title: 'Elérhetőség',
    lead: 'Hol és hogyan érhetnek el az ügyfelek?',
    render: () => {
      const hours = config.contact.hours.map((h, i, arr) => `<div class="item compact">
          <div class="row">${field('Napok', `contact.hours.${i}.days`)}${field('Időpont', `contact.hours.${i}.time`)}</div>
          ${listControls('contact.hours', i, arr.length)}
        </div>`).join('');
      const social = config.social.map((s, i, arr) => `<div class="item compact">
          <div class="row">${select('Platform', `social.${i}.type`, SOCIAL_TYPES.map((t) => [t, SOCIAL_LABELS[t]]))}${field('Link', `social.${i}.url`, { type: 'url', placeholder: 'https://…' })}</div>
          ${listControls('social', i, arr.length)}
        </div>`).join('');
      return `
        ${field('Cím', 'contact.address')}
        <div class="row">${field('Telefon', 'contact.phone', { type: 'tel' })}${field('E-mail', 'contact.email', { type: 'email' })}</div>
        ${field('Térkép keresőkifejezés', 'contact.mapQuery', { hint: 'Ezt keresi a beágyazott Google Térkép – pl. a pontos cím. Üresen hagyva nem jelenik meg térkép.' })}
        ${field('Űrlap fogadó cím (opcionális)', 'contact.formEndpoint', { type: 'url', placeholder: 'https://formspree.io/f/…', hint: 'Pl. Formspree vagy saját végpont. Üresen hagyva az űrlap e-mail klienst nyit.' })}
        <h3 class="sub">Nyitvatartás</h3>
        ${hours}<button type="button" class="cfg-btn ghost sm" data-action="add" data-list="contact.hours">+ Sor hozzáadása</button>
        <h3 class="sub">Közösségi média</h3>
        ${social}<button type="button" class="cfg-btn ghost sm" data-action="add" data-list="social">+ Profil hozzáadása</button>`;
    },
  },
  {
    title: 'Mentés & export',
    lead: 'A beállításaidat a böngésző automatikusan menti. Innen töltheted le őket.',
    render: () => `
      <div class="export-card">
        <h3>🚀 Kész weboldal (ZIP)</h3>
        <p>Optimalizált, azonnal feltölthető statikus weboldal – SEO meta tagekkel, sitemap.xml-lel és a képeiddel együtt. Bármilyen tárhelyre (Netlify, GitHub Pages, cPanel) feltölthető.</p>
        <button type="button" class="cfg-btn primary" data-action="download-zip">Weboldal letöltése (.zip)</button>
      </div>
      <div class="export-card">
        <h3>🧩 Beállítások (site.config.json)</h3>
        <p>A konfiguráció fájlként – ezt küldd el a fejlesztőnek, vagy töltsd vissza később.</p>
        <div class="btn-row">
          <button type="button" class="cfg-btn ghost" data-action="download-json">JSON letöltése</button>
          <label class="cfg-btn ghost file-btn">JSON betöltése<input type="file" accept="application/json,.json" data-action="import-json"></label>
        </div>
      </div>
      <div class="export-card danger">
        <h3>↺ Visszaállítás</h3>
        <p>Minden módosítás elvész, és a mintaoldal alapbeállításai töltődnek be.</p>
        <button type="button" class="cfg-btn ghost" data-action="reset">Alapállapot visszaállítása</button>
      </div>`,
  },
];

/* ----------------------------------------------------------- rendering */

function renderSteps() {
  $('#steps').innerHTML = STEPS.map((s, i) => `<li><button type="button" data-step="${i}" ${i === step ? 'aria-current="step"' : ''}>
      <span class="num">${i + 1}</span><span class="txt">${esc(s.title)}</span></button></li>`).join('');
  $('#progress').textContent = `${step + 1} / ${STEPS.length}`;
  $('[data-action="prev"]').disabled = step === 0;
  $('[data-action="next"]').disabled = step === STEPS.length - 1;
}

function renderStep({ keepScroll = false } = {}) {
  const body = $('#step-body');
  const scroll = body.scrollTop;
  const s = STEPS[step];
  body.innerHTML = `<h2>${esc(s.title)}</h2><p class="lead">${esc(s.lead)}</p>${s.render()}`;
  body.scrollTop = keepScroll ? scroll : 0;
  renderSteps();
  if (step === 2) initDragSort();
}

function goTo(i) {
  step = Math.max(0, Math.min(STEPS.length - 1, i));
  try { localStorage.setItem(STEP_KEY, String(step)); } catch { /* storage unavailable */ }
  renderStep();
  $('#step-body h2').focus?.();
}

/* --------------------------------------------------- preview + autosave */

const frame = () => $('#preview');
let sendQueued = false;

function sendToPreview() {
  if (sendQueued) return;
  sendQueued = true;
  requestAnimationFrame(() => {
    sendQueued = false;
    frame().contentWindow?.postMessage({ type: 'site-config', config }, location.origin);
  });
}

function scrollPreview(id) {
  if (SECTION_IDS.includes(id)) frame().contentWindow?.postMessage({ type: 'scroll-to', id }, location.origin);
}

let saveTimer;
function save() {
  $('#save-status').textContent = 'Mentés…';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      $('#save-status').textContent = 'Minden módosítás mentve ebben a böngészőben';
    } catch {
      $('#save-status').textContent = '⚠️ Nem sikerült menteni (túl nagy képek?) – töltsd le a JSON-t!';
    }
  }, 400);
}

function changed({ rerender = false } = {}) {
  sendToPreview();
  save();
  if (rerender) renderStep({ keepScroll: true });
}

/* -------------------------------------------------------------- events */

function onInput(e) {
  const el = e.target;
  const path = el.dataset.path;
  if (!path) return;
  let value = el.value;
  if (el.type === 'checkbox') value = el.checked;
  else if (el.dataset.kind === 'number') value = Number(value);
  else if (el.dataset.kind === 'paragraphs') value = value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  else if (el.dataset.kind === 'hex') {
    if (!/^#[0-9a-f]{6}$/i.test(value)) return;
  } else if (el.tagName === 'SELECT' && /rating$/.test(path)) value = Number(value);
  setPath(config, path, value);

  if (path === 'theme.accent') {
    if (el.id !== 'accent-hex') $('#accent-hex').value = value;
    if (el.id !== 'accent-picker') $('#accent-picker').value = value;
    document.querySelectorAll('.swatch').forEach((s) => s.classList.toggle('on', s.dataset.value.toLowerCase() === value.toLowerCase()));
  }
  if (path === 'theme.radius') $('#radius-out').textContent = `${value}px`;
  // Controls whose surrounding UI depends on the value re-render on "change" only.
  const rerender = e.type === 'change' && (el.type === 'radio' || el.type === 'checkbox' || path.endsWith('.icon') || path === 'theme.accent');
  changed({ rerender });
}

async function onFile(e) {
  const input = e.target;
  if (input.dataset.action === 'import-json') return importJson(input);
  const path = input.dataset.image;
  const file = input.files?.[0];
  if (!path || !file) return;
  try {
    setPath(config, path, await readImage(file, Number(input.dataset.max) || 1600));
    changed({ rerender: true });
    toast('Kép feltöltve ✓');
  } catch (err) {
    toast(err.message || 'Hiba a kép feltöltésekor.', 'err');
  }
}

const NEW_ITEMS = {
  'services.items': () => ({ icon: 'sparkles', title: 'Új szolgáltatás', text: 'Rövid leírás a szolgáltatásról.', price: '' }),
  'testimonials.items': () => ({ quote: 'Fantasztikus élmény volt!', name: 'Új vendég', role: '', rating: 5 }),
  'gallery.items': () => ({ src: '', alt: '', caption: 'Új kép' }),
  'about.stats': () => ({ value: '100', suffix: '+', label: 'új adat' }),
  'contact.hours': () => ({ days: 'Nap', time: '9:00 – 17:00' }),
  social: () => ({ type: 'instagram', url: '' }),
};

function onClick(e) {
  const stepBtn = e.target.closest('[data-step]');
  if (stepBtn) return goTo(Number(stepBtn.dataset.step));
  const deviceBtn = e.target.closest('[data-device]');
  if (deviceBtn && deviceBtn.tagName === 'BUTTON') return setDevice(deviceBtn.dataset.device);
  const viewBtn = e.target.closest('[data-view]');
  if (viewBtn) return setView(viewBtn.dataset.view);

  const btn = e.target.closest('[data-action]');
  if (!btn || btn.tagName === 'INPUT') return;
  const { action, list } = btn.dataset;
  const index = Number(btn.dataset.index);
  switch (action) {
    case 'prev': return goTo(step - 1);
    case 'next': return goTo(step + 1);
    case 'accent':
      config.theme.accent = btn.dataset.value;
      return changed({ rerender: true });
    case 'goto':
      setView('preview', { onlyMobile: true });
      return scrollPreview(btn.dataset.id);
    case 'add': {
      getPath(config, list).push(NEW_ITEMS[list]());
      return changed({ rerender: true });
    }
    case 'remove': {
      const arr = getPath(config, list);
      arr.splice(index, 1);
      return changed({ rerender: true });
    }
    case 'move': {
      const arr = getPath(config, list);
      const to = index + Number(btn.dataset.dir);
      if (to < 0 || to >= arr.length) return;
      [arr[index], arr[to]] = [arr[to], arr[index]];
      changed({ rerender: true });
      // Keep keyboard focus on the moved item's matching button.
      requestAnimationFrame(() => $(`[data-action="move"][data-list="${list}"][data-index="${to}"][data-dir="${btn.dataset.dir}"]`)?.focus());
      return undefined;
    }
    case 'clear-image':
      setPath(config, btn.dataset.path, '');
      return changed({ rerender: true });
    case 'download-json':
      return download(new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' }), 'site.config.json');
    case 'download-zip':
      return exportZip(btn);
    case 'reset':
      if (!confirm('Biztosan visszaállítod az alapbeállításokat? Minden módosítás elvész.')) return undefined;
      config = clone(defaults);
      changed({ rerender: true });
      return toast('Alapbeállítások visszaállítva');
    default:
      return undefined;
  }
}

// Scroll the preview to the section whose fields are being edited.
function onFocus(e) {
  const groupEl = e.target.closest('[data-section]');
  const path = e.target.dataset?.path || '';
  const id = groupEl?.dataset.section || path.split('.')[0];
  if (id !== onFocus.last && SECTION_IDS.includes(id)) {
    onFocus.last = id;
    scrollPreview(id);
  }
}

function onToggleGroup(e) {
  if (e.target.matches('details[data-section]') && e.target.open) scrollPreview(e.target.dataset.section);
}

async function importJson(input) {
  const file = input.files?.[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!data || typeof data !== 'object' || !data.brand) throw new Error('invalid');
    config = mergeDefaults(defaults, data);
    changed({ rerender: true });
    toast('Beállítások betöltve ✓');
  } catch {
    toast('Ez nem érvényes site.config.json fájl.', 'err');
  }
}

/* -------------------------------------------------------- drag sorting */

function initDragSort() {
  const listEl = $('#sec-list');
  if (!listEl) return;
  let dragged = null;
  listEl.addEventListener('dragstart', (e) => {
    dragged = e.target.closest('.sec-item');
    dragged?.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragged?.dataset.id || '');
  });
  listEl.addEventListener('dragover', (e) => {
    if (!dragged) return;
    e.preventDefault();
    const after = [...listEl.querySelectorAll('.sec-item:not(.dragging)')].find((el) => {
      const r = el.getBoundingClientRect();
      return e.clientY < r.top + r.height / 2;
    });
    if (after) listEl.insertBefore(dragged, after);
    else listEl.append(dragged);
  });
  listEl.addEventListener('dragend', () => {
    dragged?.classList.remove('dragging');
    dragged = null;
    config.sections.order = [...listEl.querySelectorAll('.sec-item')].map((el) => el.dataset.id);
    changed({ rerender: true });
  });
}

/* ------------------------------------------------------- view switching */

function setDevice(device) {
  $('#frame-wrap').dataset.device = device;
  document.querySelectorAll('.cfg-devices [data-device]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.device === device)));
}

function setView(view, { onlyMobile = false } = {}) {
  if (onlyMobile && !matchMedia('(max-width: 900px)').matches) return;
  document.body.classList.toggle('view-preview', view === 'preview');
  document.body.classList.toggle('view-settings', view !== 'preview');
  document.querySelectorAll('[data-view]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
}

/* ------------------------------------------------------------- ZIP export */

const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg', 'image/avif': 'avif' };

function dataUrlToBlob(dataUrl) {
  const [head, data] = dataUrl.split(',');
  const mime = head.match(/^data:([^;]+)/)[1];
  const binary = head.includes(';base64') ? atob(data) : decodeURIComponent(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { blob: new Blob([bytes], { type: mime }), ext: EXT[mime] || 'bin' };
}

/** Moves embedded (uploaded) images into real files and rewrites the config paths. */
function extractUploads(cfg, zip) {
  let n = 0;
  const walk = (obj, prefix) => {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string' && v.startsWith('data:image/')) {
        const { blob, ext } = dataUrlToBlob(v);
        const name = `assets/uploads/${slugify(prefix + '-' + k)}-${++n}.${ext}`;
        zip.file(name, blob);
        obj[k] = name;
      } else if (v && typeof v === 'object') walk(v, `${prefix}-${k}`);
    }
  };
  walk(cfg, 'img');
}

async function exportZip(btn) {
  const label = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Csomagolás…';
  try {
    const zip = new JSZip();
    const cfg = clone(config);
    extractUploads(cfg, zip);
    const [template, manifest] = await Promise.all([
      fetch('template.html').then((r) => r.text()),
      fetch('export-manifest.json').then((r) => r.json()),
    ]);
    // Skip bundled sample images the client no longer references.
    const used = JSON.stringify(cfg);
    const files = manifest.filter((f) => !f.startsWith('assets/gallery/') || used.includes(f));
    await Promise.all(files.map(async (f) => {
      const res = await fetch(f);
      if (!res.ok) throw new Error(`${f}: ${res.status}`);
      zip.file(f, await res.blob());
    }));
    zip.file('index.html', buildPage(template, cfg));
    zip.file('site.config.json', JSON.stringify(cfg, null, 2));
    zip.file('sitemap.xml', buildSitemap(cfg));
    zip.file('robots.txt', buildRobots(cfg));
    zip.file('OLVASSEL.txt', `${cfg.brand.name} – weboldal\n\nTöltsd fel a mappa teljes tartalmát a tárhelyed gyökérkönyvtárába (pl. public_html).\nA kezdőoldal az index.html. A beállítások a site.config.json fájlban vannak; ezt a konfigurátorba visszatöltve később is módosíthatod az oldalt.\nNe felejtsd el a site.config.json "meta.siteUrl" mezőjében megadni a végleges domaint (SEO, sitemap).\n`);
    const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
    download(blob, `${slugify(cfg.brand.name)}-weboldal.zip`);
    toast('A weboldal letöltése elkezdődött ✓');
  } catch (err) {
    console.error(err);
    toast('Az export nem sikerült. A ZIP exporthoz a buildelt (dist) konfigurátort használd.', 'err');
  } finally {
    btn.disabled = false;
    btn.textContent = label;
  }
}

/* ------------------------------------------------------------------ boot */

async function boot() {
  defaults = await fetch('site.config.json').then((r) => r.json());
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    step = Number(localStorage.getItem(STEP_KEY)) || 0;
  } catch { /* storage unavailable */ }
  config = saved ? mergeDefaults(defaults, saved) : clone(defaults);
  $('#save-status').textContent = saved ? 'Korábbi munkamenet visszatöltve' : 'A módosítások automatikusan mentődnek';

  const panel = $('#panel');
  panel.addEventListener('input', (e) => { if (e.target.type !== 'file') onInput(e); });
  panel.addEventListener('change', (e) => (e.target.type === 'file' ? onFile(e) : onInput(e)));
  panel.addEventListener('focusin', onFocus);
  panel.addEventListener('toggle', onToggleGroup, true);
  panel.addEventListener('submit', (e) => e.preventDefault());
  document.addEventListener('click', onClick);
  window.addEventListener('message', (e) => {
    if (e.origin === location.origin && e.data?.type === 'preview-ready') sendToPreview();
  });
  frame().addEventListener('load', sendToPreview);

  renderStep();
  sendToPreview();
}

boot().catch((err) => {
  console.error(err);
  $('#save-status').textContent = 'Hiba: a site.config.json nem tölthető be.';
});
