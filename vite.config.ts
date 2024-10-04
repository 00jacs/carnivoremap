import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    noExternal: ['@googlemaps/js-api-loader']
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
