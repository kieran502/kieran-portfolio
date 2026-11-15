// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // TODO: replace with the final public domain once chosen (brief §14).
  // Canonical URLs, Open Graph URLs, the sitemap and robots.txt all derive from this.
  site: 'https://example.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // Stub pages are excluded until they have real content (Milestone 3).
      filter: (page) => !/\/(resources|about)\/$/.test(page),
    }),
  ],
});
