// Pixel Pont Prémium: the machine, the fly-in and the main menu inside the screen.
//
// One number drives the fly-in: p (0..1). Scrolling scrubs it (pinned ScrollTrigger); click, tap,
// Enter or Space inserts a coin and scrolls to the end by itself, so both paths look the same.
// render(p) zooms the photo into the CRT screen, fades the texts, speeds up the streaks and
// flashes; at the end the page switches to the "inside" state (the menu), where scrolling is locked
// and every screen scrolls on its own. "Vissza a géphez" scrolls back, which plays the flight in reverse.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { hasFastWebGL } from '../../lib/gpu';
import { sound } from './sound.js';
import { initArcadeShared } from './shared.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
initArcadeShared();

const html = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const phone = matchMedia('(max-width: 760px)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const intro = $('[data-intro]');
const stage = $('[data-stage]');
const cam = $('[data-cam]');
const machine = $('[data-machine]');
const floor = $('[data-floor]');
const crt = $('[data-start]');
const flash = $('[data-flash]');
const rays = $('[data-rays]');
const warpCanvas = $('[data-warp]');
const copies = $$('[data-intro-copy]');
const tube = $('[data-tube]');
const powerOn = $('[data-on]');

/* ---------- sound and credits ---------- */
const soundBtn = $('[data-sound]');
const setSoundUI = () => {
  soundBtn.setAttribute('aria-pressed', String(sound.on));
  $('[data-sound-label]').textContent = sound.on ? 'be' : 'ki';
};
setSoundUI();
soundBtn.addEventListener('click', () => { sound.toggle(); setSoundUI(); });
let credits = 0;
const addCredit = () => {
  credits = Math.min(99, credits + 1);
  $('[data-credit]').textContent = String(credits).padStart(2, '0');
};

/* ---------- the machine: layout ---------- */
// The CRT screen inside the photo (1456 x 819), measured on the image.
const IMG = { w: 1456, h: 819 };
const SCREEN = { x: 599, y: 186, w: 258, h: 172 };
const L = { W: 0, H: 0, cx: 0, cy: 0, S: 1 };

function layout() {
  const W = stage.clientWidth;
  const H = stage.clientHeight;
  const portrait = W / H < 0.9;
  // Desktop: the photo covers the stage. Phones: the machine stands a bit smaller, leaving room for the title.
  const c = Math.max(W / IMG.w, (H * (portrait ? 0.8 : 1)) / IMG.h);
  const iw = IMG.w * c;
  const ih = IMG.h * c;
  const left = (W - iw) / 2;
  const top = portrait ? H * 0.035 : (H - ih) / 2;
  Object.assign(machine.style, { width: `${iw}px`, height: `${ih}px`, left: `${left}px`, top: `${top}px` });
  const sx = left + SCREEN.x * c;
  const sy = top + SCREEN.y * c;
  const sw = SCREEN.w * c;
  const sh = SCREEN.h * c;
  Object.assign(crt.style, { left: `${sx}px`, top: `${sy}px`, width: `${sw}px`, height: `${sh}px` });
  Object.assign(floor.style, { left: `${left + 380 * c}px`, top: `${top + 600 * c}px`, width: `${700 * c}px`, height: `${200 * c}px` });
  Object.assign(L, { W, H, cx: sx + sw / 2, cy: sy + sh / 2, S: Math.max(W / sw, H / sh) * 1.12 });
  cam.style.transformOrigin = `${L.cx}px ${L.cy}px`;
  warp?.resize(W, H);
}

/* ---------- the fly-in ---------- */
const clamp = (v) => Math.min(1, Math.max(0, v));
const range = (p, a, b) => clamp((p - a) / (b - a));
const smooth = (t) => t * t * (3 - 2 * t);
const state = { p: 0, vx: 0, vy: 0, intensity: 0 };
let warp = null;
let inside = false;
let armed = true; // false while flying back out, so reaching p = 1 does not re-enter at once

function render() {
  const { p } = state;
  const z = Math.pow(range(p, 0.04, 0.95), 2.2); // zoom: slow first, then rushing
  const s = Math.pow(L.S, z);
  const m = smooth(range(p, 0.04, 0.9));
  const tx = (L.W / 2 - L.cx) * m;
  const ty = (L.H / 2 - L.cy) * m;
  cam.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${s})`;
  cam.style.setProperty('--crt-on', range(p, 0.45, 0.92).toFixed(3));
  cam.style.setProperty('--crt-text', (1 - range(p, 0.02, 0.12)).toFixed(3));
  for (const c of copies) c.style.opacity = String(1 - range(p, 0, 0.1));
  flash.style.opacity = String(range(p, 0.84, 0.97));
  state.vx = L.cx + tx;
  state.vy = L.cy + ty;
  state.intensity = smooth(range(p, 0.05, 0.92)) * (1 - range(p, 0.96, 1) * 0.5);
  rays.style.opacity = warp ? '0' : String(state.intensity * 0.9);
  rays.style.transform = `translate(${state.vx - L.W / 2}px, ${state.vy - L.H / 2}px) scale(${1 + state.intensity * 2.4})`;
  if (p < 0.5) armed = true;
  if (p >= 0.985 && armed && !inside) enterInside();
}

// streaks: only while they are visible
let last = performance.now();
function tick() {
  const now = performance.now();
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const visible = !inside && state.intensity > 0.002;
  warpCanvas.classList.toggle('is-on', visible);
  if (visible) warp.frame(dt, state.intensity, state.vx, state.vy);
}

/* ---------- inside: the menu ---------- */
const screens = Object.fromEntries($$('[data-screen]').map((el) => [el.dataset.screen, el]));
const menuItems = $$('[data-open]');
const hintOut = $('[data-hint-out]');
let current = 'menu';
let lastItem = menuItems[0];

function show(name, { focus = true } = {}) {
  for (const [k, el] of Object.entries(screens)) el.hidden = k !== name;
  current = name;
  if (!reduce) gsap.fromTo(screens[name], { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.28, ease: 'steps(7)' });
  if (!focus) return;
  if (name === 'menu') lastItem.focus({ preventScroll: true });
  else screens[name].focus({ preventScroll: true });
  screens[name].scrollTop = 0;
}

const select = (btn) => {
  if (lastItem === btn) return;
  menuItems.forEach((b) => (b.tabIndex = b === btn ? 0 : -1));
  lastItem = btn;
  hintOut.textContent = btn.dataset.hint;
  sound.play('move');
};
for (const btn of menuItems) {
  btn.addEventListener('focus', () => select(btn));
  btn.addEventListener('pointerenter', () => { if (matchMedia('(hover: hover)').matches) btn.focus({ preventScroll: true }); });
  btn.addEventListener('click', () => { sound.play('select'); show(btn.dataset.open); });
}
for (const b of $$('[data-back]')) b.addEventListener('click', () => { sound.play('back'); show('menu'); });

document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, select, textarea')) return;
  if (!inside) {
    // the start button is a real button; elsewhere Enter and Space also start
    if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a, button')) { e.preventDefault(); start(); }
    return;
  }
  if (current === 'menu') {
    const i = menuItems.indexOf(lastItem);
    const d = { ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (d) { e.preventDefault(); menuItems[(i + d + menuItems.length) % menuItems.length].focus(); }
    if (e.key === 'Home') { e.preventDefault(); menuItems[0].focus(); }
    if (e.key === 'End') { e.preventDefault(); menuItems.at(-1).focus(); }
  } else if (e.key === 'Escape' || (e.key === 'Backspace' && !e.target.closest('input'))) {
    e.preventDefault();
    sound.play('back');
    show('menu');
  }
});

/* ---------- switching between the machine and the inside ---------- */
let st = null;

function enterInside() {
  inside = true;
  armed = false;
  html.classList.add('is-inside');
  show('menu', { focus: false });
  lastItem.focus({ preventScroll: true });
  if (reduce) return;
  // the screen powers on out of the flash
  gsap.fromTo(tube, { scaleY: 0.012, scaleX: 1.02, filter: 'brightness(3)' }, { scaleY: 1, scaleX: 1, filter: 'brightness(1)', duration: 0.42, ease: 'expo.out', clearProps: 'filter,transform' });
  gsap.fromTo(powerOn, { opacity: 1 }, { opacity: 0, duration: 0.7, ease: 'power2.out' });
}

function leaveInside() {
  sound.play('back');
  const out = () => {
    inside = false;
    html.classList.remove('is-inside');
    if (reduce || !st) { scrollTo(0, 0); crt.focus({ preventScroll: true }); return; }
    // now at the end of the flight: fly back out
    state.p = 1; render();
    gsap.to(window, { scrollTo: { y: 0, autoKill: true }, duration: 2.1, ease: 'power2.inOut', onComplete: () => crt.focus({ preventScroll: true }) });
  };
  if (reduce) return out();
  gsap.timeline({ onComplete: out })
    .to(tube, { scaleY: 0.01, filter: 'brightness(3)', duration: 0.22, ease: 'power2.in' })
    .to(tube, { scaleX: 0, duration: 0.14, ease: 'power2.in' })
    .set(tube, { clearProps: 'filter,transform' }, '+=0.05');
}
$('[data-to-machine]').addEventListener('click', leaveInside);

let starting = false;
function start() {
  if (inside || starting) return;
  starting = true;
  addCredit();
  sound.play('coin');
  if (reduce || !st) { setTimeout(() => { starting = false; enterInside(); }, reduce ? 0 : 200); return; }
  // coin flash, then the flight plays by itself
  gsap.timeline()
    .fromTo(crt, { '--coin': 1 }, { '--coin': 0, duration: 0.5, ease: 'power2.out' })
    .add(() => sound.play('start'), 0.25)
    .to(window, { scrollTo: { y: st.end + 2, autoKill: false }, duration: phone ? 1.9 : 2.3, ease: 'power2.in', onComplete: () => { starting = false; } }, 0.3);
}
crt.addEventListener('click', start);
cam.addEventListener('click', (e) => { if (e.target === machine) start(); });

/* ---------- boot ---------- */
html.classList.add(reduce ? 'is-still' : 'is-motion');
if (reduce) {
  // straight to the main menu; the machine is one click away and never flies
  layout();
  enterInside();
  addEventListener('resize', layout);
} else {
  boot();
}

async function boot() {
  if (hasFastWebGL() || new URLSearchParams(location.search).has('warp')) {
    try {
      warp = (await import('./warp.js')).createWarp(warpCanvas, { count: phone ? 240 : 620, bloom: !phone });
    } catch { warp = null; }
  }
  layout();
  render();
  st = ScrollTrigger.create({
    trigger: intro,
    start: 'top top',
    end: () => `+=${innerHeight * (phone ? 1.6 : 2.2)}`,
    pin: stage,
    scrub: 0.6,
    animation: gsap.to(state, { p: 1, ease: 'none', paused: true, onUpdate: render }),
  });
  addEventListener('resize', () => { layout(); render(); });
  if (warp) gsap.ticker.add(tick);
  // A reload at the bottom of the flight lands inside.
  if (scrollY >= st.end - 2) enterInside();
}
