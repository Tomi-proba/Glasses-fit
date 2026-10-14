// Scroll-driven video, Apple style: a pinned section draws pre-extracted WebP frames on a canvas.
// Scrolling down plays forward, scrolling up plays back. Frames load coarse-to-fine (every 8th first),
// so scrubbing works early; the first sequence on the page shows a small progress line meanwhile.

const MOBILE = matchMedia('(max-width: 760px)').matches;

function loadFrames(urls, onProgress) {
  const imgs = new Array(urls.length).fill(null);
  // Coarse-to-fine order: 0, 8, 16 … then 4, 12 … then the rest.
  const order = [];
  for (const step of [8, 4, 2, 1]) for (let i = 0; i < urls.length; i += step) if (!order.includes(i)) order.push(i);
  let done = 0;
  let next = 0;
  return new Promise((resolve) => {
    const pump = () => {
      if (next >= order.length) return;
      const i = order[next++];
      const img = new Image();
      img.decoding = 'async';
      img.src = urls[i];
      img.decode().then(() => { imgs[i] = img; }, () => {}).finally(() => {
        done++;
        onProgress(done / urls.length, imgs);
        if (done === urls.length) resolve(imgs);
        else pump();
      });
    };
    for (let k = 0; k < 6; k++) pump();
  });
}

/** Nearest loaded frame to index i. */
function nearest(imgs, i) {
  for (let d = 0; d < imgs.length; d++) {
    if (imgs[i - d]) return imgs[i - d];
    if (imgs[i + d]) return imgs[i + d];
  }
  return null;
}

function drawCover(ctx, img, w, h) {
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * s;
  const dh = img.naturalHeight * s;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

/** Opacity/offset of a text layer for progress p: fades in around data-in, out around data-out. */
function layerState(el, p) {
  const a = Number(el.dataset.in ?? 0);
  const b = Number(el.dataset.out ?? 1);
  const f = 0.07;
  const inV = a === 0 ? 1 : Math.min(1, Math.max(0, (p - (a - f)) / f));
  const outV = b >= 1 ? 1 : Math.min(1, Math.max(0, ((b + f) - p) / f));
  const o = Math.min(inV, outV);
  const y = (1 - inV) * 40 - (1 - outV) * 40;
  return { o, y };
}

export function initScrollSequences({ gsap, ScrollTrigger, lenis, reduceMotion }) {
  const sections = [...document.querySelectorAll('.seq')];
  for (const sec of sections) {
    if (!sec.dataset.seq || reduceMotion) { sec.classList.add('is-static'); sec.querySelector('[data-seq-loader]')?.remove(); continue; }
    const count = Number(sec.dataset[MOBILE ? 'countMobile' : 'countDesktop']);
    const urls = Array.from({ length: count }, (_, i) => `${sec.dataset.base}${MOBILE ? 'mobile' : 'desktop'}/f${String(i + 1).padStart(3, '0')}.webp`);
    const canvas = sec.querySelector('.seq-canvas');
    const ctx = canvas.getContext('2d');
    const layers = [...sec.querySelectorAll('.seq-layer')];
    const loader = sec.querySelector('[data-seq-loader]');
    let imgs = [];
    let target = 0;
    let shown = -1;
    let current = 0;
    let lastImg = null;

    const size = () => {
      const dpr = Math.min(devicePixelRatio, MOBILE ? 2 : 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      shown = -1;
    };
    const render = () => {
      // Ease towards the scroll position so fast flicks still play smoothly.
      current += (target - current) * 0.22;
      if (Math.abs(target - current) < 0.01) current = target;
      const i = Math.round(current);
      const img = nearest(imgs, i);
      if (img && (i !== shown || img !== lastImg)) {
        drawCover(ctx, img, canvas.width, canvas.height);
        shown = i;
        lastImg = img;
        if (!sec.classList.contains('is-live')) sec.classList.add('is-live');
      }
    };
    new ResizeObserver(size).observe(canvas);
    size();

    const applyLayers = (p) => {
      for (const el of layers) {
        const { o, y } = layerState(el, p);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${y}px, 0)`;
        el.style.visibility = o < 0.02 ? 'hidden' : 'visible';
      }
    };
    applyLayers(0);

    const st = ScrollTrigger.create({
      trigger: sec,
      start: 'top top',
      end: `+=${(Number(sec.dataset.length) || 3) * (MOBILE ? 75 : 100)}%`,
      pin: sec.querySelector('.seq-sticky'),
      onUpdate: ({ progress }) => {
        target = progress * (count - 1);
        applyLayers(progress);
      },
    });
    gsap.ticker.add(render);

    // Frames wait until the page itself (fonts, first picture) has loaded, so they never compete with it.
    const afterLoad = new Promise((r) => (document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true })))
      .then(() => document.fonts?.ready)
      .then(() => new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(r, { timeout: 1200 }) : setTimeout(r, 200))));
    const start = () => afterLoad.then(() => loadFrames(urls, (frac, list) => {
      imgs = list;
      if (loader) {
        loader.querySelector('[data-seq-bar]').style.transform = `scaleX(${frac})`;
        loader.querySelector('[data-seq-pct]').textContent = String(Math.round(frac * 100));
      }
    }));
    if (loader) {
      // The opening sequence: a small progress line while the frames stream in. It never blocks the page:
      // the poster (the first frame) is already on screen, and scrubbing uses the nearest loaded frame.
      document.body.append(loader);
      loader.hidden = false; // hidden in the markup, so without JavaScript nothing shows
      const reveal = () => {
        if (loader.classList.contains('is-done')) return;
        loader.classList.add('is-done');
        sec.dispatchEvent(new CustomEvent('seq:ready', { bubbles: true }));
      };
      start().then(reveal);
    } else {
      // Later sequences load when they get close.
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); start(); } }, { rootMargin: '150% 0px' });
      io.observe(sec);
    }
    sec._seq = { st };
  }
}
