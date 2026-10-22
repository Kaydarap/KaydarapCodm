// Validates src/data/*.json before every build/deploy.
//   errors   → missing translations, broken markup, invalid dates/links (build fails)
//   warnings → texts marked "Translation needs update" in the CMS (build continues)
import { readFileSync } from 'node:fs';

const LANGS = ['fa', 'en', 'ar'];
const read = (f) => JSON.parse(readFileSync(new URL(`../src/data/${f}`, import.meta.url), 'utf8'));
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const filled = (v) => typeof v === 'string' && v.trim().length > 0;
const isUrl = (v) => { try { return ['https:', 'http:'].includes(new URL(v).protocol); } catch { return false; } };
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

const settings = read('settings.json');
if (!isUrl(settings.champion?.url)) err('settings: champion.url must be a valid URL');
for (const [k, v] of Object.entries(settings.links || {})) if (v && !isUrl(v)) err(`settings: links.${k} is not a valid URL`);

function checkMarkup(where, s) {
  if ((s.match(/\*\*/g) || []).length % 2) err(`${where}: unmatched ** in text`);
  if ((s.match(/`/g) || []).length % 2) err(`${where}: unmatched \` in text`);
}

for (const file of ['rules-android.json', 'rules-ios.json']) {
  const r = read(file);
  if (!filled(r.version)) err(`${file}: version is empty`);
  if (!isDate(r.updatedAt)) err(`${file}: updatedAt must be YYYY-MM-DD`);
  for (const l of LANGS) {
    if (!filled(r[l]?.title) || !filled(r[l]?.closing)) err(`${file}: [${l}] title/closing missing`);
    if (r[l]?.outdated) warn(`${file}: [${l}] page title/closing needs translation update`);
  }
  const ids = new Set();
  (r.steps || []).forEach((s, i) => {
    const w = `${file} step ${i + 1} (${s.id})`;
    if (!/^[a-z0-9-]+$/.test(s.id || '')) err(`${w}: invalid id`);
    if (ids.has(s.id)) err(`${w}: duplicate id`);
    ids.add(s.id);
    for (const l of LANGS) {
      if (!filled(s[l]?.title) || !filled(s[l]?.body)) err(`${w}: [${l}] title/body missing`);
      else checkMarkup(`${w} [${l}]`, s[l].body);
      if (s[l]?.outdated) warn(`${w}: [${l}] needs translation update`);
    }
    (s.badges || []).forEach((b) => { if (!['ok', 'off', 'ban'].includes(b.tone)) err(`${w}: badge tone "${b.tone}" invalid`); });
    (s.links || []).forEach((lk) => {
      if (lk.url?.startsWith('@')) {
        const key = lk.url.slice(1);
        if (!(key in settings.links)) err(`${w}: link ${lk.url} not found in settings.links`);
      } else if (!isUrl(lk.url)) err(`${w}: link URL invalid`);
    });
  });
  if (!r.steps?.length) err(`${file}: no steps`);
}

const faq = read('faq.json');
faq.items.forEach((it, i) => {
  for (const l of LANGS) {
    if (!filled(it[l]?.q) || !filled(it[l]?.a)) err(`faq ${i + 1} (${it.id}): [${l}] question/answer missing`);
    if (it[l]?.outdated) warn(`faq ${it.id}: [${l}] needs translation update`);
  }
});

const home = read('home.json');
for (const l of LANGS) {
  if (!filled(home[l]?.title) || !filled(home[l]?.subtitle)) err(`home: [${l}] title/subtitle missing`);
  if (home[l]?.outdated) warn(`home: [${l}] needs translation update`);
}
if (home.notice?.enabled) for (const l of LANGS) if (!filled(home.notice[l])) err(`home: notice enabled but [${l}] text missing`);

const rooms = read('rooms.json');
(rooms.rooms || []).forEach((r, i) => {
  const w = `rooms ${i + 1} (${r.id})`;
  if (Number.isNaN(Date.parse(r.start))) err(`${w}: invalid start time`);
  if (r.end && Number.isNaN(Date.parse(r.end))) err(`${w}: invalid end time`);
  if (!['open', 'closed', 'full', 'soon'].includes(r.registration)) err(`${w}: invalid registration status`);
  for (const l of LANGS) if (!filled(r.title?.[l])) err(`${w}: [${l}] title missing`);
  if (r.link && !isUrl(r.link)) err(`${w}: link invalid`);
});

for (const w of warnings) console.warn(`⚠  ${w}`);
for (const e of errors) console.error(`✖  ${e}`);
console.log(`content check: ${errors.length} error(s), ${warnings.length} translation warning(s)`);
if (errors.length) process.exit(1);
