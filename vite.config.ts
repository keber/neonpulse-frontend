import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    // GitHub Pages serves project sites from /<repository>/, while local
    // development continues to run from /. The workflow supplies this value.
    base: process.env.VITE_BASE_PATH ?? '/',
    plugins: [tailwindcss()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
