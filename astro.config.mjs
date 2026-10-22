import { defineConfig } from 'astro/config';

// Static build: every language/page is pre-rendered to its own folder
// (/fa/rules/android/index.html …) so direct loads work on GitHub Pages.
export default defineConfig({
  site: 'https://www.kaydarap.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  output: 'static',
});
