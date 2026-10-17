import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Builds the demo SPA into site/ (Storybook is added under site/storybook). */
export default defineConfig({
  root: resolve(import.meta.dirname, 'demo'),
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'metro-glass/styles.css', replacement: resolve(import.meta.dirname, 'src/styles/index.css') },
      { find: /^metro-glass$/, replacement: resolve(import.meta.dirname, 'src/index.ts') },
    ],
  },
  build: {
    outDir: resolve(import.meta.dirname, 'site'),
    emptyOutDir: true,
    cssTarget: ['chrome123', 'edge123', 'firefox128', 'safari18'],
  },
});
