// Client-site runtime: smooth scroll, scroll animations (scaled by theme.motion), 3D hero,
// testimonials carousel, video facades, contact forms, and the live-preview bridge.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const params = new URLSearchParams(location.search);
const PREVIEW = root.hasAttribute('data-preview');
const THUMB = params.has('thumb');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => matchMedia('(max-width: 760px), (pointer: coarse)').matches;

let runtime = JSON.parse(document.getElementById('site-runtime')?.textContent || '{}');
const motion = () => (reduceMotion || THUMB ? 'none' : root.dataset.motion || 'normal');
const MOTION = {
  none: { y: 0, dur: 0, parallax: 0 },
  subtle: { y: 16, dur: 0.8, parallax: 0 },
  normal: { y: 30, dur: 1.1, parallax: 1 },
  strong: { y: 56, dur: 1.4, parallax: 1.8 },
};

let lenis = null;
let ctx = null;
let hero = null;
let heroToken = 0;

/* ---------------------------------------------------------- smooth scroll */

function setupLenis() {
  const want = motion() !== 'none' && !PREVIEW;
  if (want && !lenis) {
    lenis = new Lenis({ lerp: motion() === 'strong' ? 0.07 : 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis?.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}
function scrollToEl(el) {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -76, duration: 1.2 });
  else el.scrollIntoView({ behavior: motion() === 'none' ? 'auto' : 'smooth', block: 'start' });
}

/* --------------------------------------------------- delegated handlers */

const closeMenu = () => {
  document.querySelector('.nav-toggle')?.setAttribute('aria-expanded', 'false');
  document.getElementById('nav-menu')?.classList.remove('is-open');
};

document.addEventListener('click', (e) => {
  const toggle = e.target.closest('.nav-toggle');
  if (toggle) {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    document.getElementById('nav-menu')?.classList.toggle('is-open', open);
    return;
  }

  const quoteBtn = e.target.closest('[data-quote]');
  if (quoteBtn) {
    const stage = quoteBtn.closest('.block').querySelector('.quote-stage');
    const quotes = [...stage.querySelectorAll('.quote')];
    const cur = quotes.findIndex((q) => !q.hasAttribute('data-inactive'));
    const next = (cur + Number(quoteBtn.dataset.quote) + quotes.length) % quotes.length;
    quotes.forEach((q, i) => (i === next ? q.removeAttribute('data-inactive') : q.setAttribute('data-inactive', '')));
    return;
  }

  const video = e.target.closest('.video-facade');
  if (video) {
    const iframe = document.createElement('iframe');
    iframe.src = video.dataset.src;
    iframe.title = video.getAttribute('aria-label') || 'Videó';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.allowFullscreen = true;
    video.replaceWith(iframe);
    return;
  }

  const link = e.target.closest('a[href]');
  if (!link) return;
  // In the studio preview, links between pages switch the rendered page instead of navigating.
  if (PREVIEW && link.dataset.page) {
    e.preventDefault();
    closeMenu();
    window.parent?.postMessage({ type: 'page-change', pageId: link.dataset.page, anchor: link.dataset.anchor || '' }, location.origin);
    return;
  }
  const href = link.getAttribute('href');
  if (href.startsWith('#') && href.length > 1) {
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    e.preventDefault();
    closeMenu();
    scrollToEl(target);
  } else if (PREVIEW && !href.startsWith('#')) {
    e.preventDefault(); // keep the preview on this page; external links would leave the configurator
  }
});

document.addEventListener('keydown', (e) => e.key === 'Escape' && closeMenu());

// Contact forms: POST to the block's endpoint (e.g. Formspree), otherwise open the mail app.
document.addEventListener('submit', async (e) => {
  const form = e.target.closest('.contact-form');
  if (!form) return;
  e.preventDefault();
  const status = form.querySelector('.form-status');
  let first = null;
  for (const f of form.querySelectorAll('[required]')) {
    const ok = f.value.trim() !== '' && f.checkValidity();
    f.setAttribute('aria-invalid', String(!ok));
    const err = document.getElementById(`${f.id}-err`);
    if (err) err.textContent = ok ? '' : f.type === 'email' && f.value.trim() ? 'Ez nem érvényes e-mail cím.' : 'Ezt a mezőt ki kell tölteni.';
    if (!ok && !first) first = f;
  }
  status.className = 'form-status';
  status.textContent = '';
  if (first) return first.focus();
  if (form.elements._gotcha?.value) return;
  if (PREVIEW) {
    status.textContent = 'Előnézet: az üzenet nem kerül elküldésre.';
    status.classList.add('ok');
    return;
  }
  const data = new FormData(form);
  if (!form.dataset.endpoint) {
    const body = `${data.get('message')}\n\n${data.get('name')}\n${data.get('email')}`;
    location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent('Üzenet a weboldalról')}&body=${encodeURIComponent(body)}`;
    return;
  }
  const btn = form.querySelector('[type=submit]');
  btn.disabled = true;
  try {
    const res = await fetch(form.dataset.endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(String(res.status));
    form.reset();
    status.textContent = status.dataset.success;
    status.classList.add('ok');
  } catch {
    status.textContent = status.dataset.error;
  } finally {
    btn.disabled = false;
  }
});

/* ------------------------------------------------------------ animations */

const formatCount = (n) => Math.round(n).toLocaleString(root.lang || 'hu');

function initAnimations({ animateIn }) {
  const level = MOTION[motion()];
  const header = document.querySelector('.site-header');
  if (header) ScrollTrigger.create({ start: 8, end: 'max', onToggle: (s) => header.classList.toggle('is-scrolled', s.isActive) });

  const counts = gsap.utils.toArray('.count[data-count]');
  if (!level.dur || !animateIn) {
    counts.forEach((el) => { el.textContent = formatCount(Number(el.dataset.count) || 0); });
    if (!level.dur) return;
  } else {
    const below = (el) => el.getBoundingClientRect().top > innerHeight * 0.92;
    gsap.utils.toArray('.block > .container').filter(below).forEach((el) => {
      const group = el.querySelector('[data-reveal-group]');
      const targets = group ? [el.querySelector('.block-head'), ...group.children].filter(Boolean) : [el];
      gsap.set(targets, { opacity: 0, y: level.y });
      ScrollTrigger.create({ trigger: el, start: 'top 86%', once: true, onEnter: () => gsap.to(targets, { opacity: 1, y: 0, duration: level.dur, ease: 'expo.out', stagger: 0.07 }) });
    });
    counts.forEach((el) => {
      const target = Number(el.dataset.count) || 0;
      const state = { v: target * 0.5 };
      ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => gsap.to(state, { v: target, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = formatCount(state.v); } }) });
    });
  }
  if (level.parallax) {
    gsap.utils.toArray('img[data-parallax]').forEach((img) => {
      gsap.fromTo(img, { yPercent: -12 * level.parallax }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    const stage = document.querySelector('.hero-stage');
    if (stage) gsap.to(stage, { yPercent: 10 * level.parallax, ease: 'none', scrollTrigger: { trigger: stage.closest('.block'), start: 'top top', end: 'bottom top', scrub: true } });
  }
}

function initPage({ animateIn }) {
  ctx?.revert();
  ctx = gsap.context(() => initAnimations({ animateIn }));
}

/* --------------------------------------------------------------- 3D hero */

let gpuOk = null;
function hasFastWebGL() {
  if (gpuOk !== null) return gpuOk;
  if (params.get('3d') === 'force') return (gpuOk = true);
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) || c.getContext('webgl', { failIfMajorPerformanceCaveat: true });
    const info = gl?.getExtension('WEBGL_debug_renderer_info');
    const name = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    gpuOk = !!gl && !/swiftshader|llvmpipe|software|basic render/i.test(name);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    gpuOk = false;
  }
  return gpuOk;
}

const heroStage = () => document.querySelector('.hero-stage:has(.hero-canvas)');
const heroKey = (stage) => (stage ? `${stage.dataset.effect}|${stage.dataset.image}|${root.dataset.mode}` : '');

async function startHero3D() {
  const token = ++heroToken;
  hero?.destroy();
  hero = null;
  const stage = heroStage();
  if (!stage || motion() === 'none' || !hasFastWebGL()) return;
  const { createHero3D } = await import('./hero3d.js');
  if (token !== heroToken) return;
  try {
    const created = await createHero3D(stage.querySelector('.hero-canvas'), {
      type: stage.dataset.effect,
      image: stage.dataset.image,
      accent: getComputedStyle(root).getPropertyValue('--accent').trim() || runtime.accent,
      light: root.dataset.mode === 'light',
      mobile: isMobile(),
    });
    if (token !== heroToken) return created?.destroy();
    hero = created;
    hero.key = heroKey(stage);
  } catch (err) {
    console.warn('3D hero unavailable, showing the still image.', err);
  }
}

function scheduleHero3D() {
  const run = () => startHero3D();
  const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(run, { timeout: 2000 }) : setTimeout(run, 400));
  if (document.readyState === 'complete') idle();
  else addEventListener('load', idle, { once: true });
}

/* ---------------------------------------------------------- live preview */

let render = null;
async function applyPreview(config, pageId, anchor) {
  if (!render) {
    render = await import('./render.js');
    render.setAssetBase(root.dataset.assetBase || '');
  }
  const ctxRender = { pageId, root: '#' };
  document.getElementById('theme-vars').textContent = render.themeCss(config);
  for (const [k, v] of Object.entries(render.rootAttrs(config))) root.setAttribute(k, v);
  const font = document.getElementById('font-css');
  const href = render.fontsHref(config);
  if (font && font.getAttribute('href') !== href) { font.media = 'all'; font.href = href; }

  const samePage = runtime.pageId === render.findPage(config, pageId).id;
  const y = samePage ? scrollY : 0;
  const oldStage = hero ? heroStage() : null;
  ctx?.revert();
  ctx = null;
  document.getElementById('app').innerHTML = render.renderBody(config, ctxRender);
  runtime = render.runtimeData(config, ctxRender);
  document.title = config.brand?.name || '';

  const fresh = heroStage();
  if (hero && oldStage && fresh && hero.key === heroKey(fresh)) {
    fresh.replaceWith(oldStage); // keep the running 3D scene instead of rebuilding it
    hero.setAccent(getComputedStyle(root).getPropertyValue('--accent').trim());
  } else {
    startHero3D();
  }
  initPage({ animateIn: false });
  ScrollTrigger.refresh();
  window.scrollTo(0, y);
  if (anchor) scrollToEl(document.getElementById(anchor));
}

function initPreviewBridge() {
  let pending = null;
  let busy = false;
  const flush = async () => {
    if (busy || !pending) return;
    busy = true;
    const job = pending;
    pending = null;
    try { await applyPreview(job.config, job.pageId, job.anchor); } finally { busy = false; flush(); }
  };
  addEventListener('message', (e) => {
    if (e.origin !== location.origin || !e.data || typeof e.data !== 'object') return;
    if (e.data.type === 'site-config') {
      pending = { config: e.data.config, pageId: e.data.pageId, anchor: e.data.anchor };
      flush();
    } else if (e.data.type === 'scroll-to') {
      scrollToEl(document.getElementById(`b-${e.data.blockId}`));
    }
  });
  window.parent?.postMessage({ type: 'preview-ready' }, location.origin);
}

/* ------------------------------------------------------------------ boot */

setupLenis();
initPage({ animateIn: !THUMB });
if (!THUMB) scheduleHero3D();
if (PREVIEW) initPreviewBridge();
addEventListener('load', () => ScrollTrigger.refresh());
