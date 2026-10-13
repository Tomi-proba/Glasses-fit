// Site runtime: smooth scrolling, scroll animations, micro-interactions,
// lazy 3D hero and (inside the configurator iframe) live preview updates.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const PREVIEW = new URLSearchParams(location.search).has('preview');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const isMobile = () => matchMedia('(max-width: 760px), (pointer: coarse)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

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

// Card tilt + glow and magnetic buttons (fine pointers only, never with reduced motion).
let tiltEl = null;
let magnetEl = null;
document.addEventListener('pointermove', (e) => {
  if (!finePointer.matches || reduceMotion.matches) return;
  const card = e.target.closest?.('.tilt');
  if (tiltEl && tiltEl !== card) tiltEl.style.removeProperty('--rx'), tiltEl.style.removeProperty('--ry');
  tiltEl = card;
  if (card) {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.style.setProperty('--rx', `${(0.5 - py) * 6}deg`);
    card.style.setProperty('--ry', `${(px - 0.5) * 8}deg`);
    card.style.setProperty('--gx', `${px * 100}%`);
    card.style.setProperty('--gy', `${py * 100}%`);
  }
  const btn = e.target.closest?.('.magnetic');
  if (magnetEl && magnetEl !== btn) magnetEl.style.removeProperty('--mx'), magnetEl.style.removeProperty('--my');
  magnetEl = btn;
  if (btn) {
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--mx', `${(e.clientX - r.left - r.width / 2) * 0.18}px`);
    btn.style.setProperty('--my', `${(e.clientY - r.top - r.height / 2) * 0.25}px`);
  }
}, { passive: true });

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
    if (!ok && !firstInvalid) firstInvalid = f;
  }
  status.className = 'form-status';
  if (firstInvalid) {
    status.textContent = 'Kérjük, töltsd ki helyesen a kötelező mezőket.';
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

function initAnimations({ animateIn }) {
  const reveals = gsap.utils.toArray('[data-reveal]');
  const counts = gsap.utils.toArray('.count[data-count]');

  if (!animateIn || reduceMotion.matches) {
    gsap.set(reveals, { opacity: 1, y: 0 });
    counts.forEach((el) => { el.textContent = formatCount(Number(el.dataset.count) || 0); });
    if (reduceMotion.matches) return;
  } else {
    ScrollTrigger.batch(reveals, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, overwrite: true }),
    });
    counts.forEach((el) => {
      const target = Number(el.dataset.count) || 0;
      const state = { v: 0 };
      el.textContent = '0';
      ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => gsap.to(state, { v: target, duration: 2, ease: 'power3.out', onUpdate: () => { el.textContent = formatCount(state.v); } }),
      });
    });
  }

  // Parallax layers.
  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    gsap.to('.hero-inner', { yPercent: 28, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-bg', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } });
  }
  gsap.utils.toArray('[data-parallax]').forEach((wrap) => {
    const img = wrap.querySelector('img');
    const speed = Number(wrap.dataset.parallax) || 0.1;
    if (img) gsap.fromTo(img, { yPercent: -speed * 100 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.utils.toArray('.about-orb').forEach((orb) => {
    gsap.fromTo(orb, { y: 60 }, { y: -60, ease: 'none', scrollTrigger: { trigger: orb.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
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
  return runtime.effect3d && runtime.effect3d !== 'none' && !reduceMotion.matches && document.querySelector('.hero-canvas') && hasFastWebGL();
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
  hero = createHero3D(canvas, {
    type: runtime.effect3d,
    accent: runtime.theme?.accent || '#00d4ff',
    light: runtime.theme?.mode === 'light',
    mobile: isMobile(),
  });
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
  runtime = { effect3d: config.effect3d, theme: config.theme };

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

  const sameHero = hero && hero.type === runtime.effect3d && hero.light === (runtime.theme?.mode === 'light') && wantsHero3D();
  const freshCanvas = document.querySelector('.hero-canvas');
  if (sameHero && freshCanvas && keptCanvas) {
    freshCanvas.replaceWith(keptCanvas);
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
