import { confirmButton, load, progressKey, save, toast } from './lib.js';

const html = document.documentElement;
const root = document.querySelector('[data-settings]');
const prefs = load('kd:prefs', {});
const current = { fx: html.dataset.fx, reading: html.dataset.reading === 'on', text: html.dataset.text };

root.querySelectorAll('[data-pref]').forEach((input) => {
  const key = input.dataset.pref;
  if (input.type === 'checkbox') input.checked = current[key];
  else input.checked = input.value === current[key];

  input.addEventListener('change', () => {
    const value = input.type === 'checkbox' ? input.checked : input.value;
    prefs[key] = value;
    if (key === 'reading') html.dataset.reading = value ? 'on' : 'off';
    else html.dataset[key] = value;
    save('kd:prefs', prefs);
    window.dispatchEvent(new Event('kd:prefs'));
    toast(root.dataset.saved);
  });
});

if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  root.querySelector('[data-reduced-note]').hidden = false;
}

confirmButton(root.querySelector('[data-reset-all]'), () => {
  save(progressKey('android'), null);
  save(progressKey('ios'), null);
});
