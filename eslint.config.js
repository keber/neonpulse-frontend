// Flat ESLint config (v9+). Covers only TypeScript because all of the
// project's source code lives in src/**/*.ts — no JSX or standalone JS.
// eslint-config-prettier goes last to turn off style rules that would
// conflict with Prettier (formatting is fully delegated to `npm run format`).
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
    {
        rules: {
            // The project already uses the "!" non-null assertion operator
            // deliberately (see ConcertCard.ts) for elements we know exist
            // because we just cloned them from our own <template>.
            '@typescript-eslint/no-non-null-assertion': 'off',
        },
    },
);
