// Shared, dependency-free renderer. Turns a site.config.json object into HTML.
// Used by the build script (Node, for prerendering / SEO), by the live site
// (preview re-renders) and by the configurator (ZIP export).
import { ICON_PATHS } from './icons.js';

export const SECTION_IDS = ['hero', 'about', 'services', 'gallery', 'testimonials', 'contact'];

export const SECTION_LABELS = {
  hero: 'Nyitókép (3D)',
  about: 'Rólunk',
  services: 'Szolgáltatások',
  gallery: 'Referenciák / galéria',
  testimonials: 'Vélemények',
  contact: 'Kapcsolat',
};

// Display faces are set uppercase with wide tracking; body faces carry running text.
export const FONTS = {
  'Tenor Sans': { weights: '400', fallback: "'Helvetica Neue', Arial, sans-serif", role: 'display' },
  Michroma: { weights: '400', fallback: "'Helvetica Neue', Arial, sans-serif", role: 'display' },
  Syncopate: { weights: '400;700', fallback: "'Helvetica Neue', Arial, sans-serif", role: 'display' },
  Italiana: { weights: '400', fallback: 'Georgia, serif', role: 'display' },
  'Bodoni Moda': { weights: '400;500', fallback: 'Georgia, serif', role: 'display' },
  Jost: { weights: '300;400;500', fallback: 'system-ui, sans-serif', role: 'both' },
  'Hanken Grotesk': { weights: '300;400;500;600', fallback: 'system-ui, sans-serif', role: 'body' },
  Manrope: { weights: '400;500;600', fallback: 'system-ui, sans-serif', role: 'body' },
  Figtree: { weights: '400;500;600', fallback: 'system-ui, sans-serif', role: 'body' },
};
const MONO_FONT = 'Martian Mono';

export const EFFECTS = {
  particles: 'Részecskékből kirajzolódó kép',
  relief: 'Domborított kép',
  none: 'Nincs 3D (álló kép)',
};

export const SERVICE_ICONS = ['scissors', 'palette', 'droplet', 'sparkles', 'crown', 'flower', 'heart', 'star', 'leaf', 'sun', 'gift', 'dryer'];
export const SOCIAL_TYPES = ['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin', 'x'];
export const SOCIAL_LABELS = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', youtube: 'YouTube', linkedin: 'LinkedIn', x: 'X' };

/* ---------------------------------------------------------------- helpers */

export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Allows relative paths, anchors, http(s), mailto, tel and image data URLs only. */
export function safeUrl(value, { image = false } = {}) {
  const url = String(value ?? '').trim();
  if (!url) return '';
  if (/^data:/i.test(url)) return image && /^data:image\/(png|jpe?g|webp|gif|svg\+xml|avif);/i.test(url) ? url : '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return /^(https?:|mailto:|tel:)/i.test(url) ? url : '';
  return url;
}

export function icon(name, cls = 'icon') {
  const body = ICON_PATHS[name] || ICON_PATHS.sparkles;
  return `<svg class="${cls}" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false">${body}</svg>`;
}

function hexToRgb(hex) {
  let h = String(hex || '').replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) return [0, 212, 255];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

const rgbToHex = (rgb) => '#' + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');

