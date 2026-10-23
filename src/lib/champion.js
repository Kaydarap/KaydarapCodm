import champion from '../data/champion.json';
import images from '../data/champion-images.json';
import { UI, fmt, num } from './i18n.js';

export { champion, images };
export const sections = champion.sections;

/** A value that is either a plain (in-game, untranslated) string or { fa, en, ar }. */
export const loc = (v, lang) => (typeof v === 'string' ? v : v?.[lang] ?? '');
export const isPlain = (v) => typeof v === 'string';

const listItems = (b) => (b.type === 'names' ? b.items : b.type === 'groups' ? b.groups.flatMap((g) => g.items) : []);

/** Short count shown on each section tile, e.g. "15 restricted". */
export function sectionCount(section, lang) {
  const c = UI[lang].champ.count;
  const tones = {};
  for (const b of section.blocks) {
    const n = listItems(b).length;
    if (n) tones[b.tone] = (tones[b.tone] || 0) + n;
  }
  const tone = ['ok', 'map', 'ban'].find((k) => tones[k]);
  if (tone) return { tone, text: fmt(c[tone], { n: num(lang, tones[tone]) }) };
  const modes = section.blocks.filter((b) => b.type === 'settings').length;
  if (modes) return { tone: 'info', text: fmt(c.mode, { n: num(lang, modes) }) };
  const seq = section.blocks.find((b) => b.type === 'sequence');
  if (seq) return { tone: 'info', text: fmt(c.step, { n: num(lang, seq.items.length) }) };
  const log = section.blocks.find((b) => b.type === 'changelog');
  if (log) return { tone: 'info', text: fmt(c.update, { n: num(lang, log.entries.length) }) };
  const rules = section.blocks.reduce((s, b) => s + (b.type === 'points' ? b.items.length : 0), 0);
  return { tone: 'info', text: fmt(c.rule, { n: num(lang, rules) }) };
}

/** Flat list of every named item, for the "is it allowed?" checker. */
export function checkIndex(lang) {
  const out = [];
  for (const s of sections) {
    for (const b of s.blocks) {
      if (b.type === 'names') {
        for (const it of b.items) out.push({ n: loc(it, lang), t: b.tone, s: s.id, g: b.mode || loc(b.title, lang), i: images[it]?.src });
      } else if (b.type === 'groups') {
        for (const g of b.groups) for (const it of g.items) out.push({ n: loc(it, lang), t: b.tone, s: s.id, g: loc(g.name, lang), i: (images[it] || images[g.name])?.src });
      } else if (b.type === 'alert' && b.title) {
        out.push({ n: b.title, t: b.tone, s: s.id, g: '' });
      }
    }
  }
  return out;
}
