// Shared, dependency-free renderer. Turns a site.config.json object into HTML.
// Used by the build script (Node, for prerendering / SEO), by the live site
// (preview re-renders) and by the configurator (ZIP export).

export const SECTION_IDS = ['hero', 'about', 'services', 'gallery', 'testimonials', 'contact'];

export const SECTION_LABELS = {
  hero: 'Hero',
  about: 'Rólunk',
  services: 'Szolgáltatások',
  gallery: 'Referenciák / galéria',
  testimonials: 'Vélemények',
  contact: 'Kapcsolat',
};

export const FONTS = {
  Syne: { weights: '500;600;700;800', fallback: 'system-ui, sans-serif' },
  Inter: { weights: '400;500;600', fallback: 'system-ui, sans-serif' },
  Manrope: { weights: '400;500;600;700;800', fallback: 'system-ui, sans-serif' },
  'Space Grotesk': { weights: '400;500;600;700', fallback: 'system-ui, sans-serif' },
  Outfit: { weights: '300;400;500;600;700', fallback: 'system-ui, sans-serif' },
  'DM Sans': { weights: '400;500;600;700', fallback: 'system-ui, sans-serif' },
  Sora: { weights: '400;500;600;700', fallback: 'system-ui, sans-serif' },
  Unbounded: { weights: '400;500;600;700', fallback: 'system-ui, sans-serif' },
  'Playfair Display': { weights: '400;500;600;700', fallback: 'Georgia, serif' },
  'Cormorant Garamond': { weights: '400;500;600;700', fallback: 'Georgia, serif' },
  Fraunces: { weights: '400;500;600;700', fallback: 'Georgia, serif' },
};

export const EFFECTS = {
  particles: 'Részecskefelhő',
  blob: 'Folyékony gömb',
  waves: 'Hullámzó rács',
  none: 'Nincs 3D',
};

export const ICONS = {
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',
  palette: '<path d="M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2a2 2 0 0 0-1.5 3.3A1.6 1.6 0 0 1 12 22Z"/><circle cx="7.5" cy="10.5" r="1.2"/><circle cx="12" cy="7" r="1.2"/><circle cx="16.5" cy="10.5" r="1.2"/>',
  droplet: '<path d="M12 2.7s6 6.4 6 11.3a6 6 0 0 1-12 0c0-4.9 6-11.3 6-11.3Z"/><path d="M9 14.5a3 3 0 0 0 3 3"/>',
  sparkles: '<path d="M12 3 13.8 8.2 19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z"/>',
  razor: '<path d="M3 21l8-8"/><path d="M9.5 11.5 15 6l3 3-5.5 5.5"/><path d="M15 6l2-2 3 3-2 2"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8Z"/>',
  star: '<path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9Z"/>',
  crown: '<path d="m3 7 4.5 4L12 4l4.5 7L21 7l-2 12H5Z"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 12-4 16-9 16Z"/><path d="M4 20c4-4 7-6 11-8"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v9H5v-9"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z"/>',
  tiktok: '<path d="M16 3c.4 2.3 1.9 3.8 4 4v3.2a7.6 7.6 0 0 1-4-1.3V15a6 6 0 1 1-6-6v3.3a2.7 2.7 0 1 0 2.7 2.7V3Z"/>',
  youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z"/>',
  linkedin: '<rect x="2" y="2" width="20" height="20" rx="3"/><path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 10v7"/>',
  x: '<path d="M4 4l16 16M20 4 4 20"/>',
};

export const SERVICE_ICONS = ['scissors', 'palette', 'droplet', 'sparkles', 'razor', 'heart', 'star', 'crown', 'leaf', 'sun', 'gift', 'calendar'];
export const SOCIAL_TYPES = ['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin', 'x'];

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
  const body = ICONS[name] || ICONS.sparkles;
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
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

const PALETTES = {
  dark: { bg: '#07080c', bgElev: '#0d0f15', surface: '#12151d', text: '#f2f4f8', muted: '#a4abba', border: 'rgba(255,255,255,0.09)' },
  light: { bg: '#f6f5f2', bgElev: '#ffffff', surface: '#ffffff', text: '#0e1015', muted: '#4c5363', border: 'rgba(10,12,20,0.1)' },
};

