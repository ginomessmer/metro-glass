/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    {
      // Ships the opt-in cross-document transition stylesheet as-is.
      name: 'metro-glass:navigation-css',
      apply: 'build',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'navigation.css',
          source: readFileSync(resolve(import.meta.dirname, 'src/styles/navigation.css'), 'utf8'),
        });
      },
    },
    dts({
      include: ['src'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.ts?(x)', 'src/test', 'src/stories'],
      entryRoot: 'src',
    }),
  ],
  build: {
    // Baseline for the modern CSS we rely on (light-dark(), relative colours,
    // @starting-style). Keeps lightningcss from down-levelling it.
    cssTarget: ['chrome123', 'edge123', 'firefox128', 'safari18'],
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      fileName: 'metro-glass',
      cssFileName: 'metro-glass',
      formats: ['es'],
    },
    cssCodeSplit: false,
    rolldownOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
    },
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