function luminance([r, g, b]) {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Moves a colour towards black/white until it reaches the requested contrast against bg. */
function ensureContrast(rgb, bg, min) {
  const towards = luminance(bg) > 0.5 ? [0, 0, 0] : [255, 255, 255];
  let out = rgb;
  for (let t = 0; t <= 1 && contrast(out, bg) < min; t += 0.04) {
    out = rgb.map((c, i) => c + (towards[i] - c) * t);
  }
  return out;
}

// Austere monochrome neutrals (no pure black/white); the accent is the only colour.
const PALETTES = {
  dark: { bg: '#070707', bgElev: '#0c0c0c', surface: '#121212', text: '#f1f1ef', muted: '#9b9b98', line: '#262626', lineStrong: '#3a3a3a' },
  light: { bg: '#f3f3f1', bgElev: '#ebebe8', surface: '#ffffff', text: '#0c0c0d', muted: '#565653', line: '#d9d9d5', lineStrong: '#b9b9b4' },
};

export function themeVars(config) {
  const theme = config.theme || {};
  const mode = theme.mode === 'light' ? 'light' : 'dark';
  const p = PALETTES[mode];
  const accent = hexToRgb(theme.accent);
  const bg = hexToRgb(p.bg);
  const onAccent = contrast(accent, [7, 7, 7]) >= contrast(accent, [255, 255, 255]) ? '#070707' : '#ffffff';
  // Accent used as text (links, prices on hover) must stay readable on the page background.
  const accentInk = rgbToHex(ensureContrast(accent, bg, 4.6));
  const heading = theme.headingFont in FONTS ? theme.headingFont : 'Tenor Sans';
  const body = theme.bodyFont in FONTS ? theme.bodyFont : 'Hanken Grotesk';
  const radius = Math.max(0, Math.min(32, Number(theme.radius ?? 0)));
  return {
    '--accent': rgbToHex(accent),
    '--accent-rgb': accent.join(', '),
    '--accent-ink': accentInk,
    '--on-accent': onAccent,
    '--bg': p.bg,
    '--bg-elev': p.bgElev,
    '--surface': p.surface,
    '--text': p.text,
    '--muted': p.muted,
    '--line': p.line,
    '--line-strong': p.lineStrong,
    '--font-display': `'${heading}', ${FONTS[heading].fallback}`,
    '--font-body': `'${body}', ${FONTS[body].fallback}`,
    '--font-mono': `'${MONO_FONT}', ui-monospace, 'SFMono-Regular', Menlo, monospace`,
    '--radius': `${radius}px`,
  };
}

export function themeCss(config) {
  const vars = themeVars(config);
  return `:root{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';')};color-scheme:${config.theme?.mode === 'light' ? 'light' : 'dark'}}`;
}

export function fontsHref(config) {
  const names = [...new Set([config.theme?.headingFont, config.theme?.bodyFont].filter((f) => f in FONTS))];
  const families = names.map((n) => `family=${encodeURIComponent(n).replace(/%20/g, '+')}:wght@${FONTS[n].weights}`);
  families.push(`family=${MONO_FONT.replace(/ /g, '+')}:wght@300;400`);
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}

export function enabledSections(config) {
  const order = (config.sections?.order || SECTION_IDS).filter((id) => SECTION_IDS.includes(id));
  // Sections missing from `order` (e.g. older configs) are appended in default order.
  for (const id of SECTION_IDS) if (!order.includes(id)) order.push(id);
  return order.filter((id) => config.sections?.enabled?.[id] !== false && config[id]);
}

function absoluteUrl(config, path) {
  const url = safeUrl(path, { image: true });
  if (!url || /^(https?:|data:)/i.test(url)) return url;
  const base = String(config.meta?.siteUrl || '').replace(/\/+$/, '');
  return base ? `${base}/${url.replace(/^\/+/, '')}` : url;
}

/* ------------------------------------------------------------------- head */

export function renderHead(config) {
  const m = config.meta || {};
  const b = config.brand || {};
  const title = m.title || b.name || '';
  const canonical = String(m.siteUrl || '').replace(/\/+$/, '') + '/';
  const og = absoluteUrl(config, m.ogImage);
  const fonts = fontsHref(config);
  const c = config.contact || {};
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: b.name,
    description: m.description,
    url: canonical,
    telephone: c.phone || undefined,
    email: c.email || undefined,
    address: c.address || undefined,
    image: og || undefined,
    sameAs: (config.social || []).map((s) => safeUrl(s.url)).filter(Boolean),
  };
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(m.description)}">`,
    m.keywords ? `<meta name="keywords" content="${esc(m.keywords)}">` : '',
    `<meta name="theme-color" content="${esc(themeVars(config)['--bg'])}">`,
    m.siteUrl ? `<link rel="canonical" href="${esc(canonical)}">` : '',
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(m.description)}">`,
    `<meta property="og:site_name" content="${esc(b.name)}">`,
    `<meta property="og:locale" content="${esc((m.lang || 'hu') === 'hu' ? 'hu_HU' : m.lang)}">`,
    m.siteUrl ? `<meta property="og:url" content="${esc(canonical)}">` : '',
    og ? `<meta property="og:image" content="${esc(og)}">` : '',
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(m.description)}">`,
    og ? `<meta name="twitter:image" content="${esc(og)}">` : '',
    `<link rel="preconnect" href="https://fonts.googleapis.com">`,
    `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
    // Non-render-blocking font CSS (display=swap) keeps first paint fast.
    `<link id="font-css" rel="stylesheet" href="${esc(fonts)}" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="${esc(fonts)}"></noscript>`,
    `<style id="theme-vars">${themeCss(config)}</style>`,
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean).join('\n    ');
}

/* --------------------------------------------------------------- sections */

function sectionHead(s, id) {
  return `<header class="section-head">
        <h2 id="${id}-title" class="section-title">${esc(s.title)}</h2>
        ${s.intro ? `<p class="section-intro">${esc(s.intro)}</p>` : ''}
      </header>`;
}

const renderers = {
  hero(c) {
    const h = c.hero;
    const cta = safeUrl(h.ctaLink) || '#contact';
    const second = safeUrl(h.secondaryLink);
    const img = safeUrl(h.image, { image: true });
    return `<section id="hero" class="hero" aria-labelledby="hero-title">
      <div class="container hero-grid">
        <div class="hero-copy">
          <h1 id="hero-title" class="hero-title">${esc(h.title)}</h1>
          ${h.subtitle ? `<p class="hero-subtitle">${esc(h.subtitle)}</p>` : ''}
          <div class="hero-actions">
            ${h.ctaText ? `<a class="btn btn-primary" href="${esc(cta)}"><span>${esc(h.ctaText)}</span>${icon('arrow')}</a>` : ''}
            ${h.secondaryText && second ? `<a class="text-link" href="${esc(second)}">${esc(h.secondaryText)}${icon('next')}</a>` : ''}
          </div>
        </div>
        <figure class="hero-stage" data-effect="${esc(c.effect3d || 'particles')}">
          ${img ? `<img class="hero-still" src="${esc(img)}" alt="${esc(h.imageAlt)}" width="640" height="640" fetchpriority="high" decoding="async">` : ''}
          <canvas class="hero-canvas" aria-hidden="true"></canvas>
        </figure>
      </div>
    </section>`;
  },

  about(c) {
    const a = c.about;
    const img = safeUrl(a.image, { image: true });
    const paragraphs = (a.paragraphs || []).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('\n            ');
    const stats = (a.stats || []).filter((s) => s.value !== '' && s.value != null).map((s) => `<div class="spec">
              <dt>${esc(s.label)}</dt>
              <dd><span class="count" data-count="${esc(String(s.value).replace(/\D/g, ''))}">${esc(s.value)}</span>${esc(s.suffix)}</dd>
            </div>`).join('\n            ');
    return `<section id="about" class="section about" aria-labelledby="about-title">
      <div class="container">
        <h2 id="about-title" class="about-statement" data-reveal="lines">${esc(a.title)}</h2>
        <div class="about-grid">
          ${img ? `<div class="about-media" data-reveal="clip"><img src="${esc(img)}" alt="${esc(a.imageAlt)}" width="800" height="1000" loading="lazy" decoding="async" data-parallax></div>` : ''}
          <div class="about-copy">
            <div class="about-text">
            ${paragraphs}
            </div>
            ${stats ? `<dl class="specs">\n            ${stats}\n            </dl>` : ''}
          </div>
        </div>
      </div>
    </section>`;
  },

  services(c) {
    const s = c.services;
    const rows = (s.items || []).map((it) => `<li class="price-row" data-reveal="row">
            <span class="price-icon">${icon(it.icon)}</span>
            <div class="price-main">
              <h3 class="price-name">${esc(it.title)}</h3>
              <p class="price-desc">${esc(it.text)}</p>
            </div>
            ${it.price ? `<p class="price-value">${esc(it.price)}</p>` : ''}
          </li>`).join('\n          ');
    return `<section id="services" class="section services" aria-labelledby="services-title">
      <div class="container">
        ${sectionHead(s, 'services')}
        <ul class="price-list" role="list">
          ${rows}
        </ul>
      </div>
    </section>`;
  },

  gallery(c) {
    const g = c.gallery;
    const items = (g.items || []).map((it) => {
      const src = safeUrl(it.src, { image: true });
      if (!src) return '';
      return `<li class="mosaic-item" data-reveal="clip">
            <figure>
              <div class="mosaic-img"><img src="${esc(src)}" alt="${esc(it.alt)}" width="800" height="1000" loading="lazy" decoding="async"></div>
              ${it.caption ? `<figcaption>${esc(it.caption)}</figcaption>` : ''}
            </figure>
          </li>`;
    }).join('\n          ');
    return `<section id="gallery" class="section gallery" aria-labelledby="gallery-title">
      <div class="container">
        ${sectionHead(g, 'gallery')}
        <ul class="mosaic" role="list">
          ${items}
        </ul>
      </div>
    </section>`;
  },

  testimonials(c) {
    const t = c.testimonials;
    const items = (t.items || []).filter((it) => it.quote);
    const slides = items.map((it, i) => {
      const rating = Math.max(0, Math.min(5, Number(it.rating) || 0));
      return `<figure class="quote" data-index="${i}"${i ? ' data-inactive' : ''}>
            ${rating ? `<div class="stars" role="img" aria-label="${rating} / 5 csillag">${icon('star', 'icon star').repeat(rating)}</div>` : ''}
            <blockquote><p>„${esc(it.quote)}”</p></blockquote>
            <figcaption><span class="quote-name">${esc(it.name)}</span>${it.role ? `<span class="quote-role">${esc(it.role)}</span>` : ''}</figcaption>
          </figure>`;
    }).join('\n          ');
    const controls = items.length > 1
      ? `<div class="quote-controls">
          <button type="button" class="round-btn" data-quote="-1" aria-label="Előző vélemény">${icon('prev')}</button>
          <button type="button" class="round-btn" data-quote="1" aria-label="Következő vélemény">${icon('next')}</button>
        </div>`
      : '';
    return `<section id="testimonials" class="section testimonials" aria-labelledby="testimonials-title">
      <div class="container quotes-grid">
        <div class="quotes-head">
          <h2 id="testimonials-title" class="section-title">${esc(t.title)}</h2>
          ${controls}
        </div>
        <div class="quote-stage" aria-live="polite">
          ${slides}
        </div>
      </div>
    </section>`;
  },

  contact(c) {
    const k = c.contact;
    const tel = String(k.phone || '').replace(/[^\d+]/g, '');
    const hours = (k.hours || []).filter((h) => h.days || h.time).map((h) => `<div><dt>${esc(h.days)}</dt><dd>${esc(h.time)}</dd></div>`).join('');
    const map = k.mapQuery
      ? `<div class="map"><iframe title="Térkép: ${esc(k.address || k.mapQuery)}" src="https://maps.google.com/maps?q=${encodeURIComponent(k.mapQuery)}&amp;z=15&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`
      : '';
    return `<section id="contact" class="section contact" aria-labelledby="contact-title">
      <div class="container contact-grid">
        <div class="contact-info">
          ${sectionHead(k, 'contact')}
          <dl class="contact-list">
            ${k.address ? `<div><dt>Cím</dt><dd>${esc(k.address)}</dd></div>` : ''}
            ${k.phone ? `<div><dt>Telefon</dt><dd><a href="tel:${esc(tel)}">${esc(k.phone)}</a></dd></div>` : ''}
            ${k.email ? `<div><dt>E-mail</dt><dd><a href="mailto:${esc(k.email)}">${esc(k.email)}</a></dd></div>` : ''}
          </dl>
          ${hours ? `<div class="hours"><h3>Nyitvatartás</h3><dl>${hours}</dl></div>` : ''}
        </div>
        <form class="contact-form" data-endpoint="${esc(safeUrl(k.formEndpoint))}" data-email="${esc(k.email)}" novalidate>
          <div class="field"><label for="cf-name">Név</label><input id="cf-name" name="name" type="text" autocomplete="name" required aria-describedby="cf-name-err"><p class="field-err" id="cf-name-err"></p></div>
          <div class="field-row">
            <div class="field"><label for="cf-email">E-mail</label><input id="cf-email" name="email" type="email" autocomplete="email" required aria-describedby="cf-email-err"><p class="field-err" id="cf-email-err"></p></div>
            <div class="field"><label for="cf-phone">Telefon <span class="opt">(nem kötelező)</span></label><input id="cf-phone" name="phone" type="tel" autocomplete="tel"></div>
          </div>
          <div class="field"><label for="cf-msg">Üzenet</label><textarea id="cf-msg" name="message" rows="4" required aria-describedby="cf-msg-err"></textarea><p class="field-err" id="cf-msg-err"></p></div>
          <input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button class="btn btn-primary" type="submit"><span>${esc(k.formSubmitText || 'Küldés')}</span>${icon('arrow')}</button>
          <p class="form-status" role="status" aria-live="polite" data-success="${esc(k.formSuccess)}" data-error="${esc(k.formError)}"></p>
        </form>
      </div>
      ${map ? `<div class="container">${map}</div>` : ''}
    </section>`;
  },
};