export function themeVars(config) {
  const theme = config.theme || {};
  const mode = theme.mode === 'light' ? 'light' : 'dark';
  const p = PALETTES[mode];
  const accent = hexToRgb(theme.accent);
  const bg = hexToRgb(p.bg);
  // Text on an accent-filled button: whichever of black/white reads better.
  const onAccent = contrast(accent, [0, 0, 0]) >= contrast(accent, [255, 255, 255]) ? '#05060a' : '#ffffff';
  // Accent used as text (links, eyebrows) must stay readable on the page background.
  const accentInk = rgbToHex(ensureContrast(accent, bg, 4.6));
  const heading = theme.headingFont in FONTS ? theme.headingFont : 'Syne';
  const body = theme.bodyFont in FONTS ? theme.bodyFont : 'Inter';
  const radius = Math.max(0, Math.min(40, Number(theme.radius ?? 20)));
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
    '--border': p.border,
    '--font-heading': `'${heading}', ${FONTS[heading].fallback}`,
    '--font-body': `'${body}', ${FONTS[body].fallback}`,
    '--radius': `${radius}px`,
    '--radius-sm': `${Math.round(radius * 0.6)}px`,
  };
}

export function themeCss(config) {
  const vars = themeVars(config);
  return `:root{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';')};color-scheme:${config.theme?.mode === 'light' ? 'light' : 'dark'}}`;
}

export function fontsHref(config) {
  const names = [...new Set([config.theme?.headingFont, config.theme?.bodyFont].filter((f) => f in FONTS))];
  if (!names.length) return '';
  const families = names.map((n) => `family=${encodeURIComponent(n).replace(/%20/g, '+')}:wght@${FONTS[n].weights}`).join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
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
    '@type': 'LocalBusiness',
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
    fonts ? `<link id="font-css" rel="stylesheet" href="${esc(fonts)}" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="${esc(fonts)}"></noscript>` : '<link id="font-css" rel="stylesheet">',
    `<style id="theme-vars">${themeCss(config)}</style>`,
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean).join('\n    ');
}

/* --------------------------------------------------------------- sections */

function sectionHead(s, id, extra = '') {
  return `<header class="section-head" data-reveal>
        ${s.eyebrow ? `<p class="eyebrow">${esc(s.eyebrow)}</p>` : ''}
        <h2 id="${id}-title" class="section-title">${esc(s.title)}</h2>
        ${s.intro ? `<p class="section-intro">${esc(s.intro)}</p>` : ''}${extra}
      </header>`;
}

function splitWords(text) {
  // Each word is wrapped so CSS can stagger a reveal without waiting for JS (keeps LCP fast).
  return String(text ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w, i) => `<span class="word" style="--i:${i}"><span>${esc(w)}</span></span>`)
    .join(' ');
}

