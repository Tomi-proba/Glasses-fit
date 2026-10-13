// /tervezo: builds a site config (pages made of blocks + a global theme), streams it to the
// live preview (iframe of /sablon/elonezet) and autosaves it for /osszegzes.
import { FONTS, SOCIAL_LABELS, SOCIAL_TYPES, THEME_PRESETS, contrast, esc, icon } from '../template/render.js';
import { BLOCK_TYPES, BLOCK_ORDER, ICON_CHOICES, createBlock, duplicateBlock, withDefaults, newId, slugify } from '../template/blocks.js';
import { SAMPLES, blankConfig, sampleConfig } from '../template/samples.js';
import { loadConfig, saveConfig, loadStep, saveStep, hasSavedConfig } from './store.js';
import { suggestCopy, AI_COPY_ENABLED } from './ai-copy.js';

const BASE = document.documentElement.dataset.base || '/';
const $ = (sel, root = document) => root.querySelector(sel);

const PALETTE = ['#00d4ff', '#3b6cff', '#7c5cff', '#ff4d8d', '#ff5d4f', '#ff8a2a', '#e2b04a', '#16a37a', '#8fb996', '#f2f2ef', '#121314'];

let config = null;
let step = 0;
const ui = { pageId: null, openBlock: null, picker: false, customLinks: new Set() };

/* ------------------------------------------------------------- utilities */

const clone = (v) => structuredClone(v);
const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
function setPath(obj, path, value) {
  const keys = path.split('.');
  let o = obj;
  keys.slice(0, -1).forEach((k, i) => {
    if (o[k] == null) o[k] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    o = o[k];
  });
  o[keys.at(-1)] = value;
}
const pages = () => config.pages;
const pageIndex = () => Math.max(0, pages().findIndex((p) => p.id === ui.pageId));
const currentPage = () => pages()[pageIndex()];

function toast(message, { kind = 'ok', action } = {}) {
  const el = $('#toast');
  el.innerHTML = `<span>${esc(message)}</span>${action ? `<button type="button" class="toast-action">${esc(action.label)}</button>` : ''}`;
  el.dataset.kind = kind;
  el.hidden = false;
  if (action) el.querySelector('.toast-action').onclick = () => { el.hidden = true; action.run(); };
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { el.hidden = true; }, action ? 8000 : 3000);
}

function readImage(file, maxSize, keepAlpha = false) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Csak képfájlt lehet feltölteni (JPG, PNG, WebP vagy SVG).'));
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      if (file.type === 'image/svg+xml') return resolve(reader.result);
      const img = new Image();
      img.onerror = () => reject(new Error('Ezt a képet nem sikerült beolvasni. Próbáld JPG vagy PNG formátumban.'));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/webp', keepAlpha ? 0.9 : 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
const thumbSrc = (v) => (!v || /^(data:|https?:|\/)/.test(v) ? v : `${BASE}template/${v}`);

/* --------------------------------------------------------- form controls */

const uid = (() => { let n = 0; return () => `f${++n}`; })();
const hintEl = (id, hint) => (hint ? `<p class="hint" id="${id}-hint">${esc(hint)}</p>` : '');
const described = (id, hint) => (hint ? ` aria-describedby="${id}-hint"` : '');

function textInput(label, path, { type = 'text', hint = '', rows = 0, placeholder = '', kind = '', list = '' } = {}) {
  const id = uid();
  let value = getPath(config, path) ?? '';
  if (kind === 'paragraphs') value = (Array.isArray(value) ? value : [value]).join('\n\n');
  const attrs = `id="${id}" data-path="${esc(path)}"${kind ? ` data-kind="${kind}"` : ''} placeholder="${esc(placeholder)}"${described(id, hint)}${list ? ` list="${list}"` : ''}`;
  const control = rows ? `<textarea ${attrs} rows="${rows}">${esc(value)}</textarea>` : `<input ${attrs} type="${type}" value="${esc(value)}">`;
  return `<div class="field"><label for="${id}">${esc(label)}</label>${control}${hintEl(id, hint)}</div>`;
}

function select(label, path, options, { number = false, hint = '' } = {}) {
  const id = uid();
  const value = getPath(config, path);
  const opts = options.map(([v, text]) => `<option value="${esc(v)}"${String(v) === String(value) ? ' selected' : ''}>${esc(text)}</option>`).join('');
  return `<div class="field"><label for="${id}">${esc(label)}</label><select id="${id}" data-path="${esc(path)}"${number ? ' data-kind="number"' : ''}${described(id, hint)}>${opts}</select>${hintEl(id, hint)}</div>`;
}

function toggle(label, path) {
  const id = uid();
  return `<div class="field toggle-field"><label class="switch-row" for="${id}"><span>${esc(label)}</span><span class="switch"><input id="${id}" type="checkbox" data-path="${esc(path)}" ${getPath(config, path) ? 'checked' : ''}><span class="track" aria-hidden="true"></span></span></label></div>`;
}

