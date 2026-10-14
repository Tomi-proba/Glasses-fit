// Aurum Ingatlan Prémium: scroll-driven video walkthrough in the hero, scroll effects on the photos,
// tilt cards and the shared premium motion.
import { initAurum } from './listings.js';
import { initPremiumMotion, gsap, ScrollTrigger, lenis, reduceMotion } from '../motion-premium.js';
import { initScrollSequences } from '../scroll-sequence.js';

initAurum({ viewTransitions: true });
initPremiumMotion();
initScrollSequences({ gsap, ScrollTrigger, lenis, reduceMotion });
