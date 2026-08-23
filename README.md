# NeonPulse

Cartelera de conciertos en vivo — proyecto personal para practicar Vite + TypeScript + DOM vanilla, sin frameworks de UI.

## Stack

- **[Vite](https://vitejs.dev/)** — dev server y build.
- **TypeScript** — modo `strict`, sin emitir (`noEmit`); el build real lo hace Vite.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — vía `@tailwindcss/vite`, con tokens de diseño propios en `src/theme.css`.
- **[Vitest](https://vitest.dev/)** + `jsdom` — tests unitarios.
- **[lucide-static](https://lucide.dev/)** — íconos SVG, insertados como elementos reales del DOM.
- **ESLint + Prettier** — lint y formato.

No hay ningún framework de componentes (React, Vue, etc.): cada "componente" es una función que devuelve un `HTMLElement` listo para `appendChild`.

## Requisitos

- Node.js 20+ (recomendado, acorde al target `es2023` de `tsconfig.json`).
- npm.

## Empezar

```bash
npm install
npm run dev
```

Abre la URL que imprime Vite (por defecto `http://localhost:5173`).

## Scripts

| Script                 | Qué hace                                                               |
| ---------------------- | ---------------------------------------------------------------------- |
| `npm run dev`          | Levanta el servidor de desarrollo con recarga en caliente.             |
| `npm run build`        | Type-checks (`tsc`) y genera el build de producción en `dist/`.        |
| `npm run preview`      | Sirve el build de `dist/` localmente, para probarlo antes de publicar. |
| `npm test`             | Corre toda la suite de Vitest una vez.                                 |
| `npm run test:watch`   | Corre Vitest en modo watch.                                            |
| `npm run lint`         | Revisa el código con ESLint.                                           |
| `npm run lint:fix`     | Igual que `lint`, pero aplica los arreglos automáticos posibles.       |
| `npm run format`       | Formatea todo el proyecto con Prettier.                                |
| `npm run format:check` | Verifica el formato sin modificar archivos (útil en CI).               |

## Estructura del proyecto

```
src/
├── components/
│   ├── ConcertCard/
│   │   ├── ConcertCard.ts   # arma la tarjeta completa (clona un <template>)
│   │   ├── StatusBadge.ts   # átomo: la etiqueta de estado (Próximo/En vivo/…)
│   │   ├── ConcertCard.css  # estilos del componente, con @apply de Tailwind
│   │   └── index.ts         # barrel público + import del CSS
│   └── icons/
│       ├── icon.ts          # envuelve lucide-static como elementos <svg>
│       └── index.ts
├── models/                  # tipos de dominio (ConcertModel, ConcertStatus)
├── mocks/                   # datos de ejemplo mientras no hay backend
├── style.css                # shell global de la página + Tailwind
├── theme.css                # tokens de diseño compartidos (paleta, fuente, animación)
└── main.ts                  # punto de entrada: arma el catálogo y lo monta en #app
```

Cada archivo `*.test.ts` vive junto al módulo que prueba (p. ej. `ConcertCard.test.ts` al lado de `ConcertCard.ts`).

### Alias de imports

`@/*` apunta a `src/*` (configurado en `tsconfig.json` y espejado en `vite.config.ts`/`vitest.config.ts`), para evitar cadenas de `../../` en los imports.

## Arquitectura

Los componentes siguen una idea de atomic design informal (ver el comentario en `main.ts`): átomo (`StatusBadge`, `icon`) → molécula (`ConcertCard`) → catálogo (`main.ts`). No hay virtual DOM ni reactividad: cada función de componente devuelve un `HTMLElement` real, construido clonando un `<template>` propio y rellenando las partes dinámicas con `textContent`/`append` — nunca con `innerHTML` sobre datos externos, para no abrir una vía de inyección de HTML.

Las fechas se leen siempre con los métodos `getUTC*()` de `Date`: como los mocks se construyen con strings `"YYYY-MM-DD"` (medianoche UTC), leerlos en hora local podía mostrar el día anterior según el huso horario del navegador.

## Tests

```bash
npm test
```

La suite cubre: renderizado de la tarjeta (texto, escapado, íconos condicionales), el mapeo de cada `ConcertStatus` a su clase/etiqueta, el ordenamiento del catálogo por fecha sin mutar el array original, y que cada tarjeta sea un nodo del DOM independiente (no una referencia compartida).

## Convenciones

- **Commits semánticos** ([Conventional Commits](https://www.conventionalcommits.org/)): `feat: …`, `fix: …`, `docs: …`, `refactor: …`, `test: …`, `chore: …`, `style: …`, `build: …`.
- Formato de código delegado a Prettier (comillas simples, punto y coma, indentación de 4 espacios, coma final) — no se discute a mano, se corre `npm run format`.
