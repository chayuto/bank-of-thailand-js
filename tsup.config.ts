import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    resolve: true,
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  target: 'es2022',
  platform: 'neutral',
  outDir: 'dist',
  esbuildOptions(options) {
    options.drop = ['debugger'];
    options.legalComments = 'none';
  },
});