function imageField(label, path, { alt, maxSize = 1600, hint = '', alpha = false } = {}) {
  const id = uid();
  const value = getPath(config, path);
  return `<div class="field img-field">
    <span class="label">${esc(label)}</span>
    <div class="img-row">
      <div class="thumb">${value ? `<img src="${esc(thumbSrc(value))}" alt="">` : '<span>Nincs kép</span>'}</div>
      <div class="img-actions">
        <label class="btn btn-sm btn-ghost file-btn" for="${id}">${icon('upload')} Feltöltés<input id="${id}" type="file" accept="image/*" data-image="${esc(path)}" data-max="${maxSize}"${alpha ? ' data-alpha="1"' : ''}></label>
        ${value ? `<button type="button" class="btn btn-sm btn-ghost" data-action="clear-image" data-path="${esc(path)}">Eltávolítás</button>` : ''}
      </div>
    </div>
    ${hint ? `<p class="hint">${esc(hint)}</p>` : ''}
    ${alt ? textInput('Képleírás (alt szöveg)', alt, { hint: 'Röviden, mi látható a képen. Képernyőolvasók és a Google is ezt olvassa.' }) : ''}
  </div>`;
}

function colorField(label, path) {
  const id = uid();
  const value = getPath(config, path) || '#000000';
  return `<div class="field"><label for="${id}-hex">${esc(label)}</label><div class="color-row">
    <input type="color" value="${esc(value)}" data-path="${esc(path)}" aria-label="${esc(label)} színválasztó">
    <input type="text" id="${id}-hex" value="${esc(value)}" data-path="${esc(path)}" data-kind="hex" maxlength="7" spellcheck="false">
  </div></div>`;
}

/** Link targets: another page, the contact form, or a custom URL (tel:, mailto:, https://). */
function linkField(label, path, hint = '') {
  const id = uid();
  const value = String(getPath(config, path) || '');
  const options = [['', 'Nincs'], ['contact', 'Kapcsolat űrlap'], ...pages().map((p) => [`page:${p.id}`, `Oldal: ${p.title}`])];
  const custom = ui.customLinks.has(path) || (value && !options.some(([v]) => v === value));
  const opts = [...options, ['__custom', 'Egyedi link…']].map(([v, t]) => `<option value="${esc(v)}"${(custom ? v === '__custom' : v === value) ? ' selected' : ''}>${esc(t)}</option>`).join('');
  return `<div class="field"><label for="${id}">${esc(label)}</label><select id="${id}" data-link="${esc(path)}"${described(id, hint)}>${opts}</select>
    ${custom ? `<input type="text" data-path="${esc(path)}" value="${esc(value)}" placeholder="https://… vagy tel:+36…" aria-label="${esc(label)}: egyedi link">` : ''}${hintEl(id, hint)}</div>`;
}

function itemTools(list, i, length, label) {
  return `<div class="item-tools">
    <button type="button" class="icon-btn" data-action="move" data-list="${esc(list)}" data-index="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="${esc(label)} feljebb">${icon('arrowUp')}</button>
    <button type="button" class="icon-btn" data-action="move" data-list="${esc(list)}" data-index="${i}" data-dir="1" ${i === length - 1 ? 'disabled' : ''} aria-label="${esc(label)} lejjebb">${icon('arrowDown')}</button>
    <button type="button" class="icon-btn danger" data-action="remove" data-list="${esc(list)}" data-index="${i}" aria-label="${esc(label)} törlése">${icon('close')}</button>
  </div>`;
}

/** Renders one field of a block definition at `path`. */
function renderField(def, path) {
  switch (def.type) {
    case 'text': return textInput(def.label, path, { hint: def.hint });
    case 'textarea': return textInput(def.label, path, { rows: def.rows || 3, hint: def.hint });
    case 'paragraphs': return textInput(def.label, path, { rows: def.rows || 5, hint: def.hint, kind: 'paragraphs' });
    case 'markdown': return textInput(def.label, path, { rows: def.rows || 8, hint: def.hint });
    case 'select': return select(def.label, path, def.options, { number: def.number, hint: def.hint });
    case 'toggle': return toggle(def.label, path);
    case 'link': return linkField(def.label, path, def.hint);
    case 'icon': return select(def.label, path, ICON_CHOICES.map((n) => [n, n]));
    case 'image': return imageField(def.label, path, { alt: def.alt ? path.replace(/[^.]+$/, def.alt) : '', maxSize: def.maxSize, alpha: def.alpha, hint: def.hint });
    case 'list': {
      const items = getPath(config, path) || [];
      return `<div class="field list-field"><span class="label">${esc(def.label)}</span>
        ${items.map((it, i) => `<div class="item"><div class="item-head"><strong>${esc(it[def.itemLabel] || `${i + 1}.`)}</strong>${itemTools(path, i, items.length, it[def.itemLabel] || def.label)}</div>
          ${def.fields.map((f) => renderField(f, `${path}.${i}.${f.key}`)).join('')}</div>`).join('')}
        <button type="button" class="btn btn-sm btn-ghost" data-action="add-item" data-list="${esc(path)}" data-block-field="${esc(def.key)}">${icon('plus')} Új elem</button>
      </div>`;
    }
    default: return '';
  }
}

