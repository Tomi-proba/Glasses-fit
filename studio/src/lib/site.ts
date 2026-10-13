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
