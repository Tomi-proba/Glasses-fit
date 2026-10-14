// Studio home hero: our own example sites as floating browser windows and a phone in 3D.
// Pointer tilts the stack, scrolling fans it out. Images are the shots from scripts/example-shots.mjs.
import * as THREE from 'three';

const loadImage = (src) => new Promise((res, rej) => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = rej; i.src = src; });

function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  const g = new THREE.ShapeGeometry(s, 12);
  // ShapeGeometry UVs are in shape units; normalise them to 0..1.
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / w + 0.5, uv.getY(i) / h + 0.5);
  return g;
}

/** Draws a browser window (bar + screenshot) or a phone (bezel + screenshot) into a texture. */
function screenTexture(img, kind, renderer) {
  const phone = kind === 'phone';
  const W = phone ? 400 : 1280;
  const bar = phone ? 0 : 46;
  const H = phone ? Math.round((W * img.height) / img.width) : Math.round((W * 10) / 16) + bar;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#121212';
  g.fillRect(0, 0, W, H);
  if (!phone) {
    g.fillStyle = '#1a1a1a';
    g.fillRect(0, 0, W, bar);
    ['#3a3a3a', '#3a3a3a', '#3a3a3a'].forEach((col, i) => { g.fillStyle = col; g.beginPath(); g.arc(26 + i * 22, bar / 2, 6.5, 0, Math.PI * 2); g.fill(); });
    g.fillStyle = '#242424';
    g.beginPath();
    g.roundRect(W / 2 - 220, 11, 440, bar - 22, 12);
    g.fill();
  }
  const ih = H - bar;
  g.drawImage(img, 0, 0, img.width, Math.min(img.height, (img.width * ih) / W), 0, bar, W, ih);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return { texture: t, aspect: W / H };
}

const shadowTexture = () => {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0,0,0,0.75)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
};

export async function createShowcase3D(canvas, { desktops, phone, mobile = false }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  const imgs = await Promise.all([...desktops, phone].map(loadImage));
  const stack = new THREE.Group();
  scene.add(stack);
  const shadowTex = shadowTexture();
  const frameMat = new THREE.MeshBasicMaterial({ color: 0x2a2a2a });

  // Layout: three browser windows fanned in depth, the phone in front.
  const LAYOUT = mobile
    ? [{ x: -0.6, y: 0.9, z: -1.6, ry: 0.32, s: 3.6 }, { x: 0.4, y: -0.1, z: -0.4, ry: 0.22, s: 3.9 }, null, { x: 1.55, y: -0.95, z: 0.9, ry: 0.1, s: 2.5 }]
    : [{ x: -1.3, y: 1.15, z: -2.2, ry: 0.42, s: 4.2 }, { x: 0.15, y: 0.05, z: -0.9, ry: 0.32, s: 4.4 }, { x: 1.05, y: -1.15, z: 0.3, ry: 0.24, s: 4.0 }, { x: 2.35, y: -0.55, z: 1.4, ry: 0.12, s: 2.6 }];
  const panels = [];
  imgs.forEach((img, i) => {
    const kind = i === imgs.length - 1 ? 'phone' : 'browser';
    const slot = kind === 'phone' ? LAYOUT[3] : LAYOUT[i];
    if (!slot) return;
    const { texture, aspect } = screenTexture(img, kind, renderer);
    const h = kind === 'phone' ? slot.s : slot.s / aspect;
    const w = kind === 'phone' ? slot.s * aspect : slot.s;
    const r = kind === 'phone' ? 0.16 : 0.09;
    const group = new THREE.Group();
    const screen = new THREE.Mesh(roundedRect(w, h, r), new THREE.MeshBasicMaterial({ map: texture }));
    const frame = new THREE.Mesh(roundedRect(w + 0.05, h + 0.05, r + 0.025), frameMat);
    frame.position.z = -0.01;
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.5, h * 1.6), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.85 }));
    shadow.position.set(0.25, -0.35, -0.6);
    group.add(shadow, frame, screen);
    group.position.set(slot.x, slot.y, slot.z);
    group.rotation.set(-0.06, -slot.ry, 0.015 * (i - 1));
    group.userData = { base: { ...slot }, phase: i * 1.7, spread: (i - 1.2) };
    stack.add(group);
    panels.push(group);
  });

  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  let spread = 0;
  let intro = 0;
  const t0 = performance.now();
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w / h < 1 ? 11 / Math.max(0.62, w / h) : 11;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const pose = (t) => {
    pointer.sx += (pointer.x - pointer.sx) * 0.06;
    pointer.sy += (pointer.y - pointer.sy) * 0.06;
    stack.rotation.y = pointer.sx * 0.35 - 0.05;
    stack.rotation.x = pointer.sy * 0.22;
    panels.forEach((p, i) => {
      const b = p.userData.base;
      const k = Math.min(1, Math.max(0, intro * 1.6 - i * 0.18));
      const e = 1 - (1 - k) ** 3;
      p.position.x = b.x + p.userData.spread * spread * 1.4;
      p.position.y = b.y + Math.sin(t * 0.6 + p.userData.phase) * 0.06 - (1 - e) * 1.2;
      p.position.z = b.z + spread * (i - 1) * 1.1 - (1 - e) * 6;
      p.rotation.y = -b.ry - spread * 0.25 * (i - 1);
      p.children.forEach((m) => { m.material.opacity = m.material.transparent ? 0.85 * e : 1; });
      p.visible = e > 0.01;
    });
  };

  let raf = 0;
  let running = false;
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const t = (performance.now() - t0) / 1000;
    if (intro < 1) intro = Math.min(1, intro + 1 / 90);
    pose(t);
    renderer.render(scene, camera);
  };
  return {
    start() { if (!running) { running = true; frame(); } },
    stop() { running = false; cancelAnimationFrame(raf); },
    renderStill() { intro = 1; pose(0); renderer.render(scene, camera); },
    setPointer(x, y) { pointer.x = x; pointer.y = y; },
    setSpread(v) { spread = v; },
  };
}