const sub = (text) => `<h3 class="sub">${esc(text)}</h3>`;

/* ------------------------------------------------------------------ steps */

const STEPS = [
  {
    title: 'Kezdés',
    lead: 'Indulj egy mintából vagy üres lappal, és add meg az alapadatokat. Később minden módosítható.',
    render: () => `
      <div class="starts">
        <button type="button" class="start" data-action="start" data-sample=""><span class="start-art blank">${icon('plus')}</span><span><strong>Kezdj üresen</strong><small>Néhány alapblokk, semleges stílus</small></span></button>
        ${SAMPLES.map((s) => `<button type="button" class="start" data-action="start" data-sample="${s.id}"><span class="start-art" style="--a:${esc(s.config.theme.colors.primary)};--b:${esc(s.config.theme.colors.background)}"></span><span><strong>${esc(s.label)}</strong><small>${esc(s.style)}</small></span></button>`).join('')}
      </div>
      <p class="hint">A minta csak kiindulópont: lecseréli a mostani tervet, de az előzőt egy kattintással visszahozhatod.</p>
      ${sub('Alapadatok')}
      ${textInput('Cégnév', 'brand.name', { placeholder: 'pl. Mancs Kutyakozmetika' })}
      ${textInput('Tevékenység', 'brand.activity', { placeholder: 'Bármi lehet: kutyakozmetika, könyvelőiroda, DJ…', hint: 'Szabadon írd be. A szövegjavaslat és a keresőknek szóló leírás is ebből indul ki.', list: 'activity-ideas' })}
      <datalist id="activity-ideas">${['fodrászszalon', 'kutyakozmetika', 'könyvelőiroda', 'DJ', 'fotós', 'étterem', 'masszőr', 'villanyszerelő', 'ügyvédi iroda', 'edzőstúdió', 'cukrászda', 'autószerviz'].map((a) => `<option value="${a}"></option>`).join('')}</datalist>
      ${textInput('Szlogen', 'brand.tagline')}
      <div class="suggest">
        <button type="button" class="btn btn-sm btn-ghost" data-action="suggest">${icon('magic')} Szöveg javaslat</button>
        <p class="hint">${AI_COPY_ENABLED ? 'A cégnév és a tevékenység alapján megírjuk a fő szövegeket.' : 'Előzetes változat: egyszerű sablonszövegeket ad. Hamarosan mesterséges intelligencia írja meg a szövegeket a megadott adatokból.'}</p>
      </div>
      ${imageField('Logó', 'brand.logo', { maxSize: 400, alpha: true, alt: 'brand.logoAlt', hint: 'Négyzetes SVG vagy PNG ajánlott. Ha üres, csak a cégnév jelenik meg.' })}
      <div class="row">${textInput('Fejléc gomb szövege', 'brand.ctaText', { hint: 'Üresen hagyva nincs gomb.' })}${linkField('Fejléc gomb célja', 'brand.ctaLink')}</div>
      ${sub('Kereső és megosztás')}
      ${textInput('Oldal címe (böngészőfül, Google)', 'meta.title', { hint: 'Ideálisan 50-60 karakter.' })}
      ${textInput('Leírás (Google találat)', 'meta.description', { rows: 3, hint: 'Ideálisan 120-160 karakter.' })}`,
  },
  {
    title: 'Stílus',
    lead: 'Színek, betűk, formák és mozgás. Minden változás azonnal látszik.',
    render: () => {
      const t = config.theme;
      const fonts = Object.keys(FONTS).map((f) => [f, f]);
      const swatches = PALETTE.map((hex) => `<button type="button" class="swatch${hex === t.colors.primary ? ' on' : ''}" style="--c:${hex}" data-action="swatch" data-value="${hex}" aria-label="Fő szín: ${hex}" aria-pressed="${hex === t.colors.primary}"></button>`).join('');
      const rgb = (h) => String(h).replace('#', '').match(/.{2}/g).map((x) => parseInt(x, 16));
      const lowAccent = contrast(rgb(t.colors.accent), rgb(t.colors.background)) < 3;
      return `
      <div class="field"><span class="label">Téma</span>
        <div class="segmented" role="radiogroup" aria-label="Téma">
          <label><input type="radio" name="mode" value="dark" data-action-change="mode" ${t.mode !== 'light' ? 'checked' : ''}><span>Sötét</span></label>
          <label><input type="radio" name="mode" value="light" data-action-change="mode" ${t.mode === 'light' ? 'checked' : ''}><span>Világos</span></label>
        </div>
        <p class="hint">A téma váltása beállítja a háttér és a szöveg színét. Utána ezeket is egyenként módosíthatod.</p>
      </div>
      <div class="field"><span class="label">Gyors választás a fő színhez</span><div class="swatches">${swatches}</div></div>
      <div class="row">${colorField('Fő szín (gombok)', 'theme.colors.primary')}${colorField('Kiemelő szín', 'theme.colors.accent')}</div>
      <div class="row">${colorField('Háttér', 'theme.colors.background')}${colorField('Szöveg', 'theme.colors.text')}</div>
      ${lowAccent ? '<p class="hint">A kiemelő szín halvány ezen a háttéren, ezért szövegben automatikusan kontrasztosabb árnyalatát használjuk.</p>' : ''}
      ${sub('Tipográfia')}
      <div class="row">${select('Címsor betűtípus', 'theme.headingFont', fonts)}${select('Szöveg betűtípus', 'theme.bodyFont', fonts)}</div>
      ${select('Címsorok', 'theme.headingCase', [['normal', 'Normál'], ['upper', 'NAGYBETŰS, ritkított']])}
      <div class="field"><label for="fs">Betűméret: <output id="fs-out">${Math.round(t.fontScale * 100)}%</output></label><input id="fs" type="range" min="0.85" max="1.25" step="0.05" value="${t.fontScale}" data-path="theme.fontScale" data-kind="number"></div>
      ${sub('Formák')}
      <div class="field"><label for="rad">Lekerekítés: <output id="rad-out">${t.radius}px</output></label><input id="rad" type="range" min="0" max="32" step="2" value="${t.radius}" data-path="theme.radius" data-kind="number"></div>
      <div class="row">${select('Árnyékok', 'theme.shadow', [['none', 'Nincs'], ['soft', 'Lágy'], ['strong', 'Erős']])}${select('Térközök', 'theme.spacing', [['compact', 'Tömör'], ['normal', 'Normál'], ['airy', 'Levegős']])}</div>
      <div class="row">${select('Gomb forma', 'theme.buttonShape', [['pill', 'Kerek'], ['rounded', 'Lekerekített'], ['square', 'Szögletes']])}${select('Gomb stílus', 'theme.buttonStyle', [['solid', 'Kitöltött'], ['outline', 'Körvonalas']])}</div>
      ${sub('Mozgás')}
      ${select('Animációk erőssége', 'theme.motion', [['none', 'Nincs'], ['subtle', 'Visszafogott'], ['normal', 'Normál'], ['strong', 'Erős']], { hint: 'A „csökkentett mozgás” beállítású eszközökön mindig kikapcsol.' })}`;
    },
  },
  {
    title: 'Oldalak és blokkok',
    lead: 'Állítsd össze az oldalakat blokkokból. Hozzáadhatsz, duplikálhatsz, törölhetsz és húzással rendezhetsz.',
    render: () => {
      const page = currentPage();
      const pageTabs = pages().map((p, i) => `<li class="page-tab${p.id === page.id ? ' on' : ''}" draggable="${i > 0}" data-page-index="${i}">
          <button type="button" data-action="select-page" data-page="${esc(p.id)}" aria-pressed="${p.id === page.id}">${esc(p.title)}</button></li>`).join('');
      const blocks = (page.blocks || []).map((raw, i, arr) => {
        const b = withDefaults(raw);
        const def = BLOCK_TYPES[b.type];
        const open = ui.openBlock === b.id;
        const path = `pages.${pageIndex()}.blocks.${i}`;
        const summary = b.title || b.subtitle || (typeof b.body === 'string' ? b.body.replace(/[#*[\]]/g, '').slice(0, 48) : '') || def.hint;
        return `<li class="blk${open ? ' open' : ''}${b.hidden ? ' is-hidden' : ''}" draggable="true" data-block-index="${i}" data-block-id="${esc(b.id)}">
          <div class="blk-row">
            <span class="handle" aria-hidden="true">${icon('drag')}</span>
            <button type="button" class="blk-main" data-action="open-block" data-id="${esc(b.id)}" aria-expanded="${open}">
              <span class="blk-icon">${icon(def.icon)}</span><span class="blk-text"><strong>${esc(def.label)}${b.hidden ? ' (elrejtve)' : ''}</strong><small>${esc(summary)}</small></span>
            </button>
            <div class="item-tools">
              <button type="button" class="icon-btn" data-action="move-block" data-index="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} aria-label="${esc(def.label)} feljebb">${icon('arrowUp')}</button>
              <button type="button" class="icon-btn" data-action="move-block" data-index="${i}" data-dir="1" ${i === arr.length - 1 ? 'disabled' : ''} aria-label="${esc(def.label)} lejjebb">${icon('arrowDown')}</button>
              <button type="button" class="icon-btn" data-action="duplicate-block" data-index="${i}" aria-label="${esc(def.label)} duplikálása" title="Duplikálás">${icon('copy')}</button>
              <button type="button" class="icon-btn danger" data-action="delete-block" data-index="${i}" aria-label="${esc(def.label)} törlése" title="Törlés">${icon('trash')}</button>
            </div>
          </div>
          ${open ? `<div class="blk-editor">${def.fields.map((f) => renderField(f, `${path}.${f.key}`)).join('')}</div>` : ''}
        </li>`;
      }).join('');
      const picker = ui.picker ? `<div class="picker" role="group" aria-label="Válassz blokktípust">
          <div class="picker-head"><strong>Milyen blokk legyen?</strong><button type="button" class="icon-btn" data-action="close-picker" aria-label="Bezárás">${icon('close')}</button></div>
          <div class="picker-grid">${BLOCK_ORDER.map((t) => `<button type="button" class="pick" data-action="add-block" data-type="${t}">${icon(BLOCK_TYPES[t].icon)}<span><strong>${esc(BLOCK_TYPES[t].label)}</strong><small>${esc(BLOCK_TYPES[t].hint)}</small></span></button>`).join('')}</div>
        </div>` : '';
      return `
        <div class="pages-bar">
          <ul class="page-tabs" id="page-tabs" role="list">${pageTabs}</ul>
          <button type="button" class="btn btn-sm btn-ghost" data-action="add-page">${icon('plus')} Új oldal</button>
        </div>
        <details class="group page-settings"><summary>Oldal beállításai: ${esc(page.title)}${icon('plus')}</summary><div class="group-body">
          ${textInput('Oldal neve (menüben)', `pages.${pageIndex()}.title`, { hint: pageIndex() === 0 ? 'Ez a kezdőoldal.' : `Webcím: /${page.slug}/` })}
          ${toggle('Megjelenik a menüben', `pages.${pageIndex()}.showInNav`)}
          ${pageIndex() > 0 ? `<div class="row-actions">
            <button type="button" class="btn btn-sm btn-ghost" data-action="move-page" data-dir="-1" ${pageIndex() <= 1 ? 'disabled' : ''}>${icon('arrowUp')} Előrébb</button>
            <button type="button" class="btn btn-sm btn-ghost" data-action="move-page" data-dir="1" ${pageIndex() === pages().length - 1 ? 'disabled' : ''}>${icon('arrowDown')} Hátrébb</button>
            <button type="button" class="btn btn-sm btn-ghost danger-text" data-action="delete-page">${icon('trash')} Oldal törlése</button></div>` : ''}
        </div></details>
        <ul class="blk-list" id="blk-list" role="list">${blocks || '<li class="empty">Ez az oldal még üres. Adj hozzá egy blokkot.</li>'}</ul>
        ${picker || `<button type="button" class="btn add-block" data-action="open-picker">${icon('plus')} Blokk hozzáadása</button>`}`;
    },
  },
  {
    title: 'Elérhetőségek',
    lead: 'Ezeket használja a kapcsolat blokk, a térkép és a lábléc.',
    render: () => {
      const hours = config.contact.hours.map((h, i, arr) => `<div class="item compact"><div class="row">${textInput('Napok', `contact.hours.${i}.days`)}${textInput('Időpont', `contact.hours.${i}.time`)}</div>${itemTools('contact.hours', i, arr.length, h.days || 'Sor')}</div>`).join('');
      const social = config.social.map((s, i, arr) => `<div class="item compact"><div class="row">${select('Platform', `social.${i}.type`, SOCIAL_TYPES.map((t) => [t, SOCIAL_LABELS[t]]))}${textInput('Link', `social.${i}.url`, { type: 'url', placeholder: 'https://' })}</div>${itemTools('social', i, arr.length, SOCIAL_LABELS[s.type] || 'Profil')}</div>`).join('');
      return `
        ${textInput('Cím', 'contact.address', { hint: 'A térkép blokk is ezt mutatja, ha ott nem adsz meg mást.' })}
        <div class="row">${textInput('Telefon', 'contact.phone', { type: 'tel' })}${textInput('E-mail', 'contact.email', { type: 'email' })}</div>
        ${sub('Nyitvatartás')}${hours}<button type="button" class="btn btn-sm btn-ghost" data-action="add-row" data-list="contact.hours">${icon('plus')} Sor</button>
        ${sub('Közösségi média')}${social}<button type="button" class="btn btn-sm btn-ghost" data-action="add-row" data-list="social">${icon('plus')} Profil</button>
        ${sub('Lábléc')}${textInput('Lábléc szöveg', 'footer.text')}${textInput('Copyright szöveg', 'footer.copyright')}`;
    },
  },
];

const NEW_ROWS = { 'contact.hours': () => ({ days: 'Nap', time: '9:00-17:00' }), social: () => ({ type: 'instagram', url: '' }) };

/* -------------------------------------------------------------- rendering */

function renderProgress() {
  $('#steps').innerHTML = STEPS.map((s, i) => `<li><button type="button" data-step="${i}" ${i === step ? 'aria-current="step"' : ''} class="${i < step ? 'done' : ''}">
      <span class="num">${i < step ? icon('check') : i + 1}</span><span class="txt">${esc(s.title)}</span></button></li>`).join('');
  $('#progress-text').textContent = `${step + 1}/${STEPS.length} lépés`;
  $('#progress-bar').style.width = `${((step + 1) / STEPS.length) * 100}%`;
  $('[data-action="prev"]').disabled = step === 0;
  const next = $('#next-link');
  const last = step === STEPS.length - 1;
  next.textContent = last ? 'Tovább az összegzéshez' : 'Tovább';
  next.dataset.last = last ? '1' : '';
}

function renderStep({ keepScroll = false } = {}) {
  const body = $('#step-body');
  const scroll = body.scrollTop;
  const s = STEPS[step];
  body.innerHTML = `<h2 tabindex="-1">${esc(s.title)}</h2><p class="lead">${esc(s.lead)}</p>${s.render()}`;
  body.scrollTop = keepScroll ? scroll : 0;
  renderProgress();
  if (step === 2) initDragSort();
}

function goTo(i) {
  step = Math.max(0, Math.min(STEPS.length - 1, i));
  saveStep(step);
  renderStep();
  $('#step-body h2').focus({ preventScroll: true });
}

/* -------------------------------------------------- preview + autosave */

const frame = () => $('#preview');
let sendQueued = false;
let pendingAnchor = '';
function sendToPreview() {
  if (sendQueued) return;
  sendQueued = true;
  requestAnimationFrame(() => {
    sendQueued = false;
    frame().contentWindow?.postMessage({ type: 'site-config', config, pageId: currentPage().id, anchor: pendingAnchor }, location.origin);
    pendingAnchor = '';
  });
}
const scrollPreviewTo = (blockId) => frame().contentWindow?.postMessage({ type: 'scroll-to', blockId }, location.origin);

let saveTimer;
function save() {
  $('#save-status').textContent = 'Mentés…';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    $('#save-status').textContent = saveConfig(config) ? 'Mentve ebben a böngészőben' : 'Nem sikerült menteni, valószínűleg túl nagyok a képek.';
  }, 350);
}

function changed({ rerender = false } = {}) {
  sendToPreview();
  save();
  if (rerender) renderStep({ keepScroll: true });
}

/* ------------------------------------------------------------------ events */

function uniqueSlug(title, id) {
  const base = slugify(title);
  let slug = base;
  for (let n = 2; pages().some((p) => p.id !== id && p.slug === slug); n++) slug = `${base}-${n}`;
  return slug;
}

function onInput(e) {
  const el = e.target;
  if (el.dataset.link) {
    if (e.type !== 'change') return;
    if (el.value === '__custom') {
      ui.customLinks.add(el.dataset.link);
      setPath(config, el.dataset.link, '');
    } else {
      ui.customLinks.delete(el.dataset.link);
      setPath(config, el.dataset.link, el.value);
    }
    changed({ rerender: true });
    return;
  }
  if (el.dataset.actionChange === 'mode') {
    if (e.type !== 'change') return;
    config.theme.mode = el.value;
    Object.assign(config.theme.colors, THEME_PRESETS[el.value]);
    changed({ rerender: true });
    return;
  }
  const path = el.dataset.path;
  if (!path) return;
  let value = el.value;
  if (el.type === 'checkbox') value = el.checked;
  else if (el.dataset.kind === 'number') value = Number(value);
  else if (el.dataset.kind === 'paragraphs') value = value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  else if (el.dataset.kind === 'hex' && !/^#[0-9a-f]{6}$/i.test(value)) return;
  setPath(config, path, value);

  if (/^theme\.colors\./.test(path)) el.closest('.color-row')?.querySelectorAll('input').forEach((i) => { if (i !== el) i.value = value; });
  if (path === 'theme.fontScale') $('#fs-out').textContent = `${Math.round(value * 100)}%`;
  if (path === 'theme.radius') $('#rad-out').textContent = `${value}px`;
  if (/^pages\.\d+\.title$/.test(path)) {
    const page = getPath(config, path.replace(/\.title$/, ''));
    if (pages().indexOf(page) > 0) page.slug = uniqueSlug(value, page.id);
  }
  const rerender = e.type === 'change' && (el.type === 'checkbox' || el.tagName === 'SELECT' || /^theme\.colors\./.test(path) || /^pages\.\d+\.title$/.test(path));
  changed({ rerender });
}

async function onFile(e) {
  const input = e.target;
  const file = input.files?.[0];
  if (!input.dataset.image || !file) return;
  try {
    setPath(config, input.dataset.image, await readImage(file, Number(input.dataset.max) || 1600, input.dataset.alpha === '1'));
    changed({ rerender: true });
    toast('Kép feltöltve');
  } catch (err) {
    toast(err.message || 'A kép feltöltése nem sikerült.', { kind: 'err' });
  }
}

async function onSuggest(btn) {
  btn.disabled = true;
  const label = btn.innerHTML;
  btn.textContent = 'Írom…';
  try {
    const s = await suggestCopy({ name: config.brand.name, activity: config.brand.activity, tagline: config.brand.tagline });
    const before = clone(config);
    config.brand.tagline = s.tagline;
    for (const p of pages()) for (const b of p.blocks || []) if (b.type === 'hero') Object.assign(b, { title: s.heroTitle, subtitle: s.heroSubtitle });
    const text = pages()[0].blocks.find((b) => b.type === 'text' || b.type === 'imageText');
    if (text) Object.assign(text, { title: s.aboutTitle, body: s.aboutText });
    changed({ rerender: true });
    toast('Beírtuk a javasolt szövegeket.', { action: { label: 'Visszavonás', run: () => { config = before; changed({ rerender: true }); } } });
  } finally {
    btn.disabled = false;
    btn.innerHTML = label;
  }
}

function startWith(sampleId) {
  const before = clone(config);
  config = sampleId ? sampleConfig(sampleId) : blankConfig();
  ui.pageId = config.pages[0].id;
  ui.openBlock = null;
  changed({ rerender: true });
  toast(sampleId ? 'Betöltöttük a mintát. Minden része módosítható.' : 'Üres lappal indulsz.', {
    action: { label: 'Előző terv vissza', run: () => { config = before; ui.pageId = config.pages[0].id; changed({ rerender: true }); } },
  });
}

const blocksOf = () => currentPage().blocks;

function onClick(e) {
  const stepBtn = e.target.closest('[data-step]');
  if (stepBtn) {
    setView('settings');
    goTo(Number(stepBtn.dataset.step));
    return;
  }
  const deviceBtn = e.target.closest('button[data-device]');
  if (deviceBtn) return setDevice(deviceBtn.dataset.device);
  const viewBtn = e.target.closest('button[data-view]');
  if (viewBtn) return setView(viewBtn.dataset.view);
  if (e.target.closest('#next-link') && step < STEPS.length - 1) {
    e.preventDefault();
    goTo(step + 1);
    return;
  }

  const btn = e.target.closest('[data-action]');
  if (!btn || btn.tagName === 'INPUT') return;
  const { action } = btn.dataset;
  const index = Number(btn.dataset.index);
  switch (action) {
    case 'prev': goTo(step - 1); break;
    case 'start': startWith(btn.dataset.sample); break;
    case 'suggest': onSuggest(btn); break;
    case 'swatch':
      config.theme.colors.primary = btn.dataset.value;
      config.theme.colors.accent = btn.dataset.value;
      changed({ rerender: true });
      break;
    case 'clear-image':
      setPath(config, btn.dataset.path, '');
      changed({ rerender: true });
      break;

    case 'select-page':
      ui.pageId = btn.dataset.page;
      ui.openBlock = null;
      changed({ rerender: true });
      break;
    case 'add-page': {
      const id = newId();
      const title = `Új oldal ${pages().length}`;
      pages().push({ id, title, slug: uniqueSlug(title, id), showInNav: true, blocks: [createBlock('text')] });
      ui.pageId = id;
      changed({ rerender: true });
      $('.page-settings')?.setAttribute('open', '');
      break;
    }
    case 'move-page': {
      const i = pageIndex();
      const to = i + Number(btn.dataset.dir);
      if (to < 1 || to >= pages().length) break;
      [pages()[i], pages()[to]] = [pages()[to], pages()[i]];
      changed({ rerender: true });
      break;
    }
    case 'delete-page': {
      if (btn.dataset.armed !== '1') {
        btn.dataset.armed = '1';
        btn.textContent = 'Biztos? Kattints újra';
        break;
      }
      const at = pageIndex();
      const [removed] = pages().splice(at, 1);
      ui.pageId = pages()[0].id;
      changed({ rerender: true });
      toast(`Töröltük: ${removed.title}`, { action: { label: 'Visszavonás', run: () => { pages().splice(at, 0, removed); ui.pageId = removed.id; changed({ rerender: true }); } } });
      break;
    }

    case 'open-picker': ui.picker = true; renderStep({ keepScroll: true }); break;
    case 'close-picker': ui.picker = false; renderStep({ keepScroll: true }); break;
    case 'add-block': {
      const block = createBlock(btn.dataset.type);
      blocksOf().push(block);
      ui.picker = false;
      ui.openBlock = block.id;
      pendingAnchor = `b-${block.id}`;
      changed({ rerender: true });
      requestAnimationFrame(() => {
        // Scroll only the settings panel, never the page.
        const el = $(`[data-block-id="${block.id}"]`);
        const body = $('#step-body');
        if (el) body.scrollTop += el.getBoundingClientRect().top - body.getBoundingClientRect().top - 12;
      });
      break;
    }
    case 'open-block':
      ui.openBlock = ui.openBlock === btn.dataset.id ? null : btn.dataset.id;
      renderStep({ keepScroll: true });
      if (ui.openBlock) scrollPreviewTo(ui.openBlock);
      break;
    case 'move-block': {
      const list = blocksOf();
      const to = index + Number(btn.dataset.dir);
      if (to < 0 || to >= list.length) break;
      [list[index], list[to]] = [list[to], list[index]];
      changed({ rerender: true });
      requestAnimationFrame(() => $(`[data-action="move-block"][data-index="${to}"][data-dir="${btn.dataset.dir}"]`)?.focus());
      break;
    }
    case 'duplicate-block': {
      const copy = duplicateBlock(blocksOf()[index]);
      blocksOf().splice(index + 1, 0, copy);
      ui.openBlock = copy.id;
      changed({ rerender: true });
      break;
    }
    case 'delete-block': {
      const [removed] = blocksOf().splice(index, 1);
      const pageId = currentPage().id;
      changed({ rerender: true });
      toast(`Töröltük: ${BLOCK_TYPES[removed.type].label}`, { action: { label: 'Visszavonás', run: () => { pages().find((p) => p.id === pageId)?.blocks.splice(index, 0, removed); changed({ rerender: true }); } } });
      break;
    }

    case 'add-item': {
      const list = getPath(config, btn.dataset.list);
      const block = getPath(config, btn.dataset.list.split('.').slice(0, 4).join('.'));
      list.push(BLOCK_TYPES[block.type].fields.find((f) => f.key === btn.dataset.blockField).newItem());
      changed({ rerender: true });
      break;
    }
    case 'add-row':
      getPath(config, btn.dataset.list).push(NEW_ROWS[btn.dataset.list]());
      changed({ rerender: true });
      break;
    case 'remove':
      getPath(config, btn.dataset.list).splice(index, 1);
      changed({ rerender: true });
      break;
    case 'move': {
      const arr = getPath(config, btn.dataset.list);
      const to = index + Number(btn.dataset.dir);
      if (to < 0 || to >= arr.length) break;
      [arr[index], arr[to]] = [arr[to], arr[index]];
      changed({ rerender: true });
      break;
    }
    case 'reset':
      if (btn.dataset.armed !== '1') {
        btn.dataset.armed = '1';
        btn.textContent = 'Biztos? Kattints újra';
        setTimeout(() => { if (btn.isConnected) { btn.dataset.armed = ''; btn.textContent = 'Újrakezdés'; } }, 4000);
        break;
      }
      btn.dataset.armed = '';
      btn.textContent = 'Újrakezdés';
      step = 0;
      saveStep(0);
      startWith('');
      break;
    default:
  }
}

/* ------------------------------------------------------------ drag sort */

function sortable(listEl, itemSel, onDrop) {
  if (!listEl) return;
  let dragged = null;
  listEl.addEventListener('dragstart', (e) => {
    dragged = e.target.closest(itemSel);
    if (!dragged) return;
    dragged.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  });
  listEl.addEventListener('dragover', (e) => {
    if (!dragged) return;
    e.preventDefault();
    const horizontal = listEl.id === 'page-tabs';
    const after = [...listEl.querySelectorAll(`${itemSel}:not(.dragging)`)].find((el) => {
      const r = el.getBoundingClientRect();
      return horizontal ? e.clientX < r.left + r.width / 2 : e.clientY < r.top + r.height / 2;
    });
    if (after) listEl.insertBefore(dragged, after);
    else listEl.append(dragged);
  });
  listEl.addEventListener('dragend', () => {
    if (!dragged) return;
    dragged.classList.remove('dragging');
    dragged = null;
    onDrop([...listEl.querySelectorAll(itemSel)]);
  });
}

function initDragSort() {
  sortable($('#blk-list'), '.blk', (els) => {
    const list = blocksOf();
    currentPage().blocks = els.map((el) => list[Number(el.dataset.blockIndex)]);
    changed({ rerender: true });
  });
  sortable($('#page-tabs'), '.page-tab', (els) => {
    const reordered = els.map((el) => pages()[Number(el.dataset.pageIndex)]);
    const home = pages()[0]; // the first page always stays the home page
    config.pages = [home, ...reordered.filter((p) => p !== home)];
    changed({ rerender: true });
  });
}

/* ---------------------------------------------------------- view toggles */

function setDevice(device) {
  $('#frame-wrap').dataset.device = device;
  document.querySelectorAll('button[data-device]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.device === device)));
}
function setView(view) {
  $('.cfg').dataset.view = view;
  document.querySelectorAll('button[data-view]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
}

/* ------------------------------------------------------------------ boot */

export function initConfigurator() {
  const q = new URLSearchParams(location.search);
  const sample = q.get('minta');
  config = loadConfig();
  step = Math.min(loadStep(), STEPS.length - 1);
  ui.pageId = config.pages[0].id;
  const asked = Number(q.get('lepes'));
  if (asked >= 1 && asked <= STEPS.length) step = asked - 1;
  if (sample || asked) history.replaceState(null, '', location.pathname);

  const panel = $('#panel');
  panel.addEventListener('input', (e) => { if (e.target.type !== 'file') onInput(e); });
  panel.addEventListener('change', (e) => (e.target.type === 'file' ? onFile(e) : onInput(e)));
  panel.addEventListener('focusin', (e) => {
    const id = e.target.closest('[data-block-id]')?.dataset.blockId;
    if (id && id !== panel.dataset.lastFocus) { panel.dataset.lastFocus = id; scrollPreviewTo(id); }
  });
  panel.addEventListener('submit', (e) => e.preventDefault());
  document.addEventListener('click', onClick);
  addEventListener('message', (e) => {
    if (e.origin !== location.origin) return;
    if (e.data?.type === 'preview-ready') sendToPreview();
    if (e.data?.type === 'page-change' && pages().some((p) => p.id === e.data.pageId)) {
      ui.pageId = e.data.pageId;
      ui.openBlock = null;
      pendingAnchor = e.data.anchor || '';
      sendToPreview();
      if (step === 2) renderStep({ keepScroll: true });
    }
  });
  frame().addEventListener('load', sendToPreview);

  $('#save-status').textContent = hasSavedConfig() ? 'Korábbi terved betöltve' : 'A módosítások automatikusan mentődnek';
  renderStep();
  if (sample) {
    step = 0;
    saveStep(0);
    startWith(sample);
  } else {
    sendToPreview();
  }
}
