// "Is it allowed?" quick check over every named item in Champion Rules.
const data = JSON.parse(document.getElementById('ch-index').textContent);
const input = document.querySelector('[data-ch-input]');
const list = document.querySelector('[data-ch-results]');
const none = document.querySelector('[data-ch-none]');

// Fold case, punctuation and curly quotes so "50gs" finds ".50 GS".
const norm = (s) => s.toLowerCase().replace(/[’'"”“.\-\s]/g, '');
const items = data.items.map((it) => ({ ...it, key: norm(it.n) }));
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const ICON = {
  ban: '<path d="M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM6 6l12 12"/>',
  ok: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
};

function render() {
  const q = norm(input.value);
  if (q.length < 2) {
    list.innerHTML = '';
    none.hidden = true;
    return;
  }
  const hits = items
    .filter((it) => it.key.includes(q))
    .sort((a, b) => (a.key.startsWith(q) ? 0 : 1) - (b.key.startsWith(q) ? 0 : 1))
    .slice(0, 12);
  none.hidden = hits.length > 0;
  list.innerHTML = hits.map((it) => `
    <li class="ch-result ch-tone-${it.t}">
      <a href="${data.base}${it.s}/">
        ${it.i ? `<img class="ch-result-img" src="${it.i}" alt="" loading="lazy" decoding="async">` : ''}
        <span class="ch-pill ch-pill-${it.t}"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">${ICON[it.t]}</svg>${esc(data.tone[it.t])}</span>
        <bdi class="ch-result-n">${esc(it.n)}</bdi>
        <small class="muted">${esc(data.titles[it.s])}${it.g ? ` · <bdi>${esc(it.g)}</bdi>` : ''}</small>
      </a>
    </li>`).join('');
}

input.addEventListener('input', render);
