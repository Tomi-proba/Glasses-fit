// Kékvíz Medence (Prémium): the pool gets built as you scroll, and a cover you can close yourself.
//
// Opening scene: one pinned section, scroll progress p (0..1) → t = p × 6 across the seven photos.
// Every photo fades in over the previous one in the middle of its step, while the whole stack zooms in
// slowly and continuously, so the small differences between the photos never read as a jump.
// The last step (07 → 08) is not a fade: a soft-edged mask moves along the cover's rails, so the
// closed cover seems to slide over the pool.
import { initPremiumMotion, gsap, ScrollTrigger, reduceMotion } from '../motion-premium.js';

// Direction the cover closes in, as a CSS gradient angle: along the rails, from the far left end of the
// pool (where the folded cover stands in 07) towards the steps, about 14° below horizontal.
const RAIL_ANGLE = '104deg';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => { const x = clamp(v); return x * x * (3 - 2 * x); };

initPremiumMotion();

/* menu on phones */
const menuBtn = $('.x-menu');
const nav = $('#kv-nav');
const setMenu = (open) => { menuBtn?.setAttribute('aria-expanded', String(open)); nav?.classList.toggle('is-open', open); if (menuBtn) menuBtn.textContent = open ? 'Bezárás' : 'Menü'; };
menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
nav?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

/* the photos after the first load once the page itself is in */
const loadRest = () => {
  for (const el of $$('[data-srcset]')) { el.srcset = el.dataset.srcset; el.removeAttribute('data-srcset'); }
  for (const el of $$('img[data-src]')) { el.src = el.dataset.src; el.removeAttribute('data-src'); }
};
if (document.readyState === 'complete') loadRest(); else addEventListener('load', loadRest, { once: true });

/* ---------- the opening scene ---------- */
const build = $('[data-build]');
const shots = $$('[data-shot]', build);
const last = shots.length - 1;
shots[last].dataset.mask = '';
shots[last].style.setProperty('--a', RAIL_ANGLE);
const media = $('[data-media]', build);
const phases = $$('[data-phase]', build);
const count = $('[data-phase-count]', build);
const bar = $('[data-bar]', build);
const day = $('[data-head="day"]', build);
const night = $('[data-head="night"]', build);
let shown = 0;

function render(p) {
  const t = p * last;
  for (let i = 1; i < last; i++) shots[i].style.opacity = String(smooth((t - (i - 1) - 0.3) / 0.4));
  // the mask starts where 07's folded cover already is, so that part fades in first, then the edge sweeps
  shots[last].style.opacity = String(smooth((t - (last - 1) + 0.25) / 0.3));
  shots[last].style.setProperty('--r', smooth((t - (last - 1) - 0.12) / 0.76).toFixed(4));
  media.style.transform = `scale(${1 + p * 0.07})`;
  const n = smooth((t - (last - 2) - 0.25) / 0.5); // the evening title arrives with the cover
  day.style.opacity = String(1 - n);
  day.style.visibility = n > 0.98 ? 'hidden' : 'visible';
  night.style.opacity = String(n);
  night.style.visibility = n < 0.02 ? 'hidden' : 'visible';
  bar.style.transform = `scaleX(${p})`;
  const k = Math.min(last, Math.floor(t + 0.3)); // switches when the new photo is mostly in
  if (k !== shown) {
    phases[shown].classList.remove('is-on');
    phases[k].classList.add('is-on');
    count.textContent = String(k + 1).padStart(2, '0');
    shown = k;
  }
}

if (reduceMotion) {
  build.classList.add('kv-still');
  phases[0].classList.remove('is-on');
  phases[last].classList.add('is-on');
  count.textContent = String(last + 1).padStart(2, '0');
  bar.style.transform = 'scaleX(1)';
  loadRest();
} else {
  const state = { p: 0 };
  ScrollTrigger.create({
    trigger: build,
    start: 'top top',
    end: () => `+=${innerHeight * (matchMedia('(max-width: 760px)').matches ? 4.6 : 5.6)}`,
    pin: $('[data-sticky]', build),
    scrub: 0.5,
    animation: gsap.to(state, { p: 1, ease: 'none', paused: true, onUpdate: () => render(state.p) }),
    invalidateOnRefresh: true,
  });
  render(0);
}

/* ---------- open and close the cover yourself ---------- */
const range = $('[data-demo-range]');
const pics = $$('[data-demo]');
const stateLabel = $('[data-demo-state]');
const demoStage = $('[data-demo-pics]');
pics[2]?.style.setProperty('--a', RAIL_ANGLE);
pics[2]?.setAttribute('data-mask', '');
function setCover(v) {
  const x = v / 100;
  if (pics[1]) pics[1].style.opacity = String(smooth(x / 0.5));
  if (pics[2]) { pics[2].style.opacity = String(smooth((x - 0.42) / 0.1)); pics[2].style.setProperty('--r', smooth((x - 0.52) / 0.48).toFixed(4)); }
  const label = x < 0.2 ? 'Nyitva' : x > 0.85 ? 'Zárva' : 'Félig';
  stateLabel.textContent = label;
  range.setAttribute('aria-valuetext', label.toLowerCase());
}
range?.addEventListener('input', () => setCover(Number(range.value)));
setCover(Number(range?.value || 0));
// dragging on the picture moves the cover too
if (demoStage && range) {
  let start = null;
  demoStage.addEventListener('pointerdown', (e) => { start = { x: e.clientX, v: Number(range.value) }; demoStage.setPointerCapture(e.pointerId); });
  demoStage.addEventListener('pointermove', (e) => {
    if (!start) return;
    const v = Math.round(Math.min(100, Math.max(0, start.v + ((e.clientX - start.x) / demoStage.clientWidth) * 140)));
    range.value = String(v);
    setCover(v);
  });
  const end = () => { start = null; };
  demoStage.addEventListener('pointerup', end);
  demoStage.addEventListener('pointercancel', end);
}

/* ---------- quote form (demo: validates, then thanks without sending) ---------- */
const form = $('[data-quote-form]');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const missing = [...form.querySelectorAll('[required]')].filter((i) => !i.value.trim() || !i.checkValidity());
  for (const i of form.querySelectorAll('[required]')) i.setAttribute('aria-invalid', String(missing.includes(i)));
  const err = $('[data-form-err]', form);
  if (missing.length) { err.textContent = 'Kérjük, adja meg a nevét, telefonszámát, e-mail címét és a települést.'; missing[0].focus(); return; }
  err.textContent = '';
  form.querySelector('button[type=submit]').hidden = true;
  $('[data-form-ok]', form).hidden = false;
});
