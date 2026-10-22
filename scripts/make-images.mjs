// Generates PNG icons + the social share image from SVG. Run: npm run images
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const out = (f) => new URL(`../public/${f}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const favicon = readFileSync(new URL('../public/favicon.svg', import.meta.url));

for (const [file, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-512.png', 512]]) {
  await sharp(favicon, { density: 600 }).resize(size, size).png().toFile(out(file));
}

const grid = Array.from({ length: 22 }, (_, i) => `<path d="M${i * 56} 0V630" />`).join('') +
  Array.from({ length: 12 }, (_, i) => `<path d="M0 ${i * 56}H1200" />`).join('');

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="78%" cy="18%" r="70%">
      <stop offset="0" stop-color="#ff163c" stop-opacity=".55"/>
      <stop offset=".6" stop-color="#8f1028" stop-opacity=".15"/>
      <stop offset="1" stop-color="#050507" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="crown" cx="50%" cy="30%" r="80%">
      <stop offset="0" stop-color="#ff5a76"/><stop offset="1" stop-color="#8f1028"/>
    </radialGradient>
    <linearGradient id="line" x1="0" x2="1">
      <stop offset="0" stop-color="#ff163c" stop-opacity="0"/><stop offset=".5" stop-color="#ff163c"/><stop offset="1" stop-color="#ff163c" stop-opacity="0"/>
    </linearGradient>
    <filter id="neon" x="-20%" y="-50%" width="140%" height="200%">
      <feGaussianBlur stdDeviation="10" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="neonWide" filterUnits="userSpaceOnUse" x="-20" y="-20" width="72" height="62">
      <feGaussianBlur stdDeviation="2.4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="#050507"/>
  <g stroke="#ff163c" stroke-opacity=".08">${grid}</g>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="24" y="24" width="1152" height="582" rx="28" fill="none" stroke="#ff163c" stroke-opacity=".55" stroke-width="2"/>
  <g transform="translate(470 120) scale(4.2)" filter="url(#neonWide)">
    <path d="M2 6l7 6 7-10 7 10 7-6-3 14H5z" fill="url(#crown)"/>
  </g>
  <text x="600" y="400" text-anchor="middle" font-family="Orbitron, Arial Black, Arial, sans-serif" font-weight="900" font-size="112" letter-spacing="8" fill="#ffffff" filter="url(#neon)">KAY<tspan fill="#ff163c">DARAP</tspan></text>
  <rect x="300" y="440" width="600" height="3" fill="url(#line)"/>
  <text x="600" y="505" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="32" letter-spacing="6" fill="#b8b8c4">CALL OF DUTY: MOBILE · COMMUNITY</text>
  <text x="600" y="555" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="26" letter-spacing="4" fill="#ff163c">ANDROID · iOS · CHAMPION RULES</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(out('og.png'));
console.log('images written to public/');