const renderers = {
  hero(c) {
    const h = c.hero;
    const cta = safeUrl(h.ctaLink) || '#contact';
    const second = safeUrl(h.secondaryLink);
    return `<section id="hero" class="hero" aria-labelledby="hero-title">
      <div class="hero-bg" aria-hidden="true"><canvas class="hero-canvas"></canvas><div class="hero-glow"></div><div class="hero-grain"></div></div>
      <div class="container hero-inner">
        ${h.eyebrow ? `<p class="eyebrow hero-eyebrow">${esc(h.eyebrow)}</p>` : ''}
        <h1 id="hero-title" class="hero-title">${splitWords(h.title)}</h1>
        ${h.subtitle ? `<p class="hero-subtitle">${esc(h.subtitle)}</p>` : ''}
        <div class="hero-actions">
          ${h.ctaText ? `<a class="btn btn-primary magnetic" href="${esc(cta)}"><span>${esc(h.ctaText)}</span>${icon('arrow')}</a>` : ''}
          ${h.secondaryText && second ? `<a class="btn btn-ghost magnetic" href="${esc(second)}"><span>${esc(h.secondaryText)}</span></a>` : ''}
        </div>
      </div>
      <a class="scroll-cue" href="#main-after-hero" aria-label="Görgess lejjebb"><span></span></a>
    </section>
    <div id="main-after-hero"></div>`;
  },

  about(c) {
    const a = c.about;
    const img = safeUrl(a.image, { image: true });
    const paragraphs = (a.paragraphs || []).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('\n          ');
    const stats = (a.stats || []).filter((s) => s.value !== '' && s.value != null).map((s) => `<li class="stat">
            <span class="stat-value"><span class="count" data-count="${esc(String(s.value).replace(/\D/g, ''))}">${esc(s.value)}</span>${esc(s.suffix)}</span>
            <span class="stat-label">${esc(s.label)}</span>
          </li>`).join('\n          ');
    return `<section id="about" class="section about" aria-labelledby="about-title">
      <div class="container about-grid">
        <div class="about-media" data-reveal>
          ${img ? `<div class="about-img-wrap" data-parallax="0.12"><img src="${esc(img)}" alt="${esc(a.imageAlt)}" width="800" height="1000" loading="lazy" decoding="async"></div>` : ''}
          <div class="about-orb" aria-hidden="true"></div>
        </div>
        <div class="about-copy">
          ${sectionHead(a, 'about')}
          <div class="about-text" data-reveal>
          ${paragraphs}
          </div>
          ${stats ? `<ul class="stats" data-reveal>\n          ${stats}\n          </ul>` : ''}
        </div>
      </div>
    </section>`;
  },

  services(c) {
    const s = c.services;
    const cards = (s.items || []).map((it, i) => `<li class="card service-card tilt" data-reveal style="--d:${i % 3}">
            <div class="card-glow" aria-hidden="true"></div>
            <span class="service-icon">${icon(it.icon)}</span>
            <h3 class="card-title">${esc(it.title)}</h3>
            <p class="card-text">${esc(it.text)}</p>
            ${it.price ? `<p class="service-price">${esc(it.price)}</p>` : ''}
          </li>`).join('\n          ');
    return `<section id="services" class="section services" aria-labelledby="services-title">
      <div class="container">
        ${sectionHead(s, 'services')}
        <ul class="services-grid" role="list">
          ${cards}
        </ul>
      </div>
    </section>`;
  },

  gallery(c) {
    const g = c.gallery;
    const items = (g.items || []).map((it, i) => {
      const src = safeUrl(it.src, { image: true });
      if (!src) return '';
      return `<li class="gallery-item" data-reveal style="--d:${i % 3}">
            <figure>
              <div class="gallery-img"><img src="${esc(src)}" alt="${esc(it.alt)}" width="800" height="1000" loading="lazy" decoding="async"></div>
              ${it.caption ? `<figcaption>${esc(it.caption)}</figcaption>` : ''}
            </figure>
          </li>`;
    }).join('\n          ');
    return `<section id="gallery" class="section gallery" aria-labelledby="gallery-title">
      <div class="container">
        ${sectionHead(g, 'gallery')}
        <ul class="gallery-grid" role="list">
          ${items}
        </ul>
      </div>
    </section>`;
  },

  testimonials(c) {
    const t = c.testimonials;
    const items = (t.items || []).map((it, i) => {
      const rating = Math.max(0, Math.min(5, Number(it.rating) || 0));
      const initials = String(it.name || '?').split(/\s+/).map((w) => w[0]).slice(0, 2).join('');
      return `<li class="card testimonial tilt" data-reveal style="--d:${i % 3}">
            <figure>
              ${rating ? `<div class="stars" role="img" aria-label="${rating} / 5 csillag">${icon('star', 'icon star').repeat(rating)}</div>` : ''}
              <blockquote><p>„${esc(it.quote)}”</p></blockquote>
              <figcaption><span class="avatar" aria-hidden="true">${esc(initials)}</span><span><strong>${esc(it.name)}</strong>${it.role ? `<span class="role">${esc(it.role)}</span>` : ''}</span></figcaption>
            </figure>
          </li>`;
    }).join('\n          ');
    return `<section id="testimonials" class="section testimonials" aria-labelledby="testimonials-title">
      <div class="container">
        ${sectionHead(t, 'testimonials')}
        <ul class="testimonial-grid" role="list">
          ${items}
        </ul>
      </div>
    </section>`;
  },

  contact(c) {
    const k = c.contact;
    const tel = String(k.phone || '').replace(/[^\d+]/g, '');
    const hours = (k.hours || []).filter((h) => h.days || h.time).map((h) => `<li><span>${esc(h.days)}</span><span>${esc(h.time)}</span></li>`).join('');
    const map = k.mapQuery
      ? `<div class="map" data-reveal><iframe title="Térkép: ${esc(k.address || k.mapQuery)}" src="https://maps.google.com/maps?q=${encodeURIComponent(k.mapQuery)}&amp;z=15&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`
      : '';
    return `<section id="contact" class="section contact" aria-labelledby="contact-title">
      <div class="container contact-grid">
        <div class="contact-info">
          ${sectionHead(k, 'contact')}
          <ul class="contact-list" data-reveal>
            ${k.address ? `<li>${icon('pin')}<span>${esc(k.address)}</span></li>` : ''}
            ${k.phone ? `<li>${icon('phone')}<a href="tel:${esc(tel)}">${esc(k.phone)}</a></li>` : ''}
            ${k.email ? `<li>${icon('mail')}<a href="mailto:${esc(k.email)}">${esc(k.email)}</a></li>` : ''}
          </ul>
          ${hours ? `<div class="hours" data-reveal><h3>${icon('clock')}Nyitvatartás</h3><ul>${hours}</ul></div>` : ''}
        </div>
        <div class="contact-side">
          <form class="card contact-form" data-reveal data-endpoint="${esc(safeUrl(k.formEndpoint))}" data-email="${esc(k.email)}" novalidate>
            <div class="field"><label for="cf-name">Név</label><input id="cf-name" name="name" type="text" autocomplete="name" required></div>
            <div class="field-row">
              <div class="field"><label for="cf-email">E-mail</label><input id="cf-email" name="email" type="email" autocomplete="email" required></div>
              <div class="field"><label for="cf-phone">Telefon <span class="opt">(nem kötelező)</span></label><input id="cf-phone" name="phone" type="tel" autocomplete="tel"></div>
            </div>
            <div class="field"><label for="cf-msg">Üzenet</label><textarea id="cf-msg" name="message" rows="4" required></textarea></div>
            <input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
            <button class="btn btn-primary magnetic" type="submit"><span>${esc(k.formSubmitText || 'Küldés')}</span>${icon('arrow')}</button>
            <p class="form-status" role="status" aria-live="polite" data-success="${esc(k.formSuccess)}" data-error="${esc(k.formError)}"></p>
          </form>
          ${map}
        </div>
      </div>
    </section>`;
  },
};

