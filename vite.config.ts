import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'node18',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CffTools',
      fileName: (format) => {
        if (format === 'es') return 'index.js';
        if (format === 'cjs') return 'index.cjs';
        return `index.${format}.js`;
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['aws-sdk', 'node:fs', /^node:/],
      output: {
        globals: {
          'aws-sdk': 'AWS',
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
  test: {
    globals: true,
    environment: 'node',
  },
});
