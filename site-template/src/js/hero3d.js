// Hero 3D built from a flat image (lazy-loaded, code-split from main.js).
//   "particles": the image's pixels become a point cloud that assembles on load,
//                sways slowly, follows the pointer and parts around it.
//   "relief":    the image becomes an embossed surface whose depth comes from its shape and brightness.
// Depth is derived on the fly: the subject mask (alpha, or distance from the corner colour) is
// blurred into a rounded volume and mixed with luminance. No model file or AI service is needed.
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Color,
  DataTexture,
  Float32BufferAttribute,
  LinearFilter,
  Mesh,
  NormalBlending,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  RedFormat,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Timer,
  WebGLRenderer,
} from 'three';

const WORLD = 3.2; // the image spans [-1.6, 1.6] in world units

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    if (!src.startsWith('data:')) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('hero image failed to load'));
    img.src = src;
  });
}

function boxBlur(src, size, radius, passes) {
  let a = src;
  let b = new Float32Array(a.length);
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < size; y++) {
      let acc = 0;
      for (let x = -radius; x < size + radius; x++) {
        acc += a[y * size + Math.min(size - 1, Math.max(0, x + radius))] - a[y * size + Math.min(size - 1, Math.max(0, x - radius - 1))];
        if (x >= 0 && x < size) b[y * size + x] = acc / (radius * 2 + 1);
      }
    }
    for (let x = 0; x < size; x++) {
      let acc = 0;
      for (let y = -radius; y < size + radius; y++) {
        acc += b[Math.min(size - 1, Math.max(0, y + radius)) * size + x] - b[Math.min(size - 1, Math.max(0, y - radius - 1)) * size + x];
        if (y >= 0 && y < size) a[y * size + x] = acc / (radius * 2 + 1);
      }
    }
  }
  return a;
}

/** Samples the image into a square grid: colour, subject mask and a derived depth map. */
function analyse(img, size) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
  const { data } = ctx.getImageData(0, 0, size, size);

  // Background: transparent pixels, or pixels close to the average corner colour.
  let hasAlpha = false;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 250) { hasAlpha = true; break; }
  const corners = [0, size - 1, (size - 1) * size, size * size - 1].map((p) => [data[p * 4], data[p * 4 + 1], data[p * 4 + 2]]);
  const bg = [0, 1, 2].map((k) => corners.reduce((s, c) => s + c[k], 0) / 4);

  const n = size * size;
  const mask = new Float32Array(n);
  const lum = new Float32Array(n);
  for (let p = 0; p < n; p++) {
    const r = data[p * 4], g = data[p * 4 + 1], b = data[p * 4 + 2], a = data[p * 4 + 3];
    lum[p] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    if (hasAlpha) mask[p] = a / 255;
    else {
      const d = Math.hypot(r - bg[0], g - bg[1], b - bg[2]) / 255;
      mask[p] = Math.min(1, Math.max(0, (d - 0.08) / 0.18)) * (a / 255);
    }
  }
  const volume = boxBlur(mask.slice(), size, Math.max(2, Math.round(size / 40)), 3);
  const depth = new Float32Array(n);
  for (let p = 0; p < n; p++) depth[p] = mask[p] * (0.75 * Math.sqrt(volume[p]) + 0.25 * lum[p]);
  return { canvas, data, mask, lum, depth, size };
}

