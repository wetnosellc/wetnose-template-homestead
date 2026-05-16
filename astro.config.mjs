import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://moroshepherds.com',
  integrations: [
    react(),
    sitemap(),
  ],
  server: {
    host: true,
    allowedHosts: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
