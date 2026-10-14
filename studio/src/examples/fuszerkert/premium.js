// Fűszerkert Prémium: the spice cabinet intro (once per visit, skippable), which then settles into
// the hero card and keeps idling there; plus the shared premium motion.
import { initFuszerkert } from './shared.js';
import { initPremiumMotion, gsap, lenis, reduceMotion, coarse } from '../motion-premium.js';
import { hasFastWebGL } from '../../lib/gpu';
import { JARS } from './content';

initFuszerkert();
initPremiumMotion();

const KEY = 'fuszerkert:intro-seen';
const root = document.documentElement;
const slot = document.querySelector('[data-stage-slot]');
const stage = document.querySelector('[data-cabinet]');
const skipBtn = stage?.querySelector('[data-skip]');
const bar = stage?.querySelector('[data-intro-progress]');
const lines = document.querySelectorAll('[data-hero-line]');
const mobile = matchMedia('(max-width: 760px)').matches || coarse;
const seen = (() => { try { return !!sessionStorage.getItem(KEY); } catch { return true; } })();
const canRun = !!stage && hasFastWebGL();
const playIntro = canRun && !reduceMotion && !seen && scrollY < 40 && !location.hash;

const heroIn = () => {
  if (reduceMotion) return;
  gsap.fromTo(lines, { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.1 });
};

if (playIntro) {
  root.classList.add('is-intro');
  stage.classList.add('is-intro');
  gsap.set(lines, { opacity: 0 });
  lenis?.stop();
}

/** Moves the full-screen stage into its hero card (FLIP), then hands the page back. */
function settle(fast = false) {
  if (!stage.classList.contains('is-intro')) return;
  skipBtn.hidden = true;
  const to = slot.getBoundingClientRect();
  const radius = getComputedStyle(root).getPropertyValue('--r-media').trim() || '18px';
  gsap.to(stage, {
    top: to.top, left: to.left, width: to.width, height: to.height, borderRadius: radius,
    duration: fast ? 0.7 : 1.5, ease: 'expo.inOut',
    onStart: () => { gsap.set(stage, { inset: 'auto', top: 0, left: 0, width: innerWidth, height: innerHeight }); },
    onComplete: () => {
      stage.classList.remove('is-intro');
      gsap.set(stage, { clearProps: 'all' });
      root.classList.remove('is-intro');
      lenis?.start();
    },
  });
  heroIn();
  try { sessionStorage.setItem(KEY, '1'); } catch { /* storage off */ }
}

async function boot() {
  if (!canRun) { heroIn(); return; }
  let cabinet;
  try {
    const { createCabinet } = await import('./cabinet.js');
    cabinet = createCabinet(stage.querySelector('canvas'), { jars: JARS, mobile });
  } catch {
    if (playIntro) settle(true);
    return;
  }
  if (!coarse) addEventListener('pointermove', (e) => cabinet.setPointer(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5), { passive: true });
  stage.classList.add('is-live');

  if (reduceMotion) { cabinet.showOpen(); cabinet.renderOnce(); return; }
  cabinet.start();
  new IntersectionObserver((entries) => (entries.at(-1).isIntersecting ? cabinet.start() : cabinet.stop())).observe(stage);

  if (!playIntro) { cabinet.showOpen(); heroIn(); return; }
  skipBtn.hidden = false;
  skipBtn.focus({ preventScroll: true });
  let done = false;
  const finish = (fast) => { if (!done) { done = true; settle(fast); } };
  skipBtn.addEventListener('click', () => { cabinet.timeline?.kill(); cabinet.showOpen(); finish(true); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !done) skipBtn.click(); });
  const ui = stage.querySelector('[data-intro-ui]');
  cabinet.playIntro({
    onProgress: (p) => { gsap.set(bar, { scaleX: p }); ui.style.opacity = String(p < 0.3 ? 1 : Math.max(0, 1 - (p - 0.3) * 6)); },
    onSettle: () => finish(false),
  });
}

// The intro must not wait for the idle callback; the hero card can.
if (playIntro) boot();
else {
  const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(boot, { timeout: 1500 }) : setTimeout(boot, 300));
  if (document.readyState === 'complete') idle();
  else addEventListener('load', idle, { once: true });
}
// Safety net: never keep the visitor locked in the intro.
if (playIntro) setTimeout(() => { if (stage.classList.contains('is-intro') && !stage.classList.contains('is-live')) settle(true); }, 5000);