function navLinks(config, sections) {
  return sections
    .filter((id) => id !== 'hero' && config[id]?.navLabel)
    .map((id) => `<li><a href="#${id}">${esc(config[id].navLabel)}</a></li>`)
    .join('');
}

function renderNav(config, sections) {
  const b = config.brand || {};
  const logo = safeUrl(b.logo, { image: true });
  const ctaSection = sections.includes('contact') ? '#contact' : '';
  const brandInner = logo
    ? `<img src="${esc(logo)}" alt="" width="32" height="32"><span>${esc(b.shortName || b.name)}</span>`
    : `<span>${esc(b.shortName || b.name)}</span>`;
  return `<header class="site-header">
    <nav class="container nav" aria-label="Fő navigáció">
      <a class="brand" href="#top" aria-label="${esc(b.name)}, vissza az oldal tetejére">${brandInner}</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu"><span class="sr-only">Menü</span><span class="bars" aria-hidden="true"></span></button>
      <div id="nav-menu" class="nav-menu">
        <ul role="list">${navLinks(config, sections)}</ul>
        ${ctaSection && config.hero?.ctaText ? `<a class="btn btn-primary btn-sm" href="${ctaSection}"><span>${esc(config.hero.ctaText)}</span></a>` : ''}
      </div>
    </nav>
  </header>`;
}

