// Nanato section theme. Pages under /{lang}/nanato/ reuse the main pages, so
// their inlined stylesheet is recoloured at build time (see src/middleware.js):
// KAYDARAP's neon red becomes Nanato's platinum/diamond silver on wine-red velvet.
// Restricted / "ban" states keep a red tone so their meaning stays obvious.

const MAP = [
  // neon red glows & lines → platinum (slightly softer)
  [/rgba\(255,\s*22,\s*60,\s*([\d.]+)\)/g, (_, a) => `rgba(226, 229, 238, ${(+a * 0.7).toFixed(2)})`],
  [/rgba\(143,\s*16,\s*40,\s*([\d.]+)\)/g, (_, a) => `rgba(122, 8, 26, ${a})`],
  [/#ff163c/gi, '#e2e5ee'],
  [/#8f1028/gi, '#6e0a19'],
  [/#ff4766/gi, '#fbfbfd'],
  [/#ff8da0|#ff9aac|#ffc3cd|#ffb3c0/gi, '#eef0f6'],
  [/#ffd0d8/gi, '#eceef4'],
  [/#ff5470|#ff7d93|#ff8fa2/gi, '#d9dce6'],
  [/#050507/gi, '#0c0306'],
  // gold accents (Champion Rules, sponsor-style highlights) → platinum on wine
  [/rgba(255,s*194,s*61,s*([d.]+))/g, (_, a) => `rgba(214, 218, 232, ${a})`],
  [/rgba(255,s*220,s*140,s*([d.]+))/g, (_, a) => `rgba(255, 255, 255, ${a})`],
  [/#ffd56a|#ffe39a/gi, '#ffffff'],
  [/#ffc23d/gi, '#dfe2ea'],
  [/#c9821b/gi, '#9a9eae'],
  [/#b06d10/gi, '#7a0a1c'],
  [/#1a0f00/gi, '#3a0510'],
];

export const recolor = (css) => MAP.reduce((s, [re, to]) => s.replace(re, to), css);

export const NANATO_CSS = `
:root { --violet: #b9bdcc; --wine: #7a0a1c; --velvet: #3a0510; --ban: #ff2a4a; color-scheme: dark; }
body {
  background:
    radial-gradient(ellipse 80% 55% at 75% -10%, rgba(150, 12, 34, 0.55), transparent 60%),
    radial-gradient(ellipse 70% 50% at 5% 105%, rgba(110, 8, 26, 0.6), transparent 60%),
    repeating-linear-gradient(115deg, rgba(255, 255, 255, 0.012) 0 2px, transparent 2px 6px),
    #0c0306;
  background-attachment: fixed;
}
.bg-glow-a { background: radial-gradient(circle, rgba(170, 14, 40, 0.5), transparent 65%); }
.bg-glow-b { background: radial-gradient(circle, rgba(120, 8, 26, 0.65), transparent 65%); }
.bg-grid { opacity: 0.35; }
.site-header { background: rgba(14, 3, 7, 0.82); border-bottom-color: rgba(226, 229, 238, 0.18); }

/* platinum metal: primary buttons and icon "gems" */
.btn-primary {
  color: #2a0710;
  background: linear-gradient(180deg, #ffffff 0%, #dfe2ea 38%, #a9adbb 62%, #eef0f5 100%);
  border-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 22px -6px rgba(255, 255, 255, 0.55), inset 0 1px 0 #fff, inset 0 -2px 0 rgba(0, 0, 0, 0.18);
  text-shadow: none;
}
.btn-primary:hover { box-shadow: 0 0 30px -4px rgba(255, 255, 255, 0.75), inset 0 1px 0 #fff; }
.btn-primary .ico { color: #6e0a19; }
.rcard-icon, .ch-tile-icon, .ch-head-icon, .ch-seq-n, .rules-badge, .step-num span {
  color: #5a0815;
  background: radial-gradient(circle at 30% 22%, #ffffff, #dfe2ea 40%, #9fa3b2 75%, #e9ebf1);
  box-shadow: 0 0 22px -4px rgba(255, 255, 255, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.5), inset 0 -3px 6px rgba(0, 0, 0, 0.2);
}
.neon { background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 40%), linear-gradient(160deg, rgba(110, 8, 26, 0.28), rgba(20, 6, 10, 0.92) 55%); }
html[data-fx='full'] .neon::before, html[data-fx='balanced'] .neon:hover::before {
  background: conic-gradient(from var(--angle), transparent 0 68%, #ffffff 78%, #c9ccd8 83%, #b0122f 89%, transparent 93%);
}
.hero-title { background: linear-gradient(180deg, #ffffff 25%, #c9ccd8 70%, #ffffff); -webkit-background-clip: text; background-clip: text; filter: drop-shadow(0 0 22px rgba(255, 255, 255, 0.25)); }
.eyebrow { color: #f1f2f6; border-color: rgba(226, 229, 238, 0.35); background: rgba(122, 8, 26, 0.35); }
.section-title::after { background: linear-gradient(90deg, #e2e5ee, #8a0c22 60%, transparent); }
[dir='rtl'] .section-title::after { background: linear-gradient(-90deg, #e2e5ee, #8a0c22 60%, transparent); }
.nav-top a[aria-current='page']::after { background: linear-gradient(90deg, #8a0c22, #fff, #8a0c22); box-shadow: 0 0 10px rgba(255, 255, 255, 0.6); }

.seg input:checked + span, .seg a[aria-current='page'] {
  background: linear-gradient(135deg, #a10f28, #4a0612); color: #fff;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.35), 0 0 16px -4px rgba(170, 14, 40, 0.9);
}
.btn-gold .ico, .rcard-champion .rcard-icon { color: #6e0a19; }

/* keep "banned" unmistakably red */
.ch-item-ban { border-color: rgba(255, 42, 74, 0.55); }
.ch-item-ban .ch-item-img { box-shadow: inset 0 0 40px -10px rgba(255, 42, 74, 0.65); }
.ch-item-ban .ch-item-tag, .ch-vstep-ban .ch-vtag { color: #fff; background: var(--ban); box-shadow: 0 0 12px -2px var(--ban); }
.ch-item-ban .ch-item-name, .ch-chip-ban { color: #ffd0d8; }
.ch-chip-ban { border-color: rgba(255, 42, 74, 0.5); background: repeating-linear-gradient(-45deg, rgba(255, 42, 74, 0.14) 0 6px, rgba(255, 42, 74, 0.04) 6px 12px); }
.ch-chip-ban::before { background: var(--ban); box-shadow: 0 0 8px var(--ban); }
.ch-pill-ban { color: #ff6b84; border-color: rgba(255, 42, 74, 0.6); background: rgba(255, 42, 74, 0.1); }
.ch-alert-ban { color: #ffd0d8; border-color: rgba(255, 42, 74, 0.7); background: repeating-linear-gradient(-45deg, rgba(255, 42, 74, 0.14) 0 8px, rgba(255, 42, 74, 0.05) 8px 16px); box-shadow: 0 0 30px -10px rgba(255, 42, 74, 0.9); }
.ch-alert-ban .ico { color: var(--ban); filter: drop-shadow(0 0 8px var(--ban)); }
.badge-ban { color: #ff6b84; border-color: rgba(255, 42, 74, 0.75); background: repeating-linear-gradient(-45deg, rgba(255, 42, 74, 0.16) 0 6px, rgba(255, 42, 74, 0.05) 6px 12px); box-shadow: 0 0 18px -6px rgba(255, 42, 74, 1); }
.badge-off { color: #ffd0d8; border-color: rgba(255, 42, 74, 0.6); background: rgba(255, 42, 74, 0.12); }
.ch-color-red { border-color: rgba(255, 42, 74, 0.75); }
.ch-color-red .ch-group-h > span:first-child { color: #ff6b84; }
.btn-danger { color: #ff8fa2; --b: rgba(255, 42, 74, 0.45); }
.btn-danger:hover, .btn-danger.armed { background: var(--ban); color: #fff; }

/* Nanato brand */
.logo-nanato { display: inline-flex; align-items: center; gap: 10px; }
.logo-nanato img { width: 38px; height: 38px; border-radius: 10px; object-fit: cover; box-shadow: 0 0 16px -3px rgba(180, 14, 40, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.35); }
.logo-nanato .logo-word { font-family: var(--font-display); font-weight: 900; letter-spacing: 0.12em; background: linear-gradient(180deg, #fff 30%, #b9bdcc 75%, #fff); -webkit-background-clip: text; background-clip: text; color: transparent; }
.logo-nanato .logo-word small { display: block; font-size: 0.55em; letter-spacing: 0.3em; color: #c9ccd8; -webkit-text-fill-color: #c9ccd8; }
.nanato-hero-logo {
  width: clamp(150px, 30vw, 240px); height: auto; aspect-ratio: 1310 / 1318; border-radius: 28px; object-fit: cover;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.35), 0 0 60px -8px rgba(170, 14, 40, 0.95), 0 0 120px -30px rgba(255, 255, 255, 0.5);
}
.hero-ring { border-color: rgba(226, 229, 238, 0.3); background: repeating-conic-gradient(from 0deg, rgba(226, 229, 238, 0.14) 0 2deg, transparent 2deg 12deg); box-shadow: 0 0 60px -10px rgba(170, 14, 40, 0.6), inset 0 0 60px -20px rgba(255, 255, 255, 0.3); }
.nanato-link[aria-current='true'] { color: #fff; border-color: rgba(255, 255, 255, 0.65); }
.copyright { color: #9a9daa; }
`;
