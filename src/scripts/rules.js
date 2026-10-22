import QRCode from 'qrcode';
import { confirmButton, copy, fmt, getDone, load, num, save, setDone } from './lib.js';

const root = document.querySelector('[data-rules]');
const platform = root.dataset.platform;
const pageUrl = root.dataset.url;
const steps = [...root.querySelectorAll('[data-step]')];
const total = steps.length;
const checks = steps.map((s) => s.querySelector('[data-check]'));
const $ = (sel) => root.querySelector(sel);

const pb = $('[data-progressbar]');
const bar = pb.querySelector('[data-bar]');
const pText = $('[data-progress-text]');
const contBtn = $('[data-continue]');
const allChecked = $('[data-all-checked]');

// Only count ids that still exist (steps may be edited later in the CMS).
const known = new Set(steps.map((s) => s.dataset.step));
let done = new Set([...getDone(platform)].filter((id) => known.has(id)));

const firstOpen = () => {
  const i = steps.findIndex((s) => !done.has(s.dataset.step));
  return i < 0 ? null : i;
};

function render() {
  checks.forEach((c, i) => {
    c.checked = done.has(c.dataset.check);
    steps[i].classList.toggle('is-done', c.checked);
  });
  const n = done.size;
  const label = fmt(pText.dataset.tpl, { done: num(n), total: num(total) });
  bar.style.setProperty('--p', n / total);
  pb.setAttribute('aria-valuenow', String(n));
  pb.setAttribute('aria-label', label);
  pText.textContent = label;
  const next = firstOpen();
  contBtn.hidden = !(n > 0 && next !== null);
  if (next !== null) contBtn.querySelector('span').textContent = fmt(contBtn.dataset.tpl, { n: num(next + 1) });
  allChecked.hidden = n !== total;
  root.classList.toggle('is-complete', n === total);
}

checks.forEach((c) =>
  c.addEventListener('change', () => {
    if (c.checked) done.add(c.dataset.check);
    else done.delete(c.dataset.check);
    setDone(platform, done);
    render();
  }),
);

// ── Step-by-step mode ──
const nav = $('[data-guided-nav]');
const toggle = $('[data-guided-toggle]');
const pos = $('[data-guided-pos]');
const prev = $('[data-guided-prev]');
const next = $('[data-guided-next]');
let guided = false;
let cur = 0;

function focusStep(i, { scroll = true } = {}) {
  const el = steps[i];
  el.classList.remove('is-target');
  void el.offsetWidth; // restart highlight animation
  el.classList.add('is-target');
  if (scroll) {
    const smooth = document.documentElement.dataset.fx !== 'low' && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  }
  history.replaceState(null, '', `#step-${i + 1}`);
}

function show(i) {
  cur = Math.max(0, Math.min(total - 1, i));
  steps.forEach((s, j) => { s.hidden = j !== cur; });
  pos.textContent = `${num(cur + 1)} / ${num(total)}`;
  prev.disabled = cur === 0;
  next.disabled = cur === total - 1;
  focusStep(cur);
}

function setGuided(on, start) {
  guided = on;
  root.classList.toggle('guided', on);
  nav.hidden = !on;
  toggle.setAttribute('aria-pressed', String(on));
  toggle.querySelector('span').textContent = on ? toggle.dataset.on : toggle.dataset.off;
  save('kd:guided', on || null);
  if (on) show(start ?? firstOpen() ?? 0);
  else steps.forEach((s) => { s.hidden = false; });
}

toggle.addEventListener('click', () => setGuided(!guided));
prev.addEventListener('click', () => show(cur - 1));
next.addEventListener('click', () => show(cur + 1));

contBtn.addEventListener('click', () => {
  const i = firstOpen();
  if (i === null) return;
  if (guided) show(i);
  else focusStep(i);
  steps[i].querySelector('[data-check]').focus({ preventScroll: true });
});

// ── Copy / share / step links ──
$('[data-copy-all]').addEventListener('click', (e) => {
  const text = $('[data-copy-source]').content.textContent.trim();
  copy(text, e.currentTarget.dataset.done);
});

$('[data-share]').addEventListener('click', async (e) => {
  const msg = e.currentTarget.dataset.done;
  if (navigator.share) {
    try {
      await navigator.share({ title: root.dataset.title, url: pageUrl });
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
  }
  copy(pageUrl, msg);
});

root.querySelectorAll('[data-copy-link]').forEach((b) =>
  b.addEventListener('click', () => copy(`${pageUrl}#${b.dataset.copyLink}`, b.dataset.done)),
);

// ── QR code (generated locally, no external service) ──
const dialog = $('[data-qr-dialog]');
let qrDrawn = false;
function openQr() {
  if (!qrDrawn) {
    QRCode.toCanvas($('[data-qr-canvas]'), pageUrl, {
      width: 240,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#050507', light: '#ffffff' },
    });
    qrDrawn = true;
  }
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}
$('[data-qr-open]').addEventListener('click', openQr);
dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

confirmButton($('[data-reset]'), () => {
  done = new Set();
  setDone(platform, done);
  render();
});

// ── Initial state from URL (#step-n, ?guided=1, ?continue=1, ?qr=1) ──
render();
const params = new URLSearchParams(location.search);
const hashStep = /^#step-(\d+)$/.exec(location.hash);
const hashIndex = hashStep ? Number(hashStep[1]) - 1 : null;
const validHash = hashIndex !== null && hashIndex >= 0 && hashIndex < total;

if (params.get('guided') === '1' || load('kd:guided', false)) setGuided(true, validHash ? hashIndex : undefined);
else if (validHash) focusStep(hashIndex, { scroll: false });

if (params.get('continue') === '1' && firstOpen() !== null && done.size) contBtn.click();
if (params.get('qr') === '1') openQr();
if (params.toString()) history.replaceState(null, '', location.pathname + location.hash);
