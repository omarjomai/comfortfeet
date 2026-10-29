import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages serves the site under /comfortfeet/
  base: process.env.PAGES_BASE ?? '/',
  plugins: [react()],
  test: { environment: 'node' },
});
