// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://alhady101.github.io/pell-to-planet/
export default defineConfig({
  site: 'https://alhady101.github.io',
  base: '/pell-to-planet',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
});
