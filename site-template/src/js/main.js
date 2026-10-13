// Site runtime: smooth scrolling, scroll animations, micro-interactions,
// lazy 3D hero and (inside the configurator iframe) live preview updates.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const PREVIEW = new URLSearchParams(location.search).has('preview') || location.hash === '#preview';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const isMobile = () => matchMedia('(max-width: 760px), (pointer: coarse)').matches;

let runtime = readRuntime();
let lenis = null;
let gsapCtx = null;
let hero = null;
let heroToken = 0;

function readRuntime() {
  try {
    return JSON.parse(document.getElementById('site-runtime')?.textContent || '{}');
  } catch {
    return {};
  }
}

/* ----------------------------------------------------------- smooth scroll */

function initLenis() {
  if (reduceMotion.matches) return;
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target) {
  const headerOffset = -76;
  if (lenis) lenis.scrollTo(target, { offset: target === 0 ? 0 : headerOffset, duration: 1.4 });
  else if (target === 0) window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  else target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
}

/* ----------------------------------------------------- delegated handlers */

function closeMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;
  toggle.setAttribute('aria-expanded', 'false');
  menu.classList.remove('is-open');
}

document.addEventListener('click', (e) => {
  const toggle = e.target.closest('.nav-toggle');
  if (toggle) {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    document.getElementById('nav-menu')?.classList.toggle('is-open', open);
    return;
  }
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href').slice(1);
  const target = id === 'top' ? 0 : document.getElementById(id);
  if (target === null) return;
  e.preventDefault();
  closeMenu();
  scrollToTarget(target);
  if (target !== 0 && !PREVIEW) {
    history.replaceState(null, '', `#${id}`);
    const focusable = target.matches('section, main') ? target : null;
    if (focusable) {
      if (!focusable.hasAttribute('tabindex')) focusable.setAttribute('tabindex', '-1');
      focusable.focus({ preventScroll: true });
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// Testimonials: one quote on stage, previous/next buttons cycle through them.
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-quote]');
  if (!btn) return;
  const quotes = [...document.querySelectorAll('.quote-stage .quote')];
  if (quotes.length < 2) return;
  const current = quotes.findIndex((q) => !q.hasAttribute('data-inactive'));
  const next = (current + Number(btn.dataset.quote) + quotes.length) % quotes.length;
  quotes.forEach((q, i) => {
    if (i === next) q.removeAttribute('data-inactive');
    else q.setAttribute('data-inactive', '');
  });
});

// Contact form: posts to `contact.formEndpoint` (e.g. Formspree) or falls back to mailto.
document.addEventListener('submit', async (e) => {
  const form = e.target.closest('.contact-form');
  if (!form) return;
  e.preventDefault();
  const status = form.querySelector('.form-status');
  const fields = [...form.querySelectorAll('input[required], textarea[required]')];
  let firstInvalid = null;
  for (const f of fields) {
    const ok = f.value.trim() !== '' && f.checkValidity();
    f.setAttribute('aria-invalid', String(!ok));
    const err = document.getElementById(`${f.id}-err`);
    if (err) err.textContent = ok ? '' : f.type === 'email' && f.value.trim() ? 'Ez nem érvényes e-mail cím.' : 'Ezt a mezőt ki kell tölteni.';
    if (!ok && !firstInvalid) firstInvalid = f;
  }
  status.className = 'form-status';
  if (firstInvalid) {
    status.textContent = 'Néhány mező hiányzik vagy hibás, javítsd a jelölt mezőket.';
    status.classList.add('err');
    firstInvalid.focus();
    return;
  }
  if (form.elements._gotcha?.value) return; // spam bot
  if (PREVIEW) {
    status.textContent = 'Előnézet: az üzenet nem kerül elküldésre.';
    status.classList.add('ok');
    return;
  }
  const data = new FormData(form);
  const endpoint = form.dataset.endpoint;
  if (!endpoint) {
    const body = `${data.get('message')}\n\n${data.get('name')}\n${data.get('email')}\n${data.get('phone') || ''}`;
    location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent('Üzenet a weboldalról')}&body=${encodeURIComponent(body)}`;
    return;
  }
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(String(res.status));
    form.reset();
    status.textContent = status.dataset.success;
    status.classList.add('ok');
  } catch {
    status.textContent = status.dataset.error;
    status.classList.add('err');
  } finally {
    button.disabled = false;
  }
});

/* ------------------------------------------------------- scroll animations */

function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  let lastY = 0;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const y = self.scroll();
      header.classList.toggle('is-scrolled', y > 40);
      const menuOpen = document.getElementById('nav-menu')?.classList.contains('is-open');
      header.classList.toggle('is-hidden', !menuOpen && y > 600 && y > lastY);
      lastY = y;
    },
  });
  // Highlight the nav link of the section in view.
  document.querySelectorAll('main > section[id]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle({ isActive }) {
        document.querySelectorAll(`.nav-menu a[href="#${section.id}"]`).forEach((a) => {
          if (isActive) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      },
    });
  });
}

function formatCount(n) {
  return Math.round(n).toLocaleString(document.documentElement.lang || 'hu');
}

const REVEAL_FROM = {
  row: { opacity: 0, y: 28 },
  lines: { opacity: 0, y: 40 },
  clip: { clipPath: 'inset(100% 0% 0% 0%)' },
};
const REVEAL_TO = {
  row: { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08 },
  lines: { opacity: 1, y: 0, duration: 1.4, ease: 'expo.out' },
  clip: { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', stagger: 0.1 },
};

function initAnimations({ animateIn }) {
  const counts = gsap.utils.toArray('.count[data-count]');
  const showCounts = () => counts.forEach((el) => { el.textContent = formatCount(Number(el.dataset.count) || 0); });
  if (reduceMotion.matches) return showCounts();

  if (animateIn) {
    // Only content that starts below the fold is hidden for its reveal; everything is visible by default.
    for (const kind of Object.keys(REVEAL_FROM)) {
      const els = gsap.utils.toArray(`[data-reveal="${kind}"]`).filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.9);
      if (!els.length) continue;
      gsap.set(els, REVEAL_FROM[kind]);
      ScrollTrigger.batch(els, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { ...REVEAL_TO[kind], overwrite: true }),
      });
    }
    counts.forEach((el) => {
      const target = Number(el.dataset.count) || 0;
      const state = { v: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => gsap.fromTo(state, { v: target * 0.6 }, { v: target, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = formatCount(state.v); } }),
      });
    });
  } else {
    showCounts();
  }

  // Parallax: the hero copy drifts up faster than the 3D stage; about image moves inside its frame.
  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    const st = { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero-copy', { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: st });
    gsap.to('.hero-stage', { yPercent: 12, ease: 'none', scrollTrigger: { ...st } });
  }
  gsap.utils.toArray('img[data-parallax]').forEach((img) => {
    gsap.fromTo(img, { yPercent: -14 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

function initPage({ animateIn }) {
  gsapCtx?.revert();
  gsapCtx = gsap.context(() => {
    initHeader();
    initAnimations({ animateIn });
  });
}

/* ---------------------------------------------------------------- 3D hero */

let gpuOk = null;
/** True only for hardware-accelerated WebGL: software renderers would make the page sluggish. */
function hasFastWebGL() {
  if (gpuOk !== null) return gpuOk;
  if (new URLSearchParams(location.search).get('3d') === 'force') return (gpuOk = true);
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) || canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });
    const info = gl?.getExtension('WEBGL_debug_renderer_info');
    const name = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    gpuOk = !!gl && !/swiftshader|llvmpipe|software|basic render/i.test(name);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    gpuOk = false;
  }
  return gpuOk;
}

function wantsHero3D() {
  return ['particles', 'relief'].includes(runtime.effect3d) && runtime.heroImage && !reduceMotion.matches && document.querySelector('.hero-canvas') && hasFastWebGL();
}

async function startHero3D() {
  const token = ++heroToken;
  hero?.destroy();
  hero = null;
  if (!wantsHero3D()) return;
  const { createHero3D } = await import('./hero3d.js');
  if (token !== heroToken) return; // superseded by a newer request
  const canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;
  try {
    const created = await createHero3D(canvas, {
      type: runtime.effect3d,
      image: runtime.heroImage,
      accent: runtime.theme?.accent || '#00d4ff',
      light: runtime.theme?.mode === 'light',
      mobile: isMobile(),
    });
    if (token !== heroToken) return created?.destroy();
    hero = created;
  } catch (err) {
    console.warn('3D hero unavailable, showing the still image.', err);
  }
}

function scheduleHero3D() {
  if (!wantsHero3D()) return;
  // Load the 3D module after the page is interactive so it never competes with first paint.
  const run = () => startHero3D();
  const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(run, { timeout: 2000 }) : setTimeout(run, 400));
  if (document.readyState === 'complete') idle();
  else window.addEventListener('load', idle, { once: true });
}

reduceMotion.addEventListener?.('change', () => location.reload());

/* --------------------------------------------------------- live preview */

let renderModule = null;

async function applyPreviewConfig(config) {
  renderModule ||= await import('./render.js');
  const { renderBody, themeCss, fontsHref } = renderModule;
  runtime = { effect3d: config.effect3d, theme: config.theme, heroImage: config.hero?.image };

  document.getElementById('theme-vars').textContent = themeCss(config);
  document.documentElement.dataset.mode = config.theme?.mode === 'light' ? 'light' : 'dark';
  document.documentElement.lang = config.meta?.lang || 'hu';
  document.title = config.meta?.title || config.brand?.name || '';
  const fontLink = document.getElementById('font-css');
  const href = fontsHref(config);
  if (fontLink && href && fontLink.getAttribute('href') !== href) {
    fontLink.media = 'all';
    fontLink.href = href;
  }

  const y = window.scrollY;
  const keptCanvas = hero?.canvas;
  gsapCtx?.revert();
  gsapCtx = null;
  document.documentElement.classList.add('no-intro');
  document.getElementById('app').innerHTML = renderBody(config);

  const sameHero = hero && hero.type === runtime.effect3d && hero.image === runtime.heroImage && hero.light === (runtime.theme?.mode === 'light') && wantsHero3D();
  const freshCanvas = document.querySelector('.hero-canvas');
  if (sameHero && freshCanvas && keptCanvas) {
    // Keep the live 3D stage (its observers are bound to it) instead of the freshly rendered one.
    freshCanvas.parentElement.replaceWith(keptCanvas.parentElement);
    hero.setAccent(runtime.theme?.accent || '#00d4ff');
  } else {
    startHero3D();
  }

  initPage({ animateIn: false });
  ScrollTrigger.refresh();
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
}

function initPreviewBridge() {
  let pending = null;
  let busy = false;
  const flush = async () => {
    if (busy || !pending) return;
    busy = true;
    const config = pending;
    pending = null;
    try {
      await applyPreviewConfig(config);
    } finally {
      busy = false;
      flush();
    }
  };
  window.addEventListener('message', (e) => {
    if (e.origin !== location.origin || !e.data || typeof e.data !== 'object') return;
    if (e.data.type === 'site-config' && e.data.config) {
      pending = e.data.config;
      flush();
    } else if (e.data.type === 'scroll-to') {
      const target = e.data.id === 'hero' ? 0 : document.getElementById(e.data.id);
      if (target !== null) scrollToTarget(target);
    }
  });
  window.parent?.postMessage({ type: 'preview-ready' }, location.origin);
}

/* -------------------------------------------------------------------- boot */

initLenis();
initPage({ animateIn: true });
scheduleHero3D();
if (PREVIEW) initPreviewBridge();
window.addEventListener('load', () => ScrollTrigger.refresh());
