import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import string from 'vite-plugin-string';
import ViteWorkerPlugin from 'worker-plugin';
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    string({
      include: '**/*.css',
    }),
      svelte({
    compilerOptions: {
      customElement: true,
    },
    preprocess: sveltePreprocess(),
  })]
})
