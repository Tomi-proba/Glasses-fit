// Fűszerkert Prémium: a wooden spice cabinet modelled in code with Three.js.
// playIntro(): doors open, the camera moves in between the shelves, jars wobble, then it pulls back
// to the hero framing. showOpen(): the end state straight away (repeat visits, "Átugrás").
import * as THREE from 'three';
import gsap from 'gsap';

function canvasTexture(w, h, draw, srgb = true) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Oak-like grain: long wavy darker streaks over a warm base. */
const woodTexture = (base = '#6b4325') => canvasTexture(512, 512, (g, w, h) => {
  g.fillStyle = base;
  g.fillRect(0, 0, w, h);
  for (let i = 0; i < 140; i++) {
    const x0 = Math.random() * w;
    g.strokeStyle = `rgba(${Math.random() > 0.7 ? '255,210,160' : '30,15,5'},${0.04 + Math.random() * 0.12})`;
    g.lineWidth = 0.6 + Math.random() * 2.4;
    g.beginPath();
    for (let y = 0; y <= h; y += 16) g.lineTo(x0 + Math.sin(y * 0.02 + i) * (3 + (i % 7)), y);
    g.stroke();
  }
});

/** Ground spice: coloured grain noise (multiplied by the jar's colour). */
const grainTexture = () => canvasTexture(128, 128, (g, w, h) => {
  const img = g.createImageData(w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 150 + Math.random() * 105;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
});

const labelTexture = (name) => canvasTexture(512, 256, (g, w, h) => {
  g.fillStyle = '#efe4cc';
  g.fillRect(0, 0, w, h);
  g.strokeStyle = '#6b4a2a';
  g.lineWidth = 4;
  g.strokeRect(14, 14, w - 28, h - 28);
  g.lineWidth = 1.5;
  g.strokeRect(26, 26, w - 52, h - 52);
  g.fillStyle = '#3b2414';
  g.textAlign = 'center';
  g.font = '500 70px "Young Serif", Georgia, serif';
  g.fillText(name, w / 2, h / 2 + 18, w - 80);
  g.font = '600 22px "Figtree", sans-serif';
  g.fillStyle = '#9a3b22';
  g.fillText('F Ű S Z E R K E R T', w / 2, h - 52);
});

export function createCabinet(canvas, { jars, mobile = false }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = !mobile;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x120e0a);
  scene.fog = new THREE.Fog(0x120e0a, 9, 22);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 60);

  /* room */
  const plaster = canvasTexture(512, 512, (g, w, h) => {
    g.fillStyle = '#3a2c20';
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 4000; i++) {
      g.fillStyle = `rgba(${Math.random() > 0.5 ? '255,230,200' : '0,0,0'},${Math.random() * 0.05})`;
      g.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 6, 2 + Math.random() * 6);
    }
  });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(30, 14), new THREE.MeshStandardMaterial({ map: plaster, roughness: 1 }));
  wall.position.set(0, 6, -0.75);
  wall.receiveShadow = true;
  scene.add(wall);
  const floorTex = woodTexture('#2a1c12');
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(6, 6);
  floorTex.rotation = Math.PI / 2;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.75 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  /* cabinet */
  const W = 3.2, H = 4.3, D = 1.1, T = 0.1;
  const wood = new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: 0.55, metalness: 0.02 });
  const woodDark = new THREE.MeshStandardMaterial({ map: woodTexture('#3e2716'), roughness: 0.8 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xc8a050, metalness: 0.9, roughness: 0.28 });
  const cab = new THREE.Group();
  scene.add(cab);
  const part = (w, h, d, mat, x, y, z, parent = cab) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };
  const base = 0.28;
  part(W + 0.1, base, D + 0.06, woodDark, 0, base / 2, 0);
  part(T, H, D, wood, -W / 2 + T / 2, base + H / 2, 0);
  part(T, H, D, wood, W / 2 - T / 2, base + H / 2, 0);
  part(W, T, D, wood, 0, base + T / 2, 0);
  part(W, T, D, wood, 0, base + H - T / 2, 0);
  part(W - 2 * T, H - 2 * T, 0.04, woodDark, 0, base + H / 2, -D / 2 + 0.02);
  part(W + 0.34, 0.16, D + 0.3, wood, 0, base + H + 0.08, 0.06);
  part(W + 0.2, 0.08, D + 0.18, woodDark, 0, base + H + 0.2, 0.03);
  const rowH = (H - 2 * T) / 3;
  const shelfY = [0, 1, 2].map((r) => base + T + r * rowH);
  for (const y of shelfY.slice(1)) part(W - 2 * T, 0.07, D - 0.08, wood, 0, y, 0.02);

  /* interior light strip under the top */
  const strip = new THREE.Mesh(new THREE.BoxGeometry(W - 0.4, 0.02, 0.06), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffc27a, emissiveIntensity: 0 }));
  strip.position.set(0, base + H - T - 0.03, 0.3);
  cab.add(strip);
  const inner = new THREE.PointLight(0xffb870, 0, 5, 2);
  inner.position.set(0, base + H - 0.6, 0.35);
  cab.add(inner);
  const innerLow = new THREE.PointLight(0xffb870, 0, 4, 2);
  innerLow.position.set(0, base + rowH * 0.9, 0.4);
  cab.add(innerLow);

  /* doors: hinged on the outer edges */
  const doorW = W / 2 - 0.02, doorH = H - 0.06, doorT = 0.07;
  const makeDoor = (side) => {
    const hinge = new THREE.Group();
    hinge.position.set(side * (W / 2), base + H / 2, D / 2 + doorT / 2);
    cab.add(hinge);
    const cx = -side * doorW / 2;
    part(doorW, doorH, doorT, wood, cx, 0, 0, hinge);
    // raised panels and frame lines
    for (const [py, ph] of [[doorH * 0.24, doorH * 0.36], [-doorH * 0.2, doorH * 0.44]]) {
      part(doorW - 0.36, ph, 0.03, woodDark, cx, py, doorT / 2 + 0.005, hinge);
      part(doorW - 0.5, ph - 0.14, 0.04, wood, cx, py, doorT / 2 + 0.02, hinge);
    }
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.065, 20, 14), brass);
    knob.position.set(cx - side * (doorW / 2 - 0.16), -0.05, doorT / 2 + 0.06);
    knob.castShadow = true;
    hinge.add(knob);
    return hinge;
  };
  const doors = [makeDoor(-1), makeDoor(1)];

  /* jars */
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, roughness: 0.04, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, side: THREE.DoubleSide, depthWrite: false });
  const grain = grainTexture();
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  const cork = new THREE.MeshStandardMaterial({ color: 0xb08656, roughness: 0.95 });
  const tin = new THREE.MeshStandardMaterial({ color: 0x5a4a38, roughness: 0.35, metalness: 0.85 });
  const R = 0.22, JH = 0.62;
  const perRow = mobile ? 3 : 4;
  const jarList = [];
  const usable = W - 2 * T - 0.3;
  jars.slice(0, perRow * 3).forEach((j, i) => {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    const g = new THREE.Group();
    const x = -usable / 2 + (col + 0.5) * (usable / perRow);
    const y = shelfY[2 - row] + (row === 2 ? 0 : 0.035);
    g.position.set(x + (Math.random() - 0.5) * 0.06, y, 0.12 + (Math.random() - 0.5) * 0.1);
    g.rotation.y = (Math.random() - 0.5) * 0.5;
    const fill = 0.55 + Math.random() * 0.3;
    const spice = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.9, R * 0.9, JH * fill, 28), new THREE.MeshStandardMaterial({ color: j.color, map: grain, roughness: 1 }));
    spice.position.y = (JH * fill) / 2 + 0.02;
    const body = new THREE.Mesh(new THREE.CylinderGeometry(R, R, JH, 32, 1, true), glass);
    body.position.y = JH / 2;
    const bottom = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.03, 32), glass);
    bottom.position.y = 0.015;
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.96, R * 0.92, 0.12, 32), i % 3 === 1 ? tin : cork);
    lid.position.y = JH + 0.05;
    const label = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.004, R + 0.004, 0.26, 32, 1, true, -0.8, 1.6),
      new THREE.MeshStandardMaterial({ map: labelTexture(j.name), roughness: 0.9, side: THREE.FrontSide }));
    label.position.y = JH * 0.42;
    for (const m of [spice, lid, label]) { m.castShadow = true; m.receiveShadow = true; }
    g.add(spice, body, bottom, lid, label);
    g.userData = { kick: Infinity, amp: 0.05 + Math.random() * 0.05, phase: Math.random() * 6 };
    cab.add(g);
    jarList.push(g);
  });

  /* dust in the light */
  let dust = null;
  if (!mobile) {
    const pos = [];
    for (let i = 0; i < 260; i++) pos.push((Math.random() - 0.5) * 4, Math.random() * 5, Math.random() * 3);
    dust = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)),
      new THREE.PointsMaterial({ color: 0xffd9a0, size: 0.018, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
    scene.add(dust);
  }

  /* lights */
  const hemi = new THREE.HemisphereLight(0x7a6048, 0x140d08, 0.5);
  scene.add(hemi);
  const key = new THREE.SpotLight(0xffd2a0, 0, 26, 0.48, 0.65, 1.2);
  key.position.set(-1.6, 7.8, 7.5);
  key.target.position.set(0, 2, 0);
  key.castShadow = !mobile;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.0005;
  scene.add(key, key.target);
  const fill = new THREE.DirectionalLight(0x9fb4ff, 0.15);
  fill.position.set(5, 3, 4);
  scene.add(fill);

  /* camera rig */
  const rig = { x: 0, y: 2.4, z: 10.5, tx: 0, ty: base + H / 2, tz: 0, fov: 34 };
  const HERO = mobile ? { x: 0.5, y: 2.6, z: 9.4, tx: 0, ty: 2.4, tz: 0, fov: 36 } : { x: 1.1, y: 2.75, z: 8.8, tx: 0, ty: 2.45, tz: 0, fov: 36 };
  const INSIDE = mobile
    ? { x: 0.25, y: shelfY[1] + 0.5, z: 2.3, tx: -0.2, ty: shelfY[1] + 0.35, tz: 0, fov: 56 }
    : { x: 0.42, y: shelfY[1] + 0.42, z: 1.05, tx: -0.55, ty: shelfY[1] + 0.32, tz: 0.05, fov: 50 };
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  const size = { w: 1, h: 1 };
  const applyCamera = (t) => {
    pointer.sx += (pointer.x - pointer.sx) * 0.05;
    pointer.sy += (pointer.y - pointer.sy) * 0.05;
    // Portrait screens need more distance to fit the cabinet.
    const fit = Math.max(1, 0.85 / (size.w / size.h));
    const sway = idle ? Math.sin(t * 0.35) * 0.12 : 0;
    camera.position.set(rig.x + sway + pointer.sx * 0.5, rig.y - pointer.sy * 0.3, rig.tz + (rig.z - rig.tz) * (rig.z > 3 ? fit : 1));
    camera.fov = rig.fov;
    camera.updateProjectionMatrix();
    camera.lookAt(rig.tx, rig.ty, rig.tz);
  };

  let idle = false;
  const t0 = performance.now();
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    size.w = w;
    size.h = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  let raf = 0;
  let running = false;
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const t = (performance.now() - t0) / 1000;
    for (const j of jarList) {
      const u = j.userData;
      const dt = t - u.kick;
      const wob = dt > 0 ? Math.exp(-dt * 2.2) * Math.sin(dt * 14) : 0;
      j.rotation.z = wob * u.amp + (idle ? Math.sin(t * 0.8 + u.phase) * 0.006 : 0);
      j.position.y = j.userData.y0 + Math.max(0, wob) * 0.04;
    }
    if (dust) { dust.rotation.y = t * 0.02; dust.position.y = Math.sin(t * 0.2) * 0.1; }
    applyCamera(t);
    renderer.render(scene, camera);
  };
  for (const j of jarList) j.userData.y0 = j.position.y;

  const setOpen = (v) => {
    doors[0].rotation.y = -v * 1.95;
    doors[1].rotation.y = v * 1.95;
    inner.intensity = v * (mobile ? 6 : 4.5);
    innerLow.intensity = v * 2.5;
    strip.material.emissiveIntensity = v * 2.2;
  };
  const lightsOn = (v) => { key.intensity = v * 150; hemi.intensity = 0.2 + v * 0.55; };

  const api = {
    start() { if (!running) { running = true; frame(); } },
    stop() { running = false; cancelAnimationFrame(raf); },
    setPointer(x, y) { pointer.x = x; pointer.y = y; },
    /** The finished state: open doors, hero framing. */
    showOpen() {
      gsap.killTweensOf([rig, state]);
      state.open = 1;
      state.light = 1;
      setOpen(1);
      lightsOn(1);
      Object.assign(rig, HERO);
      idle = true;
    },
    renderOnce() { applyCamera(0); renderer.render(scene, camera); },
    /** Plays the opening; resolves when the camera is back at the hero framing. */
    async playIntro({ onProgress, onSettle } = {}) {
      // Compile shaders and upload textures first, so the opening does not stutter or skip.
      renderer.compile(scene, camera);
      applyCamera(0);
      renderer.render(scene, camera);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const tl = gsap.timeline({ onUpdate: () => onProgress?.(tl.progress()) });
      if (window.__introSpeed) tl.timeScale(window.__introSpeed); // test hook
      tl.to(state, { light: 1, duration: 1.3, ease: 'power2.out', onUpdate: () => lightsOn(state.light) }, 0);
      tl.to(state, { open: 1, duration: 2.3, ease: 'power2.inOut', onUpdate: () => setOpen(state.open) }, 0.9);
      tl.call(() => jarList.forEach((j, i) => { j.userData.kick = (performance.now() - t0) / 1000 + 0.05 * i; }), null, 2.0);
      tl.to(rig, { ...INSIDE, duration: 2.8, ease: 'power2.inOut' }, 2.2);
      tl.call(() => jarList.forEach((j, i) => { j.userData.kick = (performance.now() - t0) / 1000 + 0.04 * (jarList.length - i); }), null, 4.3);
      tl.call(() => onSettle?.(), null, 5.1);
      tl.to(rig, { ...HERO, duration: 1.7, ease: 'power3.inOut', onComplete: () => { idle = true; } }, 5.1);
      api.timeline = tl;
      return tl.then();
    },
    dispose() {
      api.stop();
      ro.disconnect();
      scene.traverse((o) => { o.geometry?.dispose(); [].concat(o.material || []).forEach((m) => { m.map?.dispose(); m.dispose(); }); });
      renderer.dispose();
    },
  };
  const state = { open: 0, light: 0 };
  setOpen(0);
  lightsOn(0);
  return api;
}