function renderNav(config, sections) {
  const b = config.brand || {};
  const logo = safeUrl(b.logo, { image: true });
  const links = sections
    .filter((id) => id !== 'hero' && config[id]?.navLabel)
    .map((id) => `<li><a href="#${id}">${esc(config[id].navLabel)}</a></li>`)
    .join('');
  const ctaSection = sections.includes('contact') ? '#contact' : '';
  const brandInner = logo
    ? `<img src="${esc(logo)}" alt="${esc(b.logoAlt || b.name)}" width="36" height="36"><span>${esc(b.shortName || b.name)}</span>`
    : `<span class="brand-mark" aria-hidden="true">${esc((b.shortName || b.name || 'A').charAt(0))}</span><span>${esc(b.shortName || b.name)}</span>`;
  return `<header class="site-header">
    <nav class="container nav" aria-label="Fő navigáció">
      <a class="brand" href="#top" aria-label="${esc(b.name)} – vissza az oldal tetejére">${brandInner}</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu"><span class="sr-only">Menü</span><span class="bars" aria-hidden="true"></span></button>
      <div id="nav-menu" class="nav-menu">
        <ul role="list">${links}</ul>
        ${ctaSection && config.hero?.ctaText ? `<a class="btn btn-primary btn-sm" href="${ctaSection}">${esc(config.hero.ctaText)}</a>` : ''}
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
    .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(b.name)} – ${esc(s.type)}">${icon(s.type)}</a></li>`)
    .join('');
  const links = sections
    .filter((id) => id !== 'hero' && config[id]?.navLabel)
    .map((id) => `<li><a href="#${id}">${esc(config[id].navLabel)}</a></li>`)
    .join('');
  return `<footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <p class="footer-brand">${esc(b.name)}</p>
        <p class="footer-text">${esc(f.text || b.tagline)}</p>
      </div>
      ${links ? `<nav aria-label="Lábléc navigáció"><ul class="footer-links" role="list">${links}</ul></nav>` : ''}
      ${social ? `<ul class="social" role="list">${social}</ul>` : ''}
    </div>
    <div class="container footer-bottom">
      <p>© ${year} ${esc(b.name)}. ${esc(f.copyright)}</p>
      <a href="#top" class="to-top">Vissza a tetejére ↑</a>
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
  const runtime = { effect3d: config.effect3d, theme: config.theme };
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
