// Pixel Pont: tiny square-wave sound effects made with Web Audio. Muted until the visitor turns them on.
let ctx = null;
let on = false;
try { on = localStorage.getItem('pixelpont:sound') === '1'; } catch { /* storage off */ }

const NOTES = {
  move: [[660, 0.035]],
  select: [[880, 0.05], [1320, 0.07]],
  back: [[520, 0.05], [390, 0.08]],
  coin: [[988, 0.07], [1319, 0.28]],
  start: [[523, 0.06], [659, 0.06], [784, 0.06], [1047, 0.16]],
};

export const sound = {
  get on() { return on; },
  toggle() {
    on = !on;
    try { localStorage.setItem('pixelpont:sound', on ? '1' : '0'); } catch { /* storage off */ }
    if (on) this.play('select');
    return on;
  },
  play(name) {
    if (!on) return;
    try {
      ctx ??= new AudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      let t = ctx.currentTime + 0.01;
      for (const [f, d] of NOTES[name] || []) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + d);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + d + 0.02);
        t += d * 0.92;
      }
    } catch { /* no audio */ }
  },
};
