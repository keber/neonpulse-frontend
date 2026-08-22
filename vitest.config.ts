import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

// Vitest no combina automáticamente vite.config.ts cuando existe un
// vitest.config.ts separado — hay que fusionarlos explícitamente para que
// los tests compartan el plugin de Tailwind (y el alias "@") con la app.
export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            include: ['src/**/*.test.ts'],
        },
    }),
);
