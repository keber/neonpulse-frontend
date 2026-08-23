// Config plana de ESLint (v9+). Cubre solo TypeScript porque todo el código
// fuente del proyecto vive en src/**/*.ts — no hay JSX ni JS suelto.
// eslint-config-prettier va al final para apagar las reglas de estilo que
// pisarían a Prettier (el formateo se delega por completo a `npm run format`).
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
            // El proyecto ya usa el operador "!" de aserción de no-nulidad de forma
            // deliberada (ver ConcertCard.ts) para elementos que sabemos que existen
            // porque acabamos de clonarlos desde nuestro propio <template>.
            '@typescript-eslint/no-non-null-assertion': 'off',
        },
    },
);
