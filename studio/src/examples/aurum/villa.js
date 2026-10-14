// Aurum Ingatlan Prémium hero: a stylised modern villa at dusk, modelled in code with Three.js.
// The camera swings slowly around it; setProgress(0..1) flies it in through the glass facade (driven by scroll).
import * as THREE from 'three';

const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

function slatTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#4a3323';
  g.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 16) {
    g.fillStyle = `rgba(0,0,0,${0.35 + Math.random() * 0.15})`;
    g.fillRect(x, 0, 2, 256);
    for (let i = 0; i < 40; i++) {
      g.fillStyle = `rgba(${Math.random() > 0.5 ? '255,220,180' : '0,0,0'},${Math.random() * 0.06})`;
      g.fillRect(x + 2 + Math.random() * 13, Math.random() * 256, 1, 20 + Math.random() * 60);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

/** A lit room seen through the glass: warm light, ceiling spots, furniture silhouettes. */
function roomTexture(seed) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#ffd9a0');
  grad.addColorStop(0.45, '#d9935a');
  grad.addColorStop(1, '#5a3520');
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 256);
  let r = seed * 9301 + 49297;
  const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 6; i++) {
    const x = 30 + rnd() * 450;
    const spot = g.createRadialGradient(x, 6, 2, x, 6, 90);
    spot.addColorStop(0, 'rgba(255,245,220,0.9)');
    spot.addColorStop(1, 'rgba(255,245,220,0)');
    g.fillStyle = spot;
    g.fillRect(x - 90, 0, 180, 120);
  }
  // Floor line and low furniture silhouettes standing on it.
  g.fillStyle = 'rgba(70,40,22,0.55)';
  g.fillRect(0, 226, 512, 30);
  g.fillStyle = 'rgba(45,26,14,0.5)';
  for (let i = 0; i < 2; i++) {
    const x = 20 + rnd() * 380;
    const w = 90 + rnd() * 90;
    g.beginPath();
    g.roundRect(x, 196, w, 34, 8); // sofa / sideboard
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const SKY_VERT = `varying vec3 vPos; void main() { vPos = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const SKY_FRAG = `
  uniform vec3 top; uniform vec3 mid; uniform vec3 horizon; uniform vec3 glowColor; uniform vec3 glowDir;
  varying vec3 vPos;
  void main() {
    float h = clamp(vPos.y, -0.2, 1.0);
    vec3 col = mix(horizon, mid, smoothstep(-0.02, 0.22, h));
    col = mix(col, top, smoothstep(0.18, 0.8, h));
    float g = pow(max(dot(normalize(vPos), normalize(glowDir)), 0.0), 6.0);
    col += glowColor * g * (1.0 - smoothstep(0.0, 0.5, h));
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;
const WATER_VERT = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const WATER_FRAG = `
  uniform float time; uniform vec3 deep; uniform vec3 shallow;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * vec2(14.0, 4.0);
    float w = sin(p.x * 2.1 + time * 0.9) * sin(p.y * 2.7 - time * 0.7) + sin((p.x + p.y) * 3.3 + time * 1.3) * 0.5;
    float c = pow(abs(sin(p.x * 3.7 + w + time * 0.6) * sin(p.y * 4.1 - w * 0.8)), 6.0);
    float edge = smoothstep(0.0, 0.12, vUv.y) * smoothstep(0.0, 0.12, 1.0 - vUv.y) * smoothstep(0.0, 0.04, vUv.x) * smoothstep(0.0, 0.04, 1.0 - vUv.x);
    vec3 col = mix(shallow, deep, edge * 0.7) + c * 0.35 + w * 0.03;
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;

export function createVilla(canvas, { mobile = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.4 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = !mobile;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x2e2622, 50, 170);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 600);

  /* sky + stars */
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false, vertexShader: SKY_VERT, fragmentShader: SKY_FRAG,
    uniforms: {
      top: { value: new THREE.Color(0x060a16) }, mid: { value: new THREE.Color(0x1b2338) }, horizon: { value: new THREE.Color(0x2e2622) },
      glowColor: { value: new THREE.Color(0xe0995a) }, glowDir: { value: new THREE.Vector3(-1, 0.08, -0.6) },
    },
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(300, 32, 16), skyMat);
  scene.add(sky);
  // Reflections: an environment map rendered from the dusk sky alone.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.add(sky.clone());
  scene.environment = pmrem.fromScene(envScene, 0.02).texture;
  scene.environmentIntensity = 0.55;
  pmrem.dispose();
  const starPos = [];
  for (let i = 0; i < (mobile ? 250 : 600); i++) {
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(1 - Math.random() * 0.7);
    starPos.push(Math.sin(ph) * Math.cos(th) * 280, Math.cos(ph) * 280, Math.sin(ph) * Math.sin(th) * 280);
  }
  const stars = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3)),
    new THREE.PointsMaterial({ color: 0xffffff, size: 1.3, sizeAttenuation: false, transparent: true, opacity: 0.7, fog: false }));
  scene.add(stars);

  /* materials */
  const concrete = new THREE.MeshStandardMaterial({ color: 0xe4ded2, roughness: 0.86 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6d655a, roughness: 0.95 });
  const wood = new THREE.MeshStandardMaterial({ map: slatTexture(), roughness: 0.72 });
  wood.map.repeat.set(5, 1);
  const frame = new THREE.MeshStandardMaterial({ color: 0x1a1918, roughness: 0.4, metalness: 0.6 });
  const glow = (seed, i) => new THREE.MeshPhysicalMaterial({
    color: 0x0c0b0a, emissive: 0xffffff, emissiveMap: roomTexture(seed), emissiveIntensity: i,
    roughness: 0.08, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.4,
  });
  const rooms = [glow(1, 1.05), glow(2, 0.9), glow(3, 1.15), glow(4, 0.45)];
  let roomN = 0;
  const nextRoom = (dim) => (dim ? rooms[3] : rooms[roomN++ % 3]);
  const rail = new THREE.MeshPhysicalMaterial({ color: 0xbfd6e0, transparent: true, opacity: 0.22, roughness: 0.05, metalness: 0 });
  const deck = new THREE.MeshStandardMaterial({ color: 0x5b4330, roughness: 0.8 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x26331f, roughness: 1, flatShading: true });
  const leafLight = new THREE.MeshStandardMaterial({ color: 0x34432a, roughness: 1, flatShading: true });
  const bark = new THREE.MeshStandardMaterial({ color: 0x3a2b20, roughness: 1 });

  const villa = new THREE.Group();
  scene.add(villa);
  const box = (w, h, d, mat, x, y, z, shadow = true) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = shadow;
    m.receiveShadow = true;
    villa.add(m);
    return m;
  };

  /* ground */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshStandardMaterial({ color: 0x151613, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(56, 40), new THREE.MeshStandardMaterial({ color: 0x1f2a1a, roughness: 1 }));
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.set(2, 0.01, 2);
  lawn.receiveShadow = true;
  scene.add(lawn);

  /* ground floor: concrete box with a full glass front */
  box(16, 0.4, 10, concrete, -1, 0.2, 0);
  box(14, 3.2, 0.3, concrete, -1, 2, -3.85);
  box(0.3, 3.2, 8, concrete, -7.85, 2, 0);
  box(0.3, 3.2, 8, concrete, 5.85, 2, 0);
  for (let i = 0; i < 6; i++) {
    const x = -7.7 + 0.04 + i * 2.24 + 1.12;
    box(2.16, 3.0, 0.08, nextRoom(i === 4), x, 1.95, 3.92, false);
    box(0.08, 3.2, 0.14, frame, x - 1.12, 2, 3.95, false);
  }
  box(0.08, 3.2, 0.14, frame, 5.7, 2, 3.95, false);
  box(16.4, 0.38, 9.8, concrete, -0.8, 3.75, 0.2);

  /* upper floor: wood-clad cantilever with a ribbon window */
  box(13.2, 0.3, 7.7, concrete, 3.5, 3.95, -0.7);
  box(13, 3.0, 0.3, wood, 3.5, 5.45, -4.35);
  box(0.3, 3.0, 7.6, wood, 9.85, 5.45, -0.7);
  box(0.3, 3.0, 7.6, wood, -2.85, 5.45, -0.7);
  box(13, 0.55, 0.3, wood, 3.5, 4.22, 2.95);
  box(13, 0.5, 0.3, wood, 3.5, 6.7, 2.95);
  for (let i = 0; i < 5; i++) {
    const x = -2.6 + i * 2.48 + 1.24;
    box(2.4, 1.9, 0.08, nextRoom(i === 3), x, 5.45, 3.0, false);
    box(0.07, 1.95, 0.14, frame, x - 1.24, 5.45, 3.03, false);
  }
  box(14.2, 0.32, 8.6, concrete, 3.5, 7.1, -0.65);

  /* roof terrace railing over the ground floor, stone wall, stairs */
  for (let i = 0; i < 3; i++) box(1.7, 1.0, 0.04, rail, -7.1 + i * 1.75, 4.45, 4.95, false);
  box(1.2, 8.4, 4.4, stone, -9.4, 4.2, -1.6);
  box(16, 0.18, 2.4, deck, -1, 0.42, 5.2);
  for (let i = 0; i < 3; i++) box(3.2, 0.14, 0.5, concrete, -1, 0.07 + i * 0.12, 6.6 + (2 - i) * 0.45);

  /* pool */
  box(15.2, 0.34, 5.2, concrete, 6.4, 0.17, 9.3);
  const water = new THREE.ShaderMaterial({
    vertexShader: WATER_VERT, fragmentShader: WATER_FRAG,
    uniforms: { time: { value: 0 }, deep: { value: new THREE.Color(0x0a4a63) }, shallow: { value: new THREE.Color(0x2fb3d3) } },
  });
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(14, 4), water);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(6.4, 0.35, 9.3);
  scene.add(pool);

  /* trees: rounded crowns and slim cypresses */
  const trees = [[-15, -7, 2.4], [-13.5, 5, 1.9], [16, -6, 2.6], [18, 4, 2], [-3, -11, 2.2], [8, -12, 2.5], [-18, -1, 1.6], [22, -1, 1.7]];
  for (const [x, z, s] of trees.slice(0, mobile ? 5 : trees.length)) {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * s, 0.18 * s, 2.4 * s, 6), bark);
    trunk.position.set(x, 1.2 * s, z);
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3 * s, 1), Math.random() > 0.5 ? leaf : leafLight);
    crown.position.set(x, 2.6 * s, z);
    crown.scale.set(1, 1.15, 1);
    crown.rotation.set(Math.random(), Math.random(), 0);
    for (const m of [trunk, crown]) { m.castShadow = true; m.receiveShadow = true; scene.add(m); }
  }
  for (const [x, z] of [[-11, 7.5], [-12.2, 6.4], [18.5, -2], [-6, -7], [12, -8]]) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(0.75, 6, 7), leaf);
    c.position.set(x, 3, z);
    c.castShadow = true;
    scene.add(c);
  }

  /* garden path with small bollard lights */
  const path = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 16), new THREE.MeshStandardMaterial({ color: 0x3a352e, roughness: 0.9 }));
  path.rotation.x = -Math.PI / 2;
  path.position.set(-4.5, 0.02, 14);
  path.receiveShadow = true;
  scene.add(path);
  const bollard = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xffc27a, emissiveIntensity: 2.2 });
  for (let i = 0; i < 5; i++) {
    for (const side of [-1, 1]) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8), bollard);
      b.position.set(-4.5 + side * 1.5, 0.25, 8 + i * 3);
      scene.add(b);
    }
  }

  /* lights */
  scene.add(new THREE.HemisphereLight(0x34405c, 0x3a2a1c, 0.55));
  const key = new THREE.DirectionalLight(0xffc98f, 2.1);
  key.position.set(-34, 22, 22);
  key.castShadow = !mobile;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -28, right: 28, top: 22, bottom: -18, near: 1, far: 120 });
  key.shadow.bias = -0.0004;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8fb2ff, 0.45);
  rim.position.set(30, 14, -30);
  scene.add(rim);
  const interior = mobile ? [[-1, 2, 2]] : [[-4, 2, 2], [2, 2, 2], [4, 5.4, 1.5]];
  for (const [x, y, z] of interior) {
    const l = new THREE.PointLight(0xffb36b, mobile ? 30 : 18, 16, 2);
    l.position.set(x, y, z);
    scene.add(l);
  }
  const poolLight = new THREE.PointLight(0x5fd6ff, 10, 12, 2);
  poolLight.position.set(6.4, 0.6, 9.3);
  scene.add(poolLight);

  /* camera rig */
  const target = new THREE.Vector3();
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  let progress = 0;
  let shown = 0;
  const t0 = performance.now();
  const pose = (t) => {
    const p = smooth(Math.min(1, progress));
    const swing = mobile ? Math.sin(t * 0.09) * 0.22 + 0.35 : Math.sin(t * 0.09) * 0.5 + 0.55;
    const angle = lerp(swing + pointer.sx * 0.12, 0.02, p);
    const radius = lerp(mobile ? 62 : 36, 5.5, p);
    const height = lerp(11 + pointer.sy * 1.5, 2.1, p);
    target.set(lerp(1.5, -1.2, p), lerp(3, 2.0, p), lerp(0, 3.9, p));
    camera.position.set(target.x + Math.sin(angle) * radius, height, target.z + Math.cos(angle) * radius);
    camera.fov = lerp(32, 48, p * p);
    const { width: w, height: h } = size;
    if ((shift || lift) && w) camera.setViewOffset(w, h, -w * shift * (1 - p), h * lift * (1 - p), w, h);
    camera.updateProjectionMatrix();
    camera.lookAt(target);
  };

  const size = { width: 0, height: 0 };
  const shift = mobile ? 0 : 0.17; // desktop: villa right of the headline
  const lift = mobile ? 0.26 : 0; // phones: villa above the headline
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    Object.assign(size, { width: w, height: h });
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  let raf = 0;
  let running = false;
  const frameFn = () => {
    raf = requestAnimationFrame(frameFn);
    const t = (performance.now() - t0) / 1000;
    pointer.sx += (pointer.x - pointer.sx) * 0.04;
    pointer.sy += (pointer.y - pointer.sy) * 0.04;
    water.uniforms.time.value = t;
    stars.rotation.y = t * 0.004;
    pose(t);
    renderer.render(scene, camera);
    shown++;
  };

  return {
    renderer,
    get frames() { return shown; },
    start() { if (!running) { running = true; frameFn(); } },
    stop() { running = false; cancelAnimationFrame(raf); },
    renderOnce() { pose(0); renderer.render(scene, camera); shown++; },
    setProgress(p) { progress = p; },
    setPointer(x, y) { pointer.x = x; pointer.y = y; },
    dispose() {
      this.stop();
      ro.disconnect();
      scene.traverse((o) => { o.geometry?.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m?.map?.dispose(); m?.dispose(); }); });
      renderer.dispose();
    },
  };
}
