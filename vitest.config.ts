import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

// Vitest doesn't automatically merge vite.config.ts when a separate
// vitest.config.ts exists — they have to be merged explicitly so tests
// share the Tailwind plugin (and the "@" alias) with the app.
export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            include: ['src/**/*.test.ts'],
        },
    }),
);
