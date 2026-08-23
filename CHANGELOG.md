# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). El proyecto
todavía no tiene releases (`package.json` sigue en `0.0.0`), así que por ahora todo vive
bajo [Unreleased]; en cuanto se corte la primera versión, esta sección pasa a ser `[0.1.0]`
con su fecha y se abre una `[Unreleased]` nueva encima.

## [Unreleased]

### Added

- Modelo de dominio (`ConcertModel`, `ConcertStatus`) y datos de ejemplo (`concerts.mocks.ts`).
- Componente `ConcertCard`: tarjeta de concierto estilo "ticket", con placa de fecha, badge
  de estado (`StatusBadge`) y soporte para hora y ubicación opcionales.
- Íconos de `lucide-static` envueltos como elementos `<svg>` reales (`src/components/icons`).
- Tema visual propio (`theme.css`) sobre Tailwind CSS v4, con la paleta neón compartida
  entre `style.css` y `ConcertCard.css`.
- Suite de tests con Vitest + jsdom cubriendo `ConcertCard`, `StatusBadge`, `concerts.mocks`
  y el punto de entrada `main.ts`.
- ESLint (flat config) y Prettier, con scripts `lint`, `lint:fix`, `format` y `format:check`.
- `README.md` con la documentación del proyecto.
- Alias de import `@/*` → `src/*`.

### Changed

- El catálogo se ordena por fecha ascendente sin mutar el array original
  (`Array.prototype.toSorted`).
- El renderizado de `ConcertCard` pasó de construir HTML como string a clonar un
  `<template>` propio y rellenar los nodos con `textContent`/`append`, cerrando cualquier
  vía de inyección de HTML.
- Los estilos se migraron de CSS a mano a utilidades de Tailwind CSS v4 (`@apply`) sobre
  tokens de diseño compartidos.

### Fixed

- Las fechas del badge de la tarjeta se leen con los métodos `getUTC*()` de `Date` en vez
  de los locales: `new Date('YYYY-MM-DD')` se interpreta como medianoche UTC, y leerla en
  hora local podía mostrar el día anterior según el huso horario del navegador.

[Unreleased]: https://github.com/keber/neonpulse-frontend/commits/main