function makeParticles(ctx, map) {
  const { size, mask, depth, data } = map;
  const step = ctx.mobile ? 2 : 1;
  const target = [];
  const scatter = [];
  const extra = [];
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      const p = y * size + x;
      if (mask[p] < 0.35) continue;
      const jx = (Math.random() - 0.5) * step;
      const jy = (Math.random() - 0.5) * step;
      const z = depth[p];
      target.push(((x + jx) / size - 0.5) * WORLD, -((y + jy) / size - 0.5) * WORLD, (z - 0.35) * 0.9 + (Math.random() - 0.5) * 0.04);
      // Start positions: a loose shell around the object.
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      const r = 2.6 + Math.random() * 2.2;
      scatter.push(Math.sin(v) * Math.cos(u) * r, Math.sin(v) * Math.sin(u) * r, Math.cos(v) * r);
      const l = (0.2126 * data[p * 4] + 0.7152 * data[p * 4 + 1] + 0.0722 * data[p * 4 + 2]) / 255;
      extra.push(l, Math.random(), z);
    }
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(target, 3));
  geo.setAttribute('aScatter', new Float32BufferAttribute(scatter, 3));
  geo.setAttribute('aInfo', new Float32BufferAttribute(extra, 3));
  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: ctx.light ? NormalBlending : AdditiveBlending,
    uniforms: ctx.uniforms({ uSize: { value: ctx.mobile ? 30 : 22 } }),
    vertexShader: /* glsl */ `
      uniform float uTime; uniform float uSize; uniform float uPixelRatio; uniform float uProgress; uniform vec2 uMouse; uniform float uMouseOn;
      attribute vec3 aScatter; attribute vec3 aInfo;
      varying float vLum; varying float vEdge; varying float vAlpha;
      void main(){
        float delay = aInfo.y * 0.35;
        float t = clamp((uProgress - delay) / (1.0 - delay * 0.9), 0.0, 1.0);
        t = 1.0 - pow(1.0 - t, 4.0);
        vec3 p = mix(aScatter, position, t);
        p.z += sin(uTime * 0.8 + aInfo.y * 6.2831) * 0.025;
        // Particles part around the pointer.
        vec2 d = p.xy - uMouse;
        float f = smoothstep(0.55, 0.0, length(d)) * uMouseOn * t;
        p.xy += normalize(d + 1e-4) * f * 0.28;
        p.z += f * 0.25;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * (0.55 + aInfo.y * 0.6) * uPixelRatio / -mv.z;
        vLum = aInfo.x; vEdge = 1.0 - aInfo.z; vAlpha = mix(0.25, 1.0, t);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform vec3 uInk; uniform float uLight;
      varying float vLum; varying float vEdge; varying float vAlpha;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.1, d);
        // Bright areas read as the neutral ink; edges and shadows pick up the accent.
        vec3 col = mix(uColor, uInk, smoothstep(0.35, 0.95, vLum) * (1.0 - vEdge * 0.6));
        gl_FragColor = vec4(col, a * vAlpha * mix(0.85, 0.95, uLight));
      }`,
  });
  return { object: new Points(geo, material), material, geometry: geo, animateIn: true };
}

function makeRelief(ctx, map) {
  const { size, depth, mask, canvas } = map;
  // 8-bit single-channel textures (filterable everywhere), rows flipped so uv (0,0) is bottom-left.
  const toTex = (src) => {
    const out = new Uint8Array(size * size);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) out[(size - 1 - y) * size + x] = Math.round(Math.min(1, src[y * size + x]) * 255);
    const tex = new DataTexture(out, size, size, RedFormat);
    tex.needsUpdate = true;
    return tex;
  };
  const depthTex = toTex(depth);
  const maskTex = toTex(mask);
  const colorTex = new CanvasTexture(canvas);
  colorTex.colorSpace = SRGBColorSpace;
  colorTex.minFilter = LinearFilter;
  for (const t of [depthTex, maskTex]) t.minFilter = t.magFilter = LinearFilter;
  const seg = ctx.mobile ? 110 : 220;
  const geo = new PlaneGeometry(WORLD, WORLD, seg, seg);
  const material = new ShaderMaterial({
    transparent: true,
    uniforms: ctx.uniforms({ uDepth: { value: depthTex }, uMask: { value: maskTex }, uMap: { value: colorTex }, uTexel: { value: 1 / size } }),
    vertexShader: /* glsl */ `
      uniform sampler2D uDepth; uniform float uTime; uniform float uProgress;
      varying vec2 vUv; varying vec3 vView;
      void main(){
        vUv = uv;
        float z = texture2D(uDepth, uv).r;
        vec3 p = position;
        p.z += (z * 0.85 + sin(uTime * 0.7 + uv.x * 6.0) * 0.012 * z) * uProgress;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uDepth; uniform sampler2D uMask; uniform sampler2D uMap; uniform float uTexel;
      uniform vec3 uColor; uniform vec3 uInk; uniform float uLight;
      varying vec2 vUv; varying vec3 vView;
      void main(){
        float m = texture2D(uMask, vUv).r;
        if (m < 0.3) discard;
        float dx = texture2D(uDepth, vUv + vec2(uTexel, 0.0)).r - texture2D(uDepth, vUv - vec2(uTexel, 0.0)).r;
        float dy = texture2D(uDepth, vUv + vec2(0.0, uTexel)).r - texture2D(uDepth, vUv - vec2(0.0, uTexel)).r;
        vec3 n = normalize(vec3(-dx * 14.0, -dy * 14.0, 1.0));
        float diff = clamp(dot(n, normalize(vec3(-0.4, 0.6, 0.8))), 0.0, 1.0);
        float rim = pow(1.0 - clamp(dot(n, vView), 0.0, 1.0), 2.5);
        vec3 base = texture2D(uMap, vUv).rgb;
        float g = dot(base, vec3(0.2126, 0.7152, 0.0722));
        vec3 col = mix(uInk, vec3(g), 0.35) * (0.35 + 0.75 * diff) + uColor * rim * 0.9;
        gl_FragColor = vec4(col, smoothstep(0.3, 0.6, m));
      }`,
  });
  return { object: new Mesh(geo, material), material, geometry: geo, textures: [depthTex, maskTex, colorTex], animateIn: true };
}

