// Fűszerkert Prémium: scroll-driven video scenes (the spice opening with its loading screen, the
// kitchen further down), scroll effects on the photos and the shared premium motion.
import { initFuszerkert } from './shared.js';
import { initPremiumMotion, gsap, ScrollTrigger, lenis, reduceMotion } from '../motion-premium.js';
import { initScrollSequences } from '../scroll-sequence.js';

initFuszerkert();
initPremiumMotion();
initScrollSequences({ gsap, ScrollTrigger, lenis, reduceMotion });
