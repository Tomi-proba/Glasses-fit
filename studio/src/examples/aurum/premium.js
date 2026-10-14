// Aurum Ingatlan Prémium: villa 3D hero with a scroll fly-in, plus the shared premium motion.
import { initAurum } from './listings.js';
import { initPremiumMotion, gsap, ScrollTrigger, reduceMotion, coarse } from '../motion-premium.js';
import { hasFastWebGL } from '../../lib/gpu';

initAurum({ viewTransitions: true });
initPremiumMotion();

const hero = document.querySelector('[data-hero]');
const stage = hero?.querySelector('[data-villa]');
const mobile = matchMedia('(max-width: 760px)').matches || coarse;

// Hero copy entrance.
if (!reduceMotion) {
  gsap.from('[data-hero-line]', { opacity: 0, y: 46, duration: 1.4, ease: 'expo.out', stagger: 0.12, delay: 0.2 });
}

async function bootVilla() {
  if (!stage || !hasFastWebGL()) return;
  const { createVilla } = await import('./villa.js');
  const villa = createVilla(stage.querySelector('canvas'), { mobile });
  if (reduceMotion) {
    villa.renderOnce();
    stage.classList.add('is-live');
    return;
  }
  villa.start();
  requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add('is-live')));

  if (!coarse) {
    addEventListener('pointermove', (e) => villa.setPointer(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5), { passive: true });
  }
  // Fly in through the glass facade while the hero is pinned (desktop) or scrolls away (mobile).
  const copy = hero.querySelector('.au-hero-copy');
  const shade = hero.querySelector('.au-hero-shade');
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: mobile ? 'bottom top' : '+=130%',
    pin: !mobile,
    scrub: true,
    onUpdate: ({ progress }) => {
      villa.setProgress(progress);
      gsap.set(copy, { opacity: 1 - progress * 2.6, y: -progress * 120 });
      gsap.set(shade, { opacity: 1 - progress * 1.4 });
      gsap.set(stage, { opacity: progress > 0.82 ? 1 - (progress - 0.82) / 0.18 : 1 });
    },
  });
  // Stop rendering while the hero is off screen.
  // Pinning re-parents the hero, so one batch can hold a stale entry first: the last one counts.
  new IntersectionObserver((entries) => (entries.at(-1).isIntersecting ? villa.start() : villa.stop())).observe(stage);
}

const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(bootVilla, { timeout: 1500 }) : setTimeout(bootVilla, 300));
if (document.readyState === 'complete') idle();
else addEventListener('load', idle, { once: true });
