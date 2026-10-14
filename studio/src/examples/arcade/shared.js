// Pixel Pont, shared by both tiers: today's opening hours and the (demo) party booking form.
const HOURS = ['10:00-20:00', '14:00-22:00', '14:00-22:00', '14:00-22:00', '14:00-22:00', '14:00-24:00', '10:00-24:00'];

export function initArcadeShared() {
  const day = new Date().getDay();
  for (const li of document.querySelectorAll(`[data-hours] li[data-day="${day}"]`)) li.classList.add('is-today');
  for (const el of document.querySelectorAll('[data-today]')) el.textContent = `Ma nyitva ${HOURS[day]}`;

  for (const form of document.querySelectorAll('[data-party-form]')) {
    const err = form.querySelector('[data-form-err]');
    const ok = form.querySelector('[data-form-ok]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const missing = [...form.querySelectorAll('[required]')].filter((i) => !i.value.trim());
      for (const i of form.querySelectorAll('[required]')) i.setAttribute('aria-invalid', String(missing.includes(i)));
      if (missing.length) {
        err.textContent = 'Töltsd ki a nevet, a telefonszámot és a napot.';
        missing[0].focus();
        return;
      }
      err.textContent = '';
      form.querySelector('button[type=submit]').hidden = true;
      ok.hidden = false;
    });
  }
}
