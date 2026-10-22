import { LANGS, LANG_META, UI } from '../i18n/ui.js';
import settings from '../data/settings.json';

export { LANGS, LANG_META, UI };

export const langPaths = () => LANGS.map((lang) => ({ params: { lang } }));

/** Replace {key} placeholders. */
export function fmt(str, vars = {}) {
  return str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
}

/** Number in the language's own digits (۱ / ١ / 1). */
export function num(lang, n) {
  return new Intl.NumberFormat(LANG_META[lang].numLocale, { useGrouping: false }).format(n);
}

export function formatDate(lang, iso) {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(LANG_META[lang].locale, { dateStyle: 'long', timeZone: 'UTC' }).format(d);
}

/** `rest` is the path after the language, e.g. "rules/android/". */
export const url = (lang, rest = '') => `/${lang}/${rest}`;
export const abs = (path) => new URL(path, settings.siteUrl).href;

/** Resolve "@key" references to settings.links. Empty string = not configured. */
export function resolveLink(value) {
  if (!value) return '';
  if (value.startsWith('@')) return settings.links[value.slice(1)] || '';
  return value;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const RTL = /[֐-ࣿ]/;

/**
 * Tiny, safe markup for rule text:
 *   **bold**  → highlighted term (isolated for correct RTL/LTR mixing)
 *   `text`    → copyable chip
 */
export function richText(src, lang) {
  const copyLabel = UI[lang].copy;
  return esc(src)
    .replace(/`([^`]+)`/g, (_, t) =>
      `<span class="chip" dir="ltr"><code>${t}</code><button type="button" class="chip-copy" data-copy-text="${t}" aria-label="${copyLabel}: ${t}">${ICON_COPY}</button></span>`)
    .replace(/\*\*([^*]+)\*\*/g, (_, t) => (RTL.test(t) ? `<strong class="hl">${t}</strong>` : `<bdi class="hl">${t}</bdi>`));
}

/** Plain text version (for copy / search). */
export const plain = (src, lang = 'en') =>
  src.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/`([^`]+)`/g, lang === 'en' ? '“$1”' : '«$1»');

const ICON_COPY = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M9 9h10v10H9zM5 15V5h10"/></svg>';
