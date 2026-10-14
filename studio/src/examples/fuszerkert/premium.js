// Fűszerkert Prémium: scroll-driven video scenes (the opening with its loading screen, the kitchen),
// a film strip of photos that scrolls sideways while pinned, and the shared premium motion.
import { initFuszerkert } from './shared.js';
import { initPremiumMotion, gsap, ScrollTrigger, lenis, reduceMotion } from '../motion-premium.js';
import { initScrollSequences } from '../scroll-sequence.js';

initFuszerkert();
initPremiumMotion();
initScrollSequences({ gsap, ScrollTrigger, lenis, reduceMotion });

// Film strip: vertical scrolling moves the photos sideways.
const strip = document.querySelector('[data-strip]');
const track = strip?.querySelector('[data-strip-track]');
if (strip && track && !reduceMotion && matchMedia('(min-width: 761px)').matches) {
  const distance = () => track.scrollWidth - innerWidth;
  gsap.to(track, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: strip, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true } });
}
