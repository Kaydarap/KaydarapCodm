import { copy, detectDevice, fmt, getDone, num } from './lib.js';
import { startEmbers } from './embers.js';
import { initRooms } from './rooms.js';

const html = document.documentElement;

// ── Language switch: remember choice and keep the same page + step anchor ──
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-lang-switch]');
  if (!a) return;
  try { localStorage.setItem('kd:lang', a.dataset.langSwitch); } catch {}
  if (location.hash && a.pathname.replace(/^\/\w+/, '') === location.pathname.replace(/^\/\w+/, '')) {
    e.preventDefault();
    location.href = a.pathname + location.search + location.hash;
  }
});

// Close the language menu on outside click / Escape.
const langMenu = document.querySelector('[data-lang-menu]');
if (langMenu) {
  document.addEventListener('click', (e) => {
    if (langMenu.open && !langMenu.contains(e.target)) langMenu.open = false;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && langMenu.open) {
      langMenu.open = false;
      langMenu.querySelector('summary').focus();
    }
  });
}

// ── Copy chips (e.g. `cod`, `Check host`) ──
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-copy-text]');
  if (!b) return;
  const done = { fa: 'کپی شد', en: 'Copied', ar: 'تم النسخ' }[html.lang] || 'Copied';
  copy(b.dataset.copyText, `${done}: ${b.dataset.copyText}`);
});

// ── Back to top ──
const top = document.querySelector('[data-to-top]');
if (top) {
  const onScroll = () => { top.hidden = window.scrollY < 600; };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  top.addEventListener('click', () => {
    const smooth = html.dataset.fx !== 'low' && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    document.getElementById('main')?.focus({ preventScroll: true });
  });
}

// ── Reveal on scroll (content is fully visible without JS) ──
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && html.dataset.fx !== 'low') {
  html.classList.add('reveal-ready');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((el) => io.observe(el));
}

// ── Device suggestion (approximate, never redirects) ──
const hint = document.querySelector('[data-device-hint]');
if (hint) {
  let dismissed = false;
  try { dismissed = sessionStorage.getItem('kd:hint') === '0'; } catch {}
  const dev = detectDevice();
  if (dev && !dismissed) {
    hint.querySelector(`[data-device-text="${dev}"]`).hidden = false;
    const link = hint.querySelector('[data-device-link]');
    link.href = link.dataset[dev === 'ios' ? 'hrefIos' : 'hrefAndroid'];
    hint.querySelector('[data-device-icon]').append(hint.querySelector(`[data-icon-${dev}]`).content.cloneNode(true));
    hint.hidden = false;
  }
  hint.querySelector('[data-device-dismiss]').addEventListener('click', () => {
    hint.hidden = true;
    try { sessionStorage.setItem('kd:hint', '0'); } catch {}
  });
}

// ── Checklist summaries (home page + rule cards) ──
document.querySelectorAll('[data-mini-progress]').forEach((row) => {
  const platform = row.dataset.miniProgress;
  const ids = row.dataset.ids.split(',');
  const total = Number(row.dataset.total);
  const done = ids.filter((id) => getDone(platform).has(id)).length;
  row.querySelector('[data-bar]').style.setProperty('--p', done / total);
  const text = row.querySelector('[data-mini-text]');
  text.textContent = done ? fmt(text.dataset.tpl, { done: num(done), total: num(total) }) : text.dataset.empty;
});

document.querySelectorAll('[data-progress-badge]').forEach((el) => {
  const ids = el.dataset.ids.split(',');
  const done = ids.filter((id) => getDone(el.dataset.progressBadge).has(id)).length;
  if (!done) return;
  const b = document.createElement('span');
  b.className = 'rcard-done';
  b.textContent = `✓ ${num(done)}/${num(ids.length)}`;
  el.append(b);
});

startEmbers();
initRooms();
