import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  test: {
    environment: 'jsdom',
    globals: false,
    coverage: {
      // Measure only the library code. By default vitest scans every
      // file in the project (`**/*`) and reports on config files
      // (svelte.config.js, vite.config.js, ...) and the browser demo
      // entry (demo/main.js), all of which are not unit-testable and
      // were dragging the report down to 70% with phantom 0% rows.
      include: ['src/**'],
      // Keep the standard exclusions; explicit for clarity.
      exclude: [
        'node_modules',
        'dist',
        'coverage',
        '**/*.config.js',
        '**/*.config.cjs',
        '.tmp_*',
      ],
    },
  },
})
