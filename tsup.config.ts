import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    vadNodeWorklet: 'src/worklet/index.ts',
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  format: ['esm', 'cjs'],
})
