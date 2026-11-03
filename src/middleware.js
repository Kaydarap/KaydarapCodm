// Nanato section (/{lang}/nanato/…): same pages as the main site, rebranded at
// build time — Nanato name instead of KAYDARAP, and the Nanato colour theme.
// The main site's pages pass through untouched.
import { defineMiddleware } from 'astro:middleware';
import { recolor, NANATO_CSS } from './lib/nanato-theme.js';

const NANATO = /^\/[a-z]{2}\/nanato\//;

export const onRequest = defineMiddleware(async (ctx, next) => {
  const res = await next();
  if (!NANATO.test(ctx.url.pathname) || !(res.headers.get('content-type') || '').includes('text/html')) return res;
  let html = await res.text();
  html = html
    .replace(/<style([^>]*)>([\s\S]*?)<\/style>/g, (_, attrs, css) => `<style${attrs}>${recolor(css)}</style>`)
    .replace('</head>', `<style>${NANATO_CSS}</style></head>`)
    // brand name in visible text and metadata (URLs are lowercase and untouched)
    .replace(/KAYDARAP/g, 'Nanato')
    .replace(/<meta name="theme-color" content="[^"]*"/, '<meta name="theme-color" content="#0c0306"');
  return new Response(html, { status: res.status, headers: res.headers });
});
