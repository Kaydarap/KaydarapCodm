import { LANGS } from '../i18n/ui.js';

const SITE = 'https://www.kaydarap.com';
const PAGES = ['', 'rules/', 'rules/android/', 'rules/ios/', 'rooms/', 'faq/', 'settings/'];

export function GET() {
  const urls = PAGES.flatMap((p) =>
    LANGS.map((lang) => {
      const alts = LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE}/${l}/${p}"/>`).join('');
      return `<url><loc>${SITE}/${lang}/${p}</loc>${alts}</url>`;
    }),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
<url><loc>${SITE}/</loc></url>
${urls.join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
