// Hero background 3D effects (lazy-loaded, code-split from main.js).
// Effects: "particles" (galaxy), "blob" (noise-displaced sphere), "waves" (point grid).
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  IcosahedronGeometry,
  Mesh,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Timer,
  WebGLRenderer,
} from 'three';

// Ashima Arts / Stefan Gustavson 3D simplex noise (MIT).
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const POINT_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uTint;
uniform float uOpacity;
varying float vMix;
varying float vAlpha;
void main(){
  float d=length(gl_PointCoord-0.5);
  float a=smoothstep(0.5,0.0,d);
  a*=a;
  vec3 col=mix(uColor,uTint,vMix);
  gl_FragColor=vec4(col,a*vAlpha*uOpacity);
}`;

function galaxy(count) {
  const pos = new Float32Array(count * 3);
  const rnd = new Float32Array(count * 2);
  const branches = 3;
  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 1.6) * 6.5 + 0.2;
    const branch = ((i % branches) / branches) * Math.PI * 2;
    const spin = r * 0.75;
    const spread = 0.55 * (1 - r / 9);
    const rx = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * r * spread;
    const ry = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * r * spread * 0.6;
    const rz = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * r * spread;
    pos[i * 3] = Math.cos(branch + spin) * r + rx;
    pos[i * 3 + 1] = ry;
    pos[i * 3 + 2] = Math.sin(branch + spin) * r + rz;
    rnd[i * 2] = Math.random();
    rnd[i * 2 + 1] = Math.random();
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  geo.setAttribute('aRandom', new Float32BufferAttribute(rnd, 2));
  return geo;
}

function makeParticles(ctx) {
  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: ctx.light ? NormalBlending : AdditiveBlending,
    uniforms: ctx.uniforms({ uSize: { value: ctx.mobile ? 34 : 42 } }),
    vertexShader: /* glsl */ `
      uniform float uTime; uniform float uSize; uniform float uPixelRatio;
      attribute vec2 aRandom;
      varying float vMix; varying float vAlpha;
      void main(){
        vec3 p=position;
        float r=length(p.xz);
        float ang=atan(p.z,p.x)+uTime*(0.9/(r+1.5));
        p.x=cos(ang)*r; p.z=sin(ang)*r;
        p.y+=sin(uTime*0.6+aRandom.x*6.28)*0.06;
        vec4 mv=modelViewMatrix*vec4(p,1.0);
        gl_Position=projectionMatrix*mv;
        float tw=0.6+0.4*sin(uTime*2.0+aRandom.y*30.0);
        gl_PointSize=uSize*(0.25+aRandom.x*0.9)*tw*uPixelRatio/-mv.z;
        vMix=smoothstep(2.5,0.0,r)*0.8+aRandom.y*0.2;
        vAlpha=0.35+0.65*aRandom.y;
      }`,
    fragmentShader: POINT_FRAGMENT,
  });
  const points = new Points(galaxy(ctx.mobile ? 6000 : 22000), material);
  points.rotation.x = 0.55;
  points.position.set(ctx.mobile ? 0 : 2.4, -0.2, 0);
  return { object: points, material, update(t) { points.rotation.y = t * 0.03; } };
}

function makeBlob(ctx) {
  const material = new ShaderMaterial({
    transparent: true,
    uniforms: ctx.uniforms({ uBase: { value: new Color(ctx.light ? '#ffffff' : '#07080c') } }),
    vertexShader: /* glsl */ `
      uniform float uTime;
      varying vec3 vNormal; varying vec3 vView; varying float vNoise;
      ${NOISE}
      void main(){
        float n=snoise(normal*1.4+uTime*0.25);
        float n2=snoise(normal*3.2-uTime*0.18)*0.35;
        vNoise=n;
        vec3 p=position+normal*(n*0.32+n2*0.18);
        vec4 mv=modelViewMatrix*vec4(p,1.0);
        vView=normalize(-mv.xyz);
        vNormal=normalize(normalMatrix*normal);
        gl_Position=projectionMatrix*mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform vec3 uTint; uniform vec3 uBase; uniform float uOpacity;
      varying vec3 vNormal; varying vec3 vView; varying float vNoise;
      void main(){
        float f=pow(1.0-max(dot(normalize(vNormal),vView),0.0),2.2);
        float bands=smoothstep(0.35,0.5,fract(vNoise*3.0))*0.18;
        vec3 col=mix(uBase,uColor,f*0.95+bands);
        col=mix(col,uTint,pow(f,5.0)*0.6);
        gl_FragColor=vec4(col,uOpacity);
      }`,
  });
  const mesh = new Mesh(new IcosahedronGeometry(1.7, ctx.mobile ? 24 : 64), material);
  mesh.position.set(ctx.mobile ? 0 : 2.3, ctx.mobile ? 0.6 : 0, 0);
  return { object: mesh, material, update(t) { mesh.rotation.y = t * 0.08; mesh.rotation.z = t * 0.03; } };
}

function makeWaves(ctx) {
  const n = ctx.mobile ? 70 : 150;
  const pos = new Float32Array(n * n * 3);
  const rnd = new Float32Array(n * n * 2);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const k = i * n + j;
      pos[k * 3] = (i / (n - 1) - 0.5) * 22;
      pos[k * 3 + 1] = 0;
      pos[k * 3 + 2] = (j / (n - 1) - 0.5) * 22;
      rnd[k * 2] = Math.random();
      rnd[k * 2 + 1] = Math.random();
    }
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  geo.setAttribute('aRandom', new Float32BufferAttribute(rnd, 2));
  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: ctx.light ? NormalBlending : AdditiveBlending,
    uniforms: ctx.uniforms({ uSize: { value: ctx.mobile ? 26 : 30 } }),
    vertexShader: /* glsl */ `
      uniform float uTime; uniform float uSize; uniform float uPixelRatio;
      attribute vec2 aRandom;
      varying float vMix; varying float vAlpha;
      ${NOISE}
      void main(){
        vec3 p=position;
        float h=snoise(vec3(p.x*0.12,p.z*0.12,uTime*0.15))*1.1+sin(p.x*0.45+uTime*0.8)*0.25;
        p.y=h;
        vec4 mv=modelViewMatrix*vec4(p,1.0);
        gl_Position=projectionMatrix*mv;
        gl_PointSize=uSize*(0.5+aRandom.x*0.5)*uPixelRatio/-mv.z;
        vMix=smoothstep(0.4,1.2,h);
        vAlpha=smoothstep(11.0,4.0,length(p.xz))*(0.45+0.55*smoothstep(-0.8,0.8,h));
      }`,
    fragmentShader: POINT_FRAGMENT,
  });
  const points = new Points(geo, material);
  points.position.set(0, -2.2, -2);
  points.rotation.x = 0.18;
  return { object: points, material, update(t) { points.rotation.y = t * 0.02; } };
}

const FACTORIES = { particles: makeParticles, blob: makeBlob, waves: makeWaves };

export function createHero3D(canvas, { type = 'particles', accent = '#00d4ff', light = false, mobile = false } = {}) {
  if (!FACTORIES[type]) return null;
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'low-power' });
  } catch {
    return null; // No WebGL: the CSS glow background stays as the fallback.
  }
  const pixelRatio = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0.6, 8.5);

  const shared = {
    uTime: { value: 0 },
    uPixelRatio: { value: pixelRatio },
    uColor: { value: new Color(accent) },
    uTint: { value: new Color(light ? '#0b0d12' : '#ffffff') },
    uOpacity: { value: light ? 0.9 : 1 },
  };
  const ctx = { mobile, light, uniforms: (extra) => ({ ...shared, ...extra }) };
  const effect = FACTORIES[type](ctx);
  scene.add(effect.object);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (!mobile) window.addEventListener('pointermove', onPointer, { passive: true });

  const resize = () => {
    const w = canvas.clientWidth || canvas.parentElement.clientWidth;
    const h = canvas.clientHeight || canvas.parentElement.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
  resize();

  let visible = true;
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
  io.observe(canvas.parentElement);

  const timer = new Timer();
  let raf = 0;
  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    if (!visible || document.hidden) return;
    timer.update(now);
    const t = timer.getElapsed();
    shared.uTime.value = t;
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;
    effect.update(t);
    effect.object.rotation.x += (pointer.y * 0.25 + (type === 'particles' ? 0.55 : type === 'waves' ? 0.18 : 0) - effect.object.rotation.x) * 0.05;
    camera.position.x = pointer.x * 0.6;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);
  requestAnimationFrame(() => canvas.classList.add('is-ready'));

  return {
    type,
    light,
    canvas,
    setAccent(hex) { shared.uColor.value.set(hex); },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointer);
      effect.object.geometry.dispose();
      effect.material.dispose();
      renderer.dispose();
      canvas.classList.remove('is-ready');
    },
  };
}
