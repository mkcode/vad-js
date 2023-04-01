import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: false,
    format: 'esm'
  },
  {
    entry: { worklet: 'src/worklet.ts' },
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: false,
    format: 'iife'
  }
])
