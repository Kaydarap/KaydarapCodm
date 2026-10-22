// Client-side search over the rules in the current language, with a
// platform filter. State is mirrored to ?q=&p= so results can be shared.
import { fmt, num } from './lib.js';

const data = JSON.parse(document.getElementById('rules-index').textContent);
const input = document.querySelector('[data-search-input]');
const filter = document.querySelector('[data-filter]');
const box = document.querySelector('[data-search-results]');
const list = document.querySelector('[data-search-list]');
const count = document.querySelector('[data-search-count]');
const empty = document.querySelector('[data-search-empty]');
const cards = document.querySelectorAll('.rule-cards [data-platform]');

// Fold Arabic/Persian letter variants, diacritics and case.
const norm = (s) =>
  s.toLowerCase()
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه')
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

const items = data.index.map((it) => ({ ...it, hay: norm(`${it.title} ${it.text}`) }));
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function mark(text, terms) {
  // Highlight on the original text using a folded copy for positions.
  const folded = norm(text);
  if (folded.length !== text.length) return esc(text); // diacritics shifted positions
  const ranges = [];
  terms.forEach((t) => {
    let i = folded.indexOf(t);
    while (i >= 0) { ranges.push([i, i + t.length]); i = folded.indexOf(t, i + t.length); }
  });
  if (!ranges.length) return esc(text);
  ranges.sort((a, b) => a[0] - b[0]);
  let out = '';
  let last = 0;
  ranges.forEach(([a, b]) => {
    if (a < last) return;
    out += esc(text.slice(last, a)) + '<mark>' + esc(text.slice(a, b)) + '</mark>';
    last = b;
  });
  return out + esc(text.slice(last));
}

const platform = () => filter.querySelector('input:checked').value;

function run() {
  const p = platform();
  cards.forEach((c) => { c.hidden = p !== 'all' && c.dataset.platform !== p && c.dataset.platform !== 'champion'; });
  const q = input.value.trim();
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (p !== 'all') params.set('p', p);
  history.replaceState(null, '', location.pathname + (params.toString() ? `?${params}` : ''));

  if (!q) { box.hidden = true; return; }
  const terms = norm(q).split(/\s+/).filter(Boolean);
  const hits = items.filter((it) => (p === 'all' || it.p === p) && terms.every((t) => it.hay.includes(t)));
  box.hidden = false;
  count.textContent = fmt(count.dataset.tpl, { n: num(hits.length) });
  empty.hidden = hits.length > 0;
  list.innerHTML = hits
    .map((it) => `<li><a class="result neon" href="${it.h}">
      <span class="result-meta">${esc(it.pt)} · ${esc(fmt(data.stepLabel, { n: it.n }))}</span>
      <strong class="result-title">${mark(it.title, terms)}</strong>
      <span class="result-text">${mark(it.text, terms)}</span></a></li>`)
    .join('');
}

const params = new URLSearchParams(location.search);
if (params.get('q')) input.value = params.get('q');
const p0 = params.get('p');
if (p0 === 'android' || p0 === 'ios') filter.querySelector(`input[value="${p0}"]`).checked = true;

input.addEventListener('input', run);
filter.addEventListener('change', run);
run();
if (location.hash === '#search') input.focus();
