import { defineConfig } from 'astro/config';

// Static build: every language/page is pre-rendered to its own folder
// (/fa/rules/android/index.html …) so direct loads work on GitHub Pages.
export default defineConfig({
  site: 'https://www.kaydarap.com',
  trailingSlash: 'always',
  // GitHub Pages lets browsers reuse a page for ~10 minutes, and every deploy
  // deletes the previous hashed assets. A reused page would then point at a
  // stylesheet that no longer exists and render unstyled. Inlining the CSS
  // and giving scripts stable names keeps old cached pages working.
  build: { format: 'directory', inlineStylesheets: 'always' },
  vite: {
    plugins: [{
      name: 'stable-client-script-names',
      config(_, env) {
        if (env.isSsrBuild) return;
        return { build: { rollupOptions: { output: { entryFileNames: '_astro/[name].js', chunkFileNames: '_astro/[name].js' } } } };
      },
    }],
  },
  output: 'static',
});
