// Client-site renderer (dependency-free). Turns a site config (v2: pages made of blocks) into HTML.
// Used by the studio (static sample pages + live preview) and by the standalone export.
import { ICON_PATHS } from './icons.js';
import { BLOCK_TYPES, withDefaults } from './blocks.js';

export const CONFIG_VERSION = 2;

/* ------------------------------------------------------------- catalogues */

export const FONTS = {
  'Tenor Sans': { weights: '400', fallback: "'Helvetica Neue', Arial, sans-serif" },
  'Bricolage Grotesque': { weights: '400;600', fallback: "'Helvetica Neue', Arial, sans-serif" },
  'Hanken Grotesk': { weights: '400;500;600', fallback: 'system-ui, sans-serif' },
  Manrope: { weights: '400;500;700', fallback: 'system-ui, sans-serif' },
  Figtree: { weights: '400;500;700', fallback: 'system-ui, sans-serif' },
  Jost: { weights: '400;500;600', fallback: 'system-ui, sans-serif' },
  'Work Sans': { weights: '400;500;600', fallback: 'system-ui, sans-serif' },
  Archivo: { weights: '400;600;800', fallback: 'system-ui, sans-serif' },
  Rubik: { weights: '400;500;700', fallback: 'system-ui, sans-serif' },
  Nunito: { weights: '400;600;800', fallback: 'system-ui, sans-serif' },
  Michroma: { weights: '400', fallback: "'Helvetica Neue', Arial, sans-serif" },
  Syncopate: { weights: '400;700', fallback: "'Helvetica Neue', Arial, sans-serif" },
  Italiana: { weights: '400', fallback: 'Georgia, serif' },
  'Bodoni Moda': { weights: '400;600', fallback: 'Georgia, serif' },
  'Playfair Display': { weights: '400;600', fallback: 'Georgia, serif' },
  Lora: { weights: '400;600', fallback: 'Georgia, serif' },
  'DM Serif Display': { weights: '400', fallback: 'Georgia, serif' },
  Caveat: { weights: '500;700', fallback: 'cursive' },
};
const MONO_FONT = 'Martian Mono';

export const VISUALS = { particles: '3D: részecskék', relief: '3D: domborított', image: 'Álló kép', none: 'Nincs kép' };
export const SOCIAL_TYPES = ['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin', 'x'];
export const SOCIAL_LABELS = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', youtube: 'YouTube', linkedin: 'LinkedIn', x: 'X' };

export const THEME_PRESETS = {
  dark: { background: '#08090a', text: '#f2f2ef' },
  light: { background: '#f5f4f1', text: '#121314' },
};

/* ---------------------------------------------------------------- helpers */