const FACTORIES = { particles: makeParticles, relief: makeRelief };

export async function createHero3D(canvas, { type = 'particles', image, accent = '#00d4ff', light = false, mobile = false } = {}) {
  if (!FACTORIES[type] || !image) return null;
  const img = await loadImage(image);
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'low-power' });
  } catch {
    return null; // No WebGL: the still image stays visible.
  }
  const pixelRatio = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(36, 1, 0.1, 50);
  camera.position.set(0, 0, 6.2);

  const shared = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uPixelRatio: { value: pixelRatio },
    uColor: { value: new Color(accent) },
    uInk: { value: new Color(light ? '#141414' : '#f1f1ef') },
    uLight: { value: light ? 1 : 0 },
    uMouse: { value: { x: 9, y: 9 } },
    uMouseOn: { value: 0 },
  };
  const map = analyse(img, mobile ? 150 : 240);
  const effect = FACTORIES[type]({ mobile, light, uniforms: (extra) => ({ ...shared, ...extra }) }, map);
  scene.add(effect.object);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0, inside: false };
  const stage = canvas.parentElement;
  const onPointer = (e) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    const r = stage.getBoundingClientRect();
    const lx = ((e.clientX - r.left) / r.width - 0.5) * WORLD * 1.25;
    const ly = -((e.clientY - r.top) / r.height - 0.5) * WORLD * 1.25;
    pointer.inside = Math.abs(lx) < WORLD && Math.abs(ly) < WORLD;
    shared.uMouse.value = { x: lx, y: ly };
  };
  if (!mobile) window.addEventListener('pointermove', onPointer, { passive: true });

  const resize = () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  resize();

  let visible = true;
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
  io.observe(stage);

  const timer = new Timer();
  const started = performance.now();
  let raf = 0;
  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    if (!visible || document.hidden) return;
    timer.update(now);
    const t = timer.getElapsed();
    shared.uTime.value = t;
    shared.uProgress.value = Math.min(1, (now - started) / 2600);
    shared.uMouseOn.value += ((pointer.inside ? 1 : 0) - shared.uMouseOn.value) * 0.08;
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    // Slow continuous sway plus a pointer-driven tilt.
    effect.object.rotation.y = Math.sin(t * 0.22) * 0.5 + pointer.x * 0.35;
    effect.object.rotation.x = Math.sin(t * 0.17) * 0.08 + pointer.y * 0.22;
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);
  requestAnimationFrame(() => stage.classList.add('is-live'));

  return {
    type,
    light,
    image,
    canvas,
    setAccent(hex) { shared.uColor.value.set(hex); },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointer);
      effect.geometry.dispose();
      effect.material.dispose();
      effect.textures?.forEach((t) => t.dispose());
      renderer.dispose();
      stage.classList.remove('is-live');
    },
  };
}
