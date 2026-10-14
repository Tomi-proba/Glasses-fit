// Fűszerkert, shared by both tiers: header, mobile menu, menu tabs, today's special,
// "open now" status and the booking form (demo: validates, then thanks without sending anything).

const HOURS = { 0: [12, 16], 1: null, 2: [12, 22], 3: [12, 22], 4: [12, 22], 5: [12, 23], 6: [12, 23] };
const DAYS = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];
const ft = (n) => `${new Intl.NumberFormat('hu-HU').format(n)} Ft`;

export function initFuszerkert() {
  /* header + menu */
  const header = document.querySelector('[data-header]');
  const onScroll = () => header?.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const menuBtn = document.querySelector('.fk-menu');
  const links = document.getElementById('fk-links');
  const setMenu = (open) => { menuBtn?.setAttribute('aria-expanded', String(open)); links?.classList.toggle('is-open', open); };
  menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  links?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

  /* tabs (ARIA tabs pattern with arrow keys) */
  const tabs = [...document.querySelectorAll('[role=tab]')];
  const select = (tab, focus = false) => {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    }
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });

  /* today */
  const now = new Date();
  const day = now.getDay();
  const { specials } = JSON.parse(document.getElementById('fk-specials').textContent);
  const sp = specials[day];
  const set = (sel, text) => { const el = document.querySelector(sel); if (el) el.textContent = text; };
  if (sp) {
    set('[data-today-day]', `Ma, ${DAYS[day].toLowerCase()}`);
    set('[data-today-name]', sp.name);
    set('[data-today-desc]', sp.desc);
    set('[data-today-price]', ft(sp.price));
  } else {
    set('[data-today-day]', 'Ma zárva vagyunk');
    set('[data-today-name]', `Holnap: ${specials[(day + 1) % 7].name}`);
    set('[data-today-desc]', 'Hétfőn pihenünk, kedden 12 órától várunk.');
  }
  document.querySelector(`.fk-week [data-day="${day}"]`)?.classList.add('is-today');
  const todayRow = { 0: 'Vasárnap', 1: 'Hétfő', 5: 'Péntek-szombat', 6: 'Péntek-szombat' }[day] || 'Kedd-csütörtök';
  document.querySelector(`.fk-hours [data-days="${todayRow}"]`)?.classList.add('is-today');
  const h = HOURS[day];
  const hour = now.getHours() + now.getMinutes() / 60;
  const open = !!h && hour >= h[0] && hour < h[1];
  const openEl = document.querySelector('[data-open-now]');
  openEl?.classList.toggle('is-open', open);
  set('[data-open-text]', open ? `Most nyitva, ${h[1]}:00-ig` : h && hour < h[0] ? `Ma ${h[0]}:00-tól nyitunk` : 'Most zárva, kedden 12:00-tól várunk');

  /* booking */
  const form = document.querySelector('[data-booking]');
  const date = form?.elements.namedItem('date');
  if (date) date.min = now.toISOString().slice(0, 10);
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const rules = {
      date: (v) => {
        if (!v) return 'Válassz dátumot.';
        const d = new Date(`${v}T12:00`);
        if (d < new Date(now.toDateString())) return 'Múltbeli napra nem lehet foglalni.';
        if (d.getDay() === 1) return 'Hétfőn zárva vagyunk, válassz másik napot.';
        return true;
      },
      time: (v, _, f) => {
        if (!v) return 'Válassz időpontot.';
        const d = f.elements.namedItem('date').value;
        const hh = d && HOURS[new Date(`${d}T12:00`).getDay()];
        const t = Number(v.slice(0, 2)) + Number(v.slice(3)) / 60;
        return !hh || t <= hh[1] - 1.5 || `Aznap ${hh[1]}:00-ig vagyunk nyitva, az utolsó foglalható időpont ${hh[1] - 2}:30.`;
      },
      name: (v) => v.trim().length > 1 || 'Add meg a neved.',
      phone: (v) => /^[+\d][\d\s/()-]{6,}$/.test(v.trim()) || 'Adj meg egy telefonszámot, ha változna valami, ezen hívunk.',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Érvényes e-mail címet adj meg, ide küldjük a visszaigazolást.',
    };
    let first = null;
    for (const [name, rule] of Object.entries(rules)) {
      const el = form.elements.namedItem(name);
      const res = rule(el.value, el, form);
      el.setAttribute('aria-invalid', String(res !== true));
      document.getElementById(`b-${name}-err`).textContent = res === true ? '' : res;
      if (res !== true && !first) first = el;
    }
    const status = form.querySelector('.fk-form-status');
    if (first) { status.textContent = ''; first.focus(); return; }
    const d = new Date(`${form.elements.namedItem('date').value}T12:00`);
    status.textContent = `Köszönjük! ${d.toLocaleDateString('hu-HU', { month: 'long', day: 'numeric' })}, ${form.elements.namedItem('time').value}: ${form.elements.namedItem('guests').value} főre foglaltunk. (Ez egy mintaoldal, a foglalás nem kerül elküldésre.)`;
    form.querySelector('button[type=submit]').disabled = true;
  });
}