export function esc(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Allows relative paths, anchors, http(s), mailto, tel and image data URLs only. */
export function safeUrl(value, { image = false } = {}) {
  const url = String(value ?? '').trim();
  if (!url) return '';
  if (/^data:/i.test(url)) return image && /^data:image\/(png|jpe?g|webp|gif|svg\+xml|avif);/i.test(url) ? url : '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return /^(https?:|mailto:|tel:)/i.test(url) ? url : '';
  return url;
}

// Relative asset paths ("assets/...") resolve against this base.
let ASSET_BASE = '';
export function setAssetBase(base) {
  ASSET_BASE = base ? String(base).replace(/\/?$/, '/') : '';
}
export function assetUrl(value) {
  const url = safeUrl(value, { image: true });
  if (!url || /^(https?:|data:|\/|#)/i.test(url)) return url;
  return ASSET_BASE + url;
}

export function icon(name, cls = 'icon') {
  const body = ICON_PATHS[name] || ICON_PATHS.sparkles;
  return `<svg class="${cls}" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false">${body}</svg>`;
}

/* ----------------------------------------------------------------- colour */

function hexToRgb(hex, fallback = [0, 212, 255]) {
  let h = String(hex || '').replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) return fallback;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
const rgbToHex = (rgb) => '#' + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => a.map((c, i) => c + (b[i] - c) * t);
function luminance([r, g, b]) {
  const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
export function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
/** Moves a colour towards black or white until it reaches the requested contrast against bg. */
function ensureContrast(rgb, bg, min) {
  const towards = luminance(bg) > 0.4 ? [0, 0, 0] : [255, 255, 255];
  let out = rgb;
  for (let t = 0; t <= 1 && contrast(out, bg) < min; t += 0.04) out = mix(rgb, towards, t);
  return out;
}
const onColor = (rgb) => (contrast(rgb, [10, 10, 10]) >= contrast(rgb, [255, 255, 255]) ? '#0a0a0a' : '#ffffff');

/* ------------------------------------------------------------------ theme */

export function themeVars(config) {
  const t = config.theme || {};
  const c = t.colors || {};
  const preset = THEME_PRESETS[t.mode === 'light' ? 'light' : 'dark'];
  const bg = hexToRgb(c.background, hexToRgb(preset.background));
  const text = ensureContrast(hexToRgb(c.text, hexToRgb(preset.text)), bg, 7);
  const primary = hexToRgb(c.primary, [0, 212, 255]);
  const accent = hexToRgb(c.accent, primary);
  const dark = luminance(bg) < 0.4;
  const heading = t.headingFont in FONTS ? t.headingFont : 'Tenor Sans';
  const body = t.bodyFont in FONTS ? t.bodyFont : 'Hanken Grotesk';
  const radius = Math.max(0, Math.min(32, Number(t.radius ?? 8)));
  const shadow = {
    none: 'none',
    soft: dark ? '0 18px 40px -24px rgba(0,0,0,.8)' : '0 18px 40px -24px rgba(20,20,30,.28)',
    strong: dark ? '0 30px 70px -26px rgba(0,0,0,.95)' : '0 30px 60px -24px rgba(20,20,30,.4)',
  }[t.shadow] || 'none';
  return {
    '--bg': rgbToHex(bg),
    '--surface': rgbToHex(mix(bg, text, 0.05)),
    '--surface-2': rgbToHex(mix(bg, text, 0.09)),
    '--line': rgbToHex(mix(bg, text, 0.14)),
    '--line-strong': rgbToHex(mix(bg, text, 0.26)),
    '--text': rgbToHex(text),
    '--muted': rgbToHex(ensureContrast(mix(text, bg, 0.36), bg, 4.6)),
    '--primary': rgbToHex(primary),
    '--on-primary': onColor(primary),
    '--primary-ink': rgbToHex(ensureContrast(primary, bg, 4.6)),
    '--accent': rgbToHex(accent),
    '--accent-rgb': accent.join(', '),
    '--accent-ink': rgbToHex(ensureContrast(accent, bg, 4.6)),
    '--on-accent': onColor(accent),
    '--font-display': `'${heading}', ${FONTS[heading].fallback}`,
    '--font-body': `'${body}', ${FONTS[body].fallback}`,
    '--font-mono': `'${MONO_FONT}', ui-monospace, Menlo, monospace`,
    '--fs': String(Math.max(0.85, Math.min(1.25, Number(t.fontScale ?? 1)))),
    '--radius': `${radius}px`,
    '--radius-sm': `${Math.round(radius * 0.6)}px`,
    '--r-btn': { pill: '999px', rounded: `${Math.max(6, Math.round(radius * 0.75))}px`, square: '0px' }[t.buttonShape] || '999px',
    '--shadow': shadow,
    '--space': String({ compact: 0.7, normal: 1, airy: 1.32 }[t.spacing] ?? 1),
  };
}

export function themeCss(config) {
  return `:root{${Object.entries(themeVars(config)).map(([k, v]) => `${k}:${v}`).join(';')}}`;
}

/** Attributes for <html> that switch whole style families in template.css. */
export function rootAttrs(config) {
  const t = config.theme || {};
  return {
    'data-mode': luminance(hexToRgb(t.colors?.background, hexToRgb(THEME_PRESETS[t.mode === 'light' ? 'light' : 'dark'].background))) < 0.4 ? 'dark' : 'light',
    'data-btn': t.buttonStyle === 'outline' ? 'outline' : 'solid',
    'data-heading-case': t.headingCase === 'upper' ? 'upper' : 'normal',
    'data-motion': ['none', 'subtle', 'normal', 'strong'].includes(t.motion) ? t.motion : 'normal',
  };
}

export function fontsHref(config) {
  const names = [...new Set([config.theme?.headingFont, config.theme?.bodyFont].filter((f) => f in FONTS))];
  const families = names.map((n) => `family=${encodeURIComponent(n).replace(/%20/g, '+')}:wght@${FONTS[n].weights}`);
  families.push(`family=${MONO_FONT.replace(/ /g, '+')}:wght@300;400`);
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}

/* ------------------------------------------------------------------ pages */

export const pagesOf = (config) => (config.pages?.length ? config.pages : [{ id: 'home', title: 'Főoldal', slug: '', showInNav: true, blocks: [] }]);
export const findPage = (config, pageId) => pagesOf(config).find((p) => p.id === pageId) || pagesOf(config)[0];

/**
 * Render context:
 *  - pageId: which page to render
 *  - root:   URL prefix from the current page to the site root ('./', '../' or an absolute base)
 */
function pageHref(page, ctx) {
  return `${ctx.root}${page.slug ? `${page.slug}/` : ''}`;
}

/** Resolves a link value: "page:<id>", "contact", "#anchor" or a URL. Returns [href, extraAttrs]. */
function resolveLink(value, config, ctx) {
  const v = String(value || '').trim();
  if (!v) return ['', ''];
  if (v.startsWith('page:')) {
    const page = pagesOf(config).find((p) => p.id === v.slice(5));
    return page ? [pageHref(page, ctx), ` data-page="${esc(page.id)}"`] : ['', ''];
  }
  if (v === 'contact') {
    for (const page of pagesOf(config)) {
      const block = (page.blocks || []).find((b) => b.type === 'contactForm' && !b.hidden);
      if (block) return page.id === ctx.pageId ? [`#b-${block.id}`, ''] : [`${pageHref(page, ctx)}#b-${block.id}`, ` data-page="${esc(page.id)}" data-anchor="b-${esc(block.id)}"`];
    }
    return ['', ''];
  }
  const url = safeUrl(v);
  const external = /^https?:/i.test(url);
  return [url, external ? ' target="_blank" rel="noopener noreferrer"' : ''];
}

function button(text, link, config, ctx, cls = 'btn btn-primary', withIcon = true) {
  if (!text) return '';
  const [href, attrs] = resolveLink(link, config, ctx);
  return `<a class="${cls}" href="${esc(href || '#')}"${attrs}><span>${esc(text)}</span>${withIcon ? icon('arrow') : ''}</a>`;
}

/* --------------------------------------------------------------- markdown */

/** Tiny, HTML-free markdown: ## headings, **bold**, *italic*, [text](url), "- " lists, paragraphs. */
export function markdown(src) {
  const inline = (s) => esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, href) => {
      const url = safeUrl(href.replace(/&amp;/g, '&'));
      return url ? `<a href="${esc(url)}"${/^https?:/i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>` : text;
    });
  return String(src || '').split(/\n\s*\n/).map((chunk) => {
    const lines = chunk.split('\n').filter((l) => l.trim());
    if (!lines.length) return '';
    if (lines.every((l) => /^\s*[-*]\s+/.test(l))) return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('')}</ul>`;
    if (/^#{2,3}\s/.test(lines[0])) {
      const [first, ...rest] = lines;
      return `<h3>${inline(first.replace(/^#{2,3}\s+/, ''))}</h3>${rest.length ? `<p>${rest.map(inline).join('<br>')}</p>` : ''}`;
    }
    return `<p>${lines.map(inline).join('<br>')}</p>`;
  }).join('');
}

/* ----------------------------------------------------------------- blocks */

const head = (b, cls = '') => (b.title || b.intro
  ? `<header class="block-head ${cls}">${b.title ? `<h2 class="block-title">${esc(b.title)}</h2>` : ''}${b.intro ? `<p class="block-intro">${esc(b.intro)}</p>` : ''}</header>`
  : '');
const paras = (list) => (Array.isArray(list) ? list : [list]).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('');

function videoEmbed(url) {
  const u = String(url || '').trim();
  let m = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (m) return { src: `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0`, thumb: `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg` };
  m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return { src: `https://player.vimeo.com/video/${m[1]}?autoplay=1`, thumb: '' };
  return null;
}

const R = {
  hero(b, config, ctx) {
    const img = assetUrl(b.image);
    const visual = b.visual === 'none' || !img ? '' : `<figure class="hero-stage" data-effect="${esc(b.visual)}" data-image="${esc(img)}">
          <span class="hero-tint" aria-hidden="true" style="-webkit-mask-image: url('${esc(img)}'); mask-image: url('${esc(img)}')"></span>
          <img class="hero-still" src="${esc(img)}" alt="${esc(b.imageAlt)}" width="640" height="640" fetchpriority="high" decoding="async">
          ${b.visual === 'particles' || b.visual === 'relief' ? '<canvas class="hero-canvas" aria-hidden="true"></canvas>' : ''}
        </figure>`;
    const H = ctx.firstHero ? 'h1' : 'h2';
    ctx.firstHero = false;
    return `<div class="container hero-grid ${b.layout === 'center' || !visual ? 'is-center' : ''}">
        <div class="hero-copy">
          <${H} class="hero-title">${esc(b.title)}</${H}>
          ${b.subtitle ? `<p class="hero-subtitle">${esc(b.subtitle)}</p>` : ''}
          <div class="hero-actions">${button(b.ctaText, b.ctaLink, config, ctx)}${button(b.secondaryText, b.secondaryLink, config, ctx, 'btn btn-ghost', false)}</div>
        </div>
        ${visual}
      </div>`;
  },
  text: (b) => `<div class="container narrow ${b.align === 'center' ? 'is-center' : ''}">${b.title ? `<h2 class="block-title">${esc(b.title)}</h2>` : ''}<div class="prose">${paras(b.body)}</div></div>`,
  imageText(b, config, ctx) {
    const img = assetUrl(b.image);
    return `<div class="container split ${b.imageSide === 'right' ? 'is-right' : ''}">
        ${img ? `<div class="split-media"><img src="${esc(img)}" alt="${esc(b.imageAlt)}" width="900" height="1100" loading="lazy" decoding="async" data-parallax></div>` : ''}
        <div class="split-copy">${b.title ? `<h2 class="block-title">${esc(b.title)}</h2>` : ''}<div class="prose">${paras(b.body)}</div>${b.ctaText ? `<div class="split-cta">${button(b.ctaText, b.ctaLink, config, ctx)}</div>` : ''}</div>
      </div>`;
  },
  cards: (b) => `<div class="container">${head(b)}<ul class="cards cols-${esc(b.columns || '3')}" role="list" data-reveal-group>${(b.items || []).map((it) => `<li class="card"><span class="card-icon">${icon(it.icon)}</span><h3>${esc(it.title)}</h3>${it.text ? `<p>${esc(it.text)}</p>` : ''}</li>`).join('')}</ul></div>`,
  pricing: (b) => `<div class="container narrow">${head(b)}<ul class="price-list" role="list" data-reveal-group>${(b.items || []).map((it) => `<li class="price-row"><div><h3>${esc(it.name)}</h3>${it.description ? `<p>${esc(it.description)}</p>` : ''}</div>${it.price ? `<p class="price">${esc(it.price)}</p>` : ''}</li>`).join('')}</ul>${b.note ? `<p class="block-note">${esc(b.note)}</p>` : ''}</div>`,
  gallery: (b) => `<div class="container">${head(b)}<ul class="gallery ${b.layout === 'grid' ? 'is-grid' : 'is-mosaic'}" role="list" data-reveal-group>${(b.items || []).map((it) => {
    const src = assetUrl(it.src);
    return src ? `<li><figure><div class="g-img"><img src="${esc(src)}" alt="${esc(it.alt)}" width="800" height="1000" loading="lazy" decoding="async"></div>${it.caption ? `<figcaption>${esc(it.caption)}</figcaption>` : ''}</figure></li>` : '';
  }).join('')}</ul></div>`,
  testimonials(b) {
    const items = (b.items || []).filter((it) => it.quote);
    return `<div class="container quotes">
        <div class="quotes-head">${b.title ? `<h2 class="block-title">${esc(b.title)}</h2>` : ''}${items.length > 1 ? `<div class="quote-controls"><button type="button" class="round-btn" data-quote="-1" aria-label="Előző vélemény">${icon('prev')}</button><button type="button" class="round-btn" data-quote="1" aria-label="Következő vélemény">${icon('next')}</button></div>` : ''}</div>
        <div class="quote-stage" aria-live="polite">${items.map((it, i) => {
          const r = Math.max(0, Math.min(5, Number(it.rating) || 0));
          return `<figure class="quote"${i ? ' data-inactive' : ''}>${r ? `<div class="stars" role="img" aria-label="${r} / 5 csillag">${icon('star', 'icon star').repeat(r)}</div>` : ''}<blockquote><p>„${esc(it.quote)}”</p></blockquote><figcaption><strong>${esc(it.name)}</strong>${it.role ? `<span>${esc(it.role)}</span>` : ''}</figcaption></figure>`;
        }).join('')}</div>
      </div>`;
  },
  team: (b) => `<div class="container">${head(b)}<ul class="team" role="list" data-reveal-group>${(b.members || []).map((m) => {
    const src = assetUrl(m.photo);
    const initials = String(m.name || '?').split(/\s+/).map((w) => w[0]).slice(0, 2).join('');
    return `<li class="member"><div class="member-photo">${src ? `<img src="${esc(src)}" alt="${esc(m.name)}" width="600" height="750" loading="lazy" decoding="async">` : `<span aria-hidden="true">${esc(initials)}</span>`}</div><h3>${esc(m.name)}</h3>${m.role ? `<p class="member-role">${esc(m.role)}</p>` : ''}${m.bio ? `<p>${esc(m.bio)}</p>` : ''}</li>`;
  }).join('')}</ul></div>`,
  faq: (b) => `<div class="container faq-wrap">${b.title ? `<h2 class="block-title">${esc(b.title)}</h2>` : ''}<div class="faq">${(b.items || []).filter((it) => it.q).map((it) => `<details><summary><span>${esc(it.q)}</span>${icon('plus')}</summary><p>${esc(it.a)}</p></details>`).join('')}</div></div>`,
  stats: (b) => `<div class="container">${b.title ? `<h2 class="block-title">${esc(b.title)}</h2>` : ''}<dl class="stats">${(b.items || []).filter((s) => s.value !== '').map((s) => `<div class="stat"><dd><span class="count" data-count="${esc(String(s.value).replace(/\D/g, ''))}">${esc(s.value)}</span>${esc(s.suffix)}</dd><dt>${esc(s.label)}</dt></div>`).join('')}</dl></div>`,
  booking(b, config, ctx) {
    const link = b.buttonLink || (config.contact?.phone ? `tel:${String(config.contact.phone).replace(/[^\d+]/g, '')}` : 'contact');
    return `<div class="container booking"><div class="booking-copy">${b.title ? `<h2 class="block-title">${esc(b.title)}</h2>` : ''}${b.text ? `<p class="block-intro">${esc(b.text)}</p>` : ''}</div><div class="booking-action">${button(b.buttonText || 'Időpontfoglalás', link, config, ctx, 'btn btn-primary btn-lg')}${b.note ? `<p class="block-note">${esc(b.note)}</p>` : ''}</div></div>`;
  },
  video(b) {
    const v = videoEmbed(b.url);
    return `<div class="container narrow">${b.title ? `<h2 class="block-title">${esc(b.title)}</h2>` : ''}${v
      ? `<figure class="video"><button type="button" class="video-facade" data-src="${esc(v.src)}" aria-label="Videó lejátszása${b.title ? `: ${esc(b.title)}` : ''}">${v.thumb ? `<img src="${esc(v.thumb)}" alt="" loading="lazy" decoding="async">` : ''}<span class="play">${icon('next')}</span></button>${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}</figure>`
      : '<p class="empty-note">Add meg egy YouTube vagy Vimeo videó linkjét.</p>'}</div>`;
  },
  map(b, config) {
    const q = b.query || config.contact?.address;
    return `<div class="container">${b.title ? `<h2 class="block-title">${esc(b.title)}</h2>` : ''}${q
      ? `<div class="map map-${esc(b.height || 'normal')}"><iframe title="Térkép: ${esc(q)}" src="https://maps.google.com/maps?q=${encodeURIComponent(q)}&amp;z=15&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`
      : '<p class="empty-note">Add meg a címet az Elérhetőségek lépésben.</p>'}</div>`;
  },
  contactForm(b, config) {
    const k = config.contact || {};
    const tel = String(k.phone || '').replace(/[^\d+]/g, '');
    const hours = (k.hours || []).filter((h) => h.days || h.time).map((h) => `<div><dt>${esc(h.days)}</dt><dd>${esc(h.time)}</dd></div>`).join('');
    const id = `cf-${esc(b.id)}`;
    return `<div class="container contact ${b.showDetails === false ? 'is-form-only' : ''}">
        <div class="contact-info">${head(b)}${b.showDetails === false ? '' : `<dl class="contact-list">
          ${k.address ? `<div><dt>Cím</dt><dd>${esc(k.address)}</dd></div>` : ''}
          ${k.phone ? `<div><dt>Telefon</dt><dd><a href="tel:${esc(tel)}">${esc(k.phone)}</a></dd></div>` : ''}
          ${k.email ? `<div><dt>E-mail</dt><dd><a href="mailto:${esc(k.email)}">${esc(k.email)}</a></dd></div>` : ''}
        </dl>${hours ? `<div class="hours"><h3>Nyitvatartás</h3><dl>${hours}</dl></div>` : ''}`}</div>
        <form class="contact-form" data-endpoint="${esc(safeUrl(b.endpoint))}" data-email="${esc(k.email)}" novalidate>
          <div class="field"><label for="${id}-name">Név</label><input id="${id}-name" name="name" autocomplete="name" required aria-describedby="${id}-name-err"><p class="field-err" id="${id}-name-err"></p></div>
          <div class="field"><label for="${id}-email">E-mail</label><input id="${id}-email" name="email" type="email" autocomplete="email" required aria-describedby="${id}-email-err"><p class="field-err" id="${id}-email-err"></p></div>
          <div class="field"><label for="${id}-msg">Üzenet</label><textarea id="${id}-msg" name="message" rows="4" required aria-describedby="${id}-msg-err"></textarea><p class="field-err" id="${id}-msg-err"></p></div>
          <input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button class="btn btn-primary" type="submit"><span>${esc(b.submitText || 'Küldés')}</span>${icon('arrow')}</button>
          <p class="form-status" role="status" aria-live="polite" data-success="${esc(b.successText)}" data-error="Nem sikerült elküldeni. Próbáld újra, vagy hívj minket."></p>
        </form>
      </div>`;
  },
  ctaBand: (b, config, ctx) => `<div class="container cta-band"><div>${b.title ? `<h2 class="block-title">${esc(b.title)}</h2>` : ''}${b.text ? `<p class="block-intro">${esc(b.text)}</p>` : ''}</div>${button(b.buttonText, b.buttonLink || 'contact', config, ctx, 'btn btn-primary btn-lg')}</div>`,
  freeText: (b) => `<div class="container narrow"><div class="prose md">${markdown(b.body)}</div></div>`,
};

function renderBlock(raw, config, ctx) {
  const b = withDefaults(raw);
  if (b.hidden || !R[b.type]) return '';
  return `<section id="b-${esc(b.id)}" class="block block-${b.type} bg-${esc(b.bg || 'default')}" data-block="${esc(b.id)}">
      ${R[b.type](b, config, ctx)}
    </section>`;
}

/* -------------------------------------------------------- header, footer */

function navItems(config, ctx) {
  return pagesOf(config).filter((p) => p.showInNav !== false).map((p) =>
    `<li><a href="${esc(pageHref(p, ctx))}" data-page="${esc(p.id)}"${p.id === ctx.pageId ? ' aria-current="page"' : ''}>${esc(p.title)}</a></li>`).join('');
}

function renderHeader(config, ctx) {
  const b = config.brand || {};
  const logo = assetUrl(b.logo);
  const home = pagesOf(config)[0];
  const nav = pagesOf(config).filter((p) => p.showInNav !== false).length > 1 ? navItems(config, ctx) : '';
  return `<header class="site-header">
    <nav class="container nav" aria-label="Fő navigáció">
      <a class="brand" href="${esc(pageHref(home, ctx))}" data-page="${esc(home.id)}">${logo ? `<img src="${esc(logo)}" alt="" width="32" height="32">` : ''}<span>${esc(b.name)}</span></a>
      ${nav ? `<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu"><span class="sr-only">Menü</span>${icon('menu')}</button>` : ''}
      <div id="nav-menu" class="nav-menu">${nav ? `<ul role="list">${nav}</ul>` : ''}${b.ctaText ? button(b.ctaText, b.ctaLink || 'contact', config, ctx, 'btn btn-primary btn-sm', false) : ''}</div>
    </nav>
  </header>`;
}

function renderFooter(config, ctx) {
  const b = config.brand || {};
  const f = config.footer || {};
  const k = config.contact || {};
  const social = (config.social || []).map((s) => ({ ...s, url: safeUrl(s.url) })).filter((s) => s.url && SOCIAL_TYPES.includes(s.type))
    .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(SOCIAL_LABELS[s.type])}">${icon(s.type)}</a></li>`).join('');
  const nav = navItems(config, ctx);
  return `<footer class="site-footer">
    <div class="container footer-grid">
      <div><p class="footer-brand">${esc(b.name)}</p>${f.text || b.tagline ? `<p class="footer-text">${esc(f.text || b.tagline)}</p>` : ''}</div>
      ${nav ? `<nav aria-label="Lábléc navigáció"><ul class="footer-links" role="list">${nav}</ul></nav>` : ''}
      <div class="footer-contact">${k.phone ? `<p>${esc(k.phone)}</p>` : ''}${k.email ? `<p>${esc(k.email)}</p>` : ''}${social ? `<ul class="social" role="list">${social}</ul>` : ''}</div>
    </div>
    <div class="container footer-bottom"><p>© ${new Date().getFullYear()} ${esc(b.name)}. ${esc(f.copyright || 'Minden jog fenntartva.')}</p></div>
  </footer>`;
}

/* ------------------------------------------------------------- documents */

export function renderHead(config, ctx = { pageId: null, root: './' }) {
  const m = config.meta || {};
  const b = config.brand || {};
  const page = findPage(config, ctx.pageId);
  const isHome = page === pagesOf(config)[0];
  const title = isHome ? m.title || b.name : `${page.title} | ${b.name}`;
  const desc = m.description || b.tagline || '';
  const base = String(m.siteUrl || '').replace(/\/+$/, '');
  const canonical = base ? `${base}/${page.slug ? `${page.slug}/` : ''}` : '';
  const og = m.ogImage ? (base && !/^(https?:|data:)/.test(m.ogImage) ? `${base}/${m.ogImage}` : safeUrl(m.ogImage, { image: true })) : '';
  const k = config.contact || {};
  const ld = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: b.name, description: desc, url: base || undefined, telephone: k.phone || undefined, email: k.email || undefined, address: k.address || undefined, sameAs: (config.social || []).map((s) => safeUrl(s.url)).filter(Boolean) };
  const fonts = fontsHref(config);
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    `<meta name="theme-color" content="${esc(themeVars(config)['--bg'])}">`,
    canonical ? `<link rel="canonical" href="${esc(canonical)}">` : '',
    `<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:locale" content="hu_HU">`,
    og ? `<meta property="og:image" content="${esc(og)}"><meta name="twitter:card" content="summary_large_image">` : '',
    `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
    `<link id="font-css" rel="stylesheet" href="${esc(fonts)}" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="${esc(fonts)}"></noscript>`,
    `<style id="theme-vars">${themeCss(config)}</style>`,
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean).join('\n    ');
}

/** Body markup for one page: header, the page's blocks, footer. */
export function renderBody(config, ctx = { pageId: null, root: './' }) {
  const page = findPage(config, ctx.pageId);
  const c = { ...ctx, pageId: page.id, firstHero: true };
  const blocks = (page.blocks || []).map((b) => renderBlock(b, config, c)).join('\n    ');
  return `<a class="skip-link" href="#main">Ugrás a tartalomra</a>
  ${renderHeader(config, c)}
  <main id="main" tabindex="-1" data-page-id="${esc(page.id)}">
    ${blocks || '<section class="block"><div class="container"><p class="empty-note">Ez az oldal még üres. Adj hozzá blokkokat a tervezőben.</p></div></section>'}
  </main>
  ${renderFooter(config, c)}`;
}

/** Data the page runtime needs (3D source, motion level). */
export function runtimeData(config, ctx = {}) {
  const page = findPage(config, ctx.pageId);
  return { pageId: page.id, motion: rootAttrs(config)['data-motion'], accent: themeVars(config)['--accent'], mode: rootAttrs(config)['data-mode'] };
}

/** Fills the standalone page template with one page of a config (used by the export). */
export function buildPage(template, config, ctx) {
  const attrs = rootAttrs(config);
  return template
    .replace('{{LANG}}', esc(config.meta?.lang || 'hu'))
    .replace('{{ATTRS}}', Object.entries(attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(' '))
    .replace('{{HEAD}}', () => renderHead(config, ctx))
    .replace('{{BODY}}', () => renderBody(config, ctx))
    .replace('{{RUNTIME}}', () => JSON.stringify(runtimeData(config, ctx)).replace(/</g, '\\u003c'));
}

export const BLOCK_LABELS = Object.fromEntries(Object.entries(BLOCK_TYPES).map(([k, v]) => [k, v.label]));