function renderFooter(config, sections) {
  const b = config.brand || {};
  const f = config.footer || {};
  const year = new Date().getFullYear();
  const social = (config.social || [])
    .map((s) => ({ ...s, url: safeUrl(s.url) }))
    .filter((s) => s.url && SOCIAL_TYPES.includes(s.type))
    .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(SOCIAL_LABELS[s.type])}">${icon(s.type)}</a></li>`)
    .join('');
  const links = navLinks(config, sections);
  return `<footer class="site-footer">
    <div class="container">
      <p class="footer-mark" aria-hidden="true">${esc(b.shortName || b.name)}</p>
      <div class="footer-grid">
        <p class="footer-text">${esc(f.text || b.tagline)}</p>
        ${links ? `<nav aria-label="Lábléc navigáció"><ul class="footer-links" role="list">${links}</ul></nav>` : ''}
        ${social ? `<ul class="social" role="list">${social}</ul>` : ''}
      </div>
      <div class="footer-bottom">
        <p>© ${year} ${esc(b.name)}. ${esc(f.copyright)}</p>
        <a href="#top" class="text-link">Vissza a tetejére</a>
      </div>
    </div>
  </footer>`;
}

/** Renders the page body (header, main content, footer). */
export function renderBody(config) {
  const sections = enabledSections(config);
  const main = sections.map((id) => renderers[id](config)).join('\n    ');
  return `<a class="skip-link" href="#main">Ugrás a tartalomra</a>
  ${renderNav(config, sections)}
  <main id="main" tabindex="-1">
    ${main}
  </main>
  ${renderFooter(config, sections)}`;
}

/** Fills the page template (src/index.html) with a config. */
export function buildPage(template, config, { inlineConfig = true } = {}) {
  const runtime = { effect3d: config.effect3d, theme: config.theme, heroImage: config.hero?.image };
  return template
    .replace('{{LANG}}', esc(config.meta?.lang || 'hu'))
    .replace('{{MODE}}', config.theme?.mode === 'light' ? 'light' : 'dark')
    .replace('{{HEAD}}', () => renderHead(config))
    .replace('{{BODY}}', () => renderBody(config))
    .replace('{{RUNTIME}}', () => (inlineConfig ? JSON.stringify(runtime).replace(/</g, '\\u003c') : '{}'));
}

export function buildSitemap(config) {
  const base = String(config.meta?.siteUrl || 'https://www.example.com').replace(/\/+$/, '');
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${esc(base)}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>
</urlset>
`;
}

export function buildRobots(config) {
  const base = String(config.meta?.siteUrl || 'https://www.example.com').replace(/\/+$/, '');
  return `User-agent: *\nAllow: /\nDisallow: /configurator.html\n\nSitemap: ${base}/sitemap.xml\n`;
}
