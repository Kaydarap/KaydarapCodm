import { fmt, lang, num } from './lib.js';

const LOCALE = { fa: 'fa-IR', en: 'en-US', ar: 'ar' };

// Local-time display + countdown for rooms in src/data/rooms.json.
export function initRooms() {
  const rooms = [...document.querySelectorAll('[data-room]')];
  const tzNote = document.querySelector('[data-tz-note]');
  if (tzNote) {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    tzNote.textContent = fmt(tzNote.dataset.tpl, { tz });
    tzNote.hidden = false;
  }
  if (!rooms.length) return;

  const dtf = new Intl.DateTimeFormat(LOCALE[lang()] || 'en-US', { dateStyle: 'full', timeStyle: 'short' });
  rooms.forEach((el) => {
    const t = el.querySelector('[data-local-time]');
    t.textContent = dtf.format(new Date(el.dataset.start));
  });

  // Home page: hide ended rooms and keep only the next N.
  const list = document.querySelector('[data-rooms]');
  const limit = Number(list?.dataset.limit || 0);
  if (limit) {
    const now = Date.now();
    let shown = 0;
    rooms.forEach((el) => {
      const end = el.dataset.end ? Date.parse(el.dataset.end) : Date.parse(el.dataset.start);
      const keep = end >= now && shown < limit;
      el.hidden = !keep;
      if (keep) shown++;
    });
    if (!shown) {
      const p = document.createElement('p');
      p.className = 'empty-inline';
      p.textContent = list.dataset.emptyText;
      list.replaceWith(p);
      return;
    }
  }

  const tick = () => {
    const now = Date.now();
    rooms.forEach((el) => {
      const out = el.querySelector('[data-countdown]');
      const start = Date.parse(el.dataset.start);
      const end = el.dataset.end ? Date.parse(el.dataset.end) : NaN;
      if (!Number.isNaN(end) && now > end) {
        out.textContent = out.dataset.labelEnded;
        el.classList.add('is-ended');
        return;
      }
      if (now >= start) {
        out.textContent = out.dataset.labelStarted;
        el.classList.add('is-live');
        return;
      }
      const u = JSON.parse(out.dataset.u);
      let s = Math.floor((start - now) / 1000);
      const d = Math.floor(s / 86400); s %= 86400;
      const h = Math.floor(s / 3600); s %= 3600;
      const m = Math.floor(s / 60); s %= 60;
      const parts = [d ? `${num(d)}${u.d}` : '', `${num(h)}${u.h}`, `${num(m)}${u.m}`, `${num(s)}${u.s}`].filter(Boolean);
      out.textContent = `${out.dataset.labelIn} ${parts.join(' ')}`;
    });
  };
  tick();
  let timer = setInterval(tick, 1000);
  document.addEventListener('visibilitychange', () => {
    clearInterval(timer);
    if (!document.hidden) { tick(); timer = setInterval(tick, 1000); }
  });
}
