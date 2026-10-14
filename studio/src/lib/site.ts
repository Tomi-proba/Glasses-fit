// Shared behaviour for every studio page: header state, mobile menu, smooth scroll, scroll reveals.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isApp = document.documentElement.hasAttribute('data-app');
let lenis: Lenis | null = null;

if (!reduce && !isApp) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Header hairline once the page scrolls.
const header = document.querySelector('.site-header');
if (header) {
  ScrollTrigger.create({ start: 8, end: 'max', onToggle: (self) => header.classList.toggle('is-scrolled', self.isActive) });
}

// Mobile menu.
const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
const links = document.getElementById('nav-links');
const setMenu = (open: boolean) => {
  toggle?.setAttribute('aria-expanded', String(open));
  links?.classList.toggle('is-open', open);
};
toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

// In-page anchors (on the home page) scroll smoothly; links to other pages navigate normally.
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
  if (!a) return;
  const target = new URL(a.href);
  if (target.pathname.replace(/\/$/, '') !== location.pathname.replace(/\/$/, '') || !target.hash) return;
  const el = document.getElementById(decodeURIComponent(target.hash.slice(1)));
  if (!el) return;
  e.preventDefault();
  setMenu(false);
  if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.2 });
  else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  history.replaceState(null, '', target.hash);
});

// Headlines reveal word by word from behind a mask. Screen readers get the plain text via aria-label.
const splitTargets = [...document.querySelectorAll<HTMLElement>('[data-split], main h2.display')].filter((el) => !el.children.length && !isApp);
if (!reduce) {
  for (const el of splitTargets) {
    const text = el.textContent!.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(/\s+/).map((w) => `<span class="w" aria-hidden="true"><span>${w}</span></span>`).join(' ');
    el.removeAttribute('data-reveal');
    const words = el.querySelectorAll('.w > span');
    gsap.set(words, { yPercent: 110 });
    const play = () => gsap.to(words, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.045 });
    if (el.hasAttribute('data-split')) gsap.delayedCall(0.15, play);
    else ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: play });
  }
}

// Buttons: a soft sheen follows the pointer; large buttons lean towards it a little.
if (!reduce && matchMedia('(pointer: fine)').matches) {
  document.addEventListener('pointermove', (e) => {
    const btn = (e.target as Element).closest<HTMLElement>('.btn');
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--mx', `${e.clientX - r.left}px`);
    btn.style.setProperty('--my', `${e.clientY - r.top}px`);
    if (btn.classList.contains('btn-lg')) gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.08, y: (e.clientY - r.top - r.height / 2) * 0.18, duration: 0.4, ease: 'power3.out' });
  });
  document.addEventListener('pointerout', (e) => {
    const btn = (e.target as Element).closest<HTMLElement>('.btn-lg');
    if (btn && !btn.contains(e.relatedTarget as Node)) gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  });
}

// Scroll reveals: only content that starts below the fold is hidden first.
if (!reduce) {
  const below = (el: Element) => el.getBoundingClientRect().top > innerHeight * 0.92;
  gsap.utils.toArray<HTMLElement>('[data-reveal]').filter(below).forEach((el) => {
    gsap.set(el, { opacity: 0, y: 32 });
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out' }) });
  });
  gsap.utils.toArray<HTMLElement>('[data-stagger]').filter(below).forEach((group) => {
    const items = [...group.children];
    gsap.set(items, { opacity: 0, y: 28 });
    ScrollTrigger.create({ trigger: group, start: 'top 85%', once: true, onEnter: () => gsap.to(items, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }) });
  });
}

addEventListener('load', () => ScrollTrigger.refresh());

export { gsap, ScrollTrigger, lenis };
