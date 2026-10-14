// Motion layer of the Prémium examples: Lenis smooth scroll, GSAP ScrollTrigger reveals, counters,
// parallax and pointer tilt. Everything is skipped with prefers-reduced-motion.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const coarse = matchMedia('(pointer: coarse)').matches;
export let lenis = null;

export function initPremiumMotion({ headerSel = '[data-header]' } = {}) {
  const fmt = (n, d) => n.toLocaleString('hu-HU', { minimumFractionDigits: d, maximumFractionDigits: d });
  if (reduceMotion) return;

  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') {
      if (a) { e.preventDefault(); lenis.scrollTo(0, { duration: 1.4 }); }
      return;
    }
    const el = document.querySelector(a.getAttribute('href'));
    if (!el || a.closest('dialog')) return;
    e.preventDefault();
    lenis.scrollTo(el, { offset: -20, duration: 1.4 });
  });
  // Dialogs keep native scrolling.
  for (const d of document.querySelectorAll('dialog')) {
    new MutationObserver(() => (d.open ? lenis.stop() : lenis.start())).observe(d, { attributes: true, attributeFilter: ['open'] });
  }

  // Header hides while scrolling down, returns when scrolling up.
  const header = document.querySelector(headerSel);
  if (header) {
    let last = 0;
    lenis.on('scroll', ({ scroll }) => {
      header.classList.toggle('is-hidden', scroll > 400 && scroll > last);
      last = scroll;
    });
  }

  // Reveals, staggered within a shared parent.
  const below = (el) => el.getBoundingClientRect().top > innerHeight * 0.9;
  const groups = new Map();
  for (const el of document.querySelectorAll('[data-reveal]')) {
    if (!below(el)) continue;
    const key = el.parentElement;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(el);
  }
  for (const els of groups.values()) {
    gsap.set(els, { opacity: 0, y: 40 });
    ScrollTrigger.batch(els, { start: 'top 88%', once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09 }) });
  }

  // Counters.
  for (const el of document.querySelectorAll('[data-count]')) {
    const to = Number(el.dataset.count);
    const d = Number(el.dataset.decimals || 0);
    const obj = { v: 0 };
    el.textContent = fmt(0, d);
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => gsap.to(obj, { v: to, duration: 2, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(obj.v, d); } }) });
  }

  // Parallax: the image moves slower than its frame.
  for (const el of document.querySelectorAll('[data-parallax]')) {
    const img = el.querySelector('.ph-img');
    if (!img) continue;
    el.style.overflow = 'hidden';
    gsap.fromTo(img, { yPercent: -8, scale: 1.16 }, { yPercent: 8, scale: 1.16, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  // Pointer tilt with a soft glare.
  if (!coarse) {
    for (const el of document.querySelectorAll('[data-tilt]')) {
      const host = el.closest('button, a') || el;
      host.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.classList.add('is-tilting');
        el.style.setProperty('--gx', `${x * 100}%`);
        el.style.setProperty('--gy', `${y * 100}%`);
        gsap.to(el, { rotateY: (x - 0.5) * 9, rotateX: (0.5 - y) * 7, transformPerspective: 900, duration: 0.5, ease: 'power2.out' });
      });
      host.addEventListener('pointerleave', () => {
        el.classList.remove('is-tilting');
        gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'expo.out' });
      });
    }
  }
}
