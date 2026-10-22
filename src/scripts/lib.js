// Shared client helpers. Every storage access is guarded: private mode or
// blocked storage must never break the page.

const NUM_LOCALE = { fa: 'fa-u-nu-arabext', ar: 'ar-u-nu-arab', en: 'en-US' };
export const lang = () => document.documentElement.lang || 'en';
export const num = (n) => new Intl.NumberFormat(NUM_LOCALE[lang()] || 'en-US', { useGrouping: false }).format(n);
export const fmt = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));

export function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v == null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
}
export function save(key, value) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// Checklist progress — one key per platform: { done: [stepId…], at: ISO }
export const progressKey = (platform) => `kd:progress:${platform}`;
export const getDone = (platform) => new Set(load(progressKey(platform), { done: [] }).done || []);
export const setDone = (platform, set) =>
  save(progressKey(platform), set.size ? { done: [...set], at: new Date().toISOString() } : null);

let toastTimer;
export function toast(msg) {
  const el = document.querySelector('[data-toast]');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

const COPY_FAILED = {
  fa: 'کپی خودکار انجام نشد؛ متن را دستی انتخاب و کپی کنید.',
  en: 'Could not copy automatically. Please select and copy the text manually.',
  ar: 'تعذّر النسخ تلقائيًا. حدّد النص وانسخه يدويًا.',
};

export async function copy(text, okMsg) {
  let ok = false;
  try {
    await navigator.clipboard.writeText(text);
    ok = true;
  } catch {
    // Fallback for older browsers / non-secure contexts.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;opacity:0;inset-inline-start:-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
  }
  toast(ok ? okMsg : COPY_FAILED[lang()] || COPY_FAILED.en);
  return ok;
}

/** Two-tap confirm for destructive buttons (no blocking browser dialogs). */
export function confirmButton(btn, onConfirm) {
  let armed = false;
  let timer;
  const label = btn.querySelector('span');
  btn.addEventListener('click', () => {
    if (!armed) {
      armed = true;
      btn.classList.add('armed');
      if (label) label.textContent = btn.dataset.confirm;
      timer = setTimeout(reset, 3500);
      return;
    }
    reset();
    onConfirm();
    toast(btn.dataset.done);
  });
  function reset() {
    armed = false;
    clearTimeout(timer);
    btn.classList.remove('armed');
    if (label) label.textContent = btn.dataset.label;
  }
}

export function detectDevice() {
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  return null;
}
