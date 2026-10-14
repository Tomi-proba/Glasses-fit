// Pixel Pont Prémium: the neon light streaks of the fly-in (Three.js).
// Streaks live in a tube along the view axis and rush toward the camera; their speed and length grow
// with `intensity` (0..1). The vanishing point follows the arcade screen via a shifted view offset.
// Desktop gets a bloom pass; phones get fewer streaks and no post-processing.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const PALETTE = [new THREE.Color('#ff3fa4'), new THREE.Color('#2fe3ff'), new THREE.Color('#8a5bff'), new THREE.Color('#ff3fa4'), new THREE.Color('#2fe3ff'), new THREE.Color('#ffffff')];
const FAR = 140;

export function createWarp(canvas, { count = 600, bloom = true } = {}) {
  const gain = bloom ? 1 : 1.9; // no bloom on phones: brighter lines instead
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !bloom, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, bloom ? 1.5 : 2));
  renderer.setClearColor(0x000000, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(68, 1, 0.1, FAR + 40);

  const pos = new Float32Array(count * 6);
  const col = new Float32Array(count * 6);
  const z = new Float32Array(count);
  const base = [];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3).setUsage(THREE.DynamicDrawUsage));
  const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  scene.add(new THREE.LineSegments(geo, mat));

  const spawn = (i, anywhere) => {
    // more streaks near the axis, so the screen looks like their source
    const r = 0.35 + Math.pow(Math.random(), 1.6) * 9;
    const a = Math.random() * Math.PI * 2;
    pos[i * 6] = pos[i * 6 + 3] = Math.cos(a) * r;
    pos[i * 6 + 1] = pos[i * 6 + 4] = Math.sin(a) * r * 0.82;
    z[i] = anywhere ? -Math.random() * FAR : -FAR - Math.random() * 30;
    base[i] = PALETTE[(Math.random() * PALETTE.length) | 0];
  };
  for (let i = 0; i < count; i++) spawn(i, true);

  let composer = null;
  let bloomPass = null;
  if (bloom) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloomPass = new UnrealBloomPass(new THREE.Vector2(256, 256), 1.25, 0.55, 0);
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());
  }

  let W = 1, H = 1;
  function resize(w, h) {
    W = w; H = h;
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function frame(dt, intensity, vx, vy) {
    const k = intensity * intensity;
    const speed = 3 + k * 320; // units per second
    const len = 0.15 + k * 34;
    for (let i = 0; i < count; i++) {
      z[i] += speed * dt;
      if (z[i] > 2) spawn(i, false);
      const o = i * 6;
      pos[o + 2] = z[i];
      pos[o + 5] = z[i] - len;
      // fade in from the distance, head bright, tail dark
      const near = Math.max(0, Math.min(1, (z[i] + FAR) / FAR));
      const b = gain * intensity * (0.25 + 0.75 * near) * (base[i].r + base[i].g + base[i].b > 2.9 ? 0.55 : 1);
      col[o] = base[i].r * b; col[o + 1] = base[i].g * b; col[o + 2] = base[i].b * b;
      col[o + 3] = col[o + 4] = col[o + 5] = 0;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
    camera.setViewOffset(W, H, W / 2 - vx, H / 2 - vy, W, H);
    if (bloomPass) bloomPass.strength = 0.6 + intensity * 1.2;
    composer ? composer.render() : renderer.render(scene, camera);
  }

  return { resize, frame, dispose: () => { renderer.dispose(); geo.dispose(); mat.dispose(); } };
}
