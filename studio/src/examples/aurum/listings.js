// Aurum Ingatlan, shared by both tiers: header state, mobile menu, listing filter, property dialog
// with gallery, and the valuation form (demo: validates, then thanks without sending anything).

export function initAurum({ viewTransitions = false } = {}) {
  /* header + menu */
  const header = document.querySelector('[data-header]');
  const onScroll = () => header?.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const menuBtn = document.querySelector('.au-menu');
  const links = document.getElementById('au-links');
  const setMenu = (open) => { menuBtn?.setAttribute('aria-expanded', String(open)); links?.classList.toggle('is-open', open); };
  menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  links?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

  /* filter */
  const form = document.querySelector('[data-filter]');
  const cards = [...document.querySelectorAll('.au-card')];
  const label = document.querySelector('[data-count-label]');
  const empty = document.querySelector('[data-empty]');
  const apply = () => {
    const d = new FormData(form);
    const type = d.get('type');
    const price = Number(d.get('price')) || Infinity;
    const rooms = Number(d.get('rooms')) || 0;
    let shown = 0;
    for (const c of cards) {
      const ok = (!type || c.dataset.type === type) && Number(c.dataset.price) <= price && Number(c.dataset.rooms) >= rooms;
      c.classList.toggle('is-out', !ok);
      if (ok) shown++;
    }
    label.textContent = `${shown} ingatlan`;
    empty.hidden = shown > 0;
  };
  const update = () => (viewTransitions && document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches
    ? document.startViewTransition(apply)
    : apply());
  form?.addEventListener('change', update);
  document.querySelector('[data-reset]')?.addEventListener('click', () => { form.reset(); update(); });

  /* property dialog */
  const dialog = document.querySelector('[data-dialog]');
  const body = dialog?.querySelector('[data-dialog-body]');
  let opener = null;
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-open]');
    if (!btn) return;
    const tpl = document.getElementById(`tpl-${btn.dataset.open}`);
    body.replaceChildren(tpl.content.cloneNode(true));
    opener = btn;
    dialog.showModal();
    initGallery(body.querySelector('[data-gallery]'));
  });
  dialog?.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('[data-close]')) dialog.close();
  });
  dialog?.addEventListener('close', () => opener?.focus({ preventScroll: true }));

  /* valuation form */
  const val = document.querySelector('[data-valuation]');
  val?.addEventListener('submit', (e) => {
    e.preventDefault();
    const rules = {
      name: (v) => v.trim().length > 1 || 'Add meg a neved.',
      phone: (v) => /^[+\d][\d\s/()-]{6,}$/.test(v.trim()) || 'Adj meg egy telefonszámot, ezen hívunk vissza.',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Érvényes e-mail címet adj meg.',
      address: (v) => v.trim().length > 4 || 'Add meg az ingatlan címét.',
      type: (v) => !!v || 'Válaszd ki az ingatlan típusát.',
      area: (v) => (Number(v.replace(',', '.')) > 10) || 'Add meg az alapterületet négyzetméterben.',
      consent: (_, el) => el.checked || 'A visszahíváshoz szükség van a hozzájárulásodra.',
    };
    let first = null;
    for (const [name, rule] of Object.entries(rules)) {
      const el = val.elements.namedItem(name);
      const res = rule(el.value, el);
      const err = document.getElementById(`v-${name}-err`);
      el.setAttribute('aria-invalid', String(res !== true));
      err.textContent = res === true ? '' : res;
      if (res !== true && !first) first = el;
    }
    const status = val.querySelector('.au-form-status');
    if (first) { status.textContent = ''; first.focus(); return; }
    status.textContent = 'Köszönjük! Munkatársunk egy munkanapon belül hív. (Ez egy mintaoldal, az űrlap nem küld el semmit.)';
    val.querySelector('button[type=submit]').disabled = true;
  });
}

function initGallery(root) {
  if (!root) return;
  const track = root.querySelector('[data-slides]');
  const slides = [...track.children];
  const current = root.querySelector('[data-current]');
  const index = () => Math.round(track.scrollLeft / track.clientWidth);
  const go = (i) => track.scrollTo({ left: ((i + slides.length) % slides.length) * track.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-step]');
    if (b) go(index() + Number(b.dataset.step));
  });
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go(index() + 1);
    if (e.key === 'ArrowLeft') go(index() - 1);
  });
  track.addEventListener('scroll', () => { current.textContent = String(index() + 1); }, { passive: true });
}
