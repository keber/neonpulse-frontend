# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). El proyecto
todavía no tiene releases (`package.json` sigue en `0.0.0`), así que por ahora todo vive
bajo [Unreleased]; en cuanto se corte la primera versión, esta sección pasa a ser `[0.1.0]`
con su fecha y se abre una `[Unreleased]` nueva encima.

## [Unreleased]

### Added

- `src/api/concert.api.ts`: `fetchConcertsPayload()` — capa de transporte, hace `fetch` a
  `public/data/concerts.json` (simulando lo que vendría de un backend real) y valida el
  contrato de cada registro en runtime (`isConcertDto`, _type predicate_ + `.every()`
  fail-fast) — reemplaza la confianza ciega en un `as` de compilación sobre
  `response.json()`.
- `src/services/concert.service.ts`: `getConcerts()` — capa de negocio, pide el payload a
  la API y convierte cada `date` de string a `Date`.
- `src/views/catalog.view.ts`: `renderCatalogView()` — arma el shell de la página y pinta
  el destacado y el catálogo a partir de `getConcerts()`.
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

- `main.ts` pasa a ser bootstrap puro (busca `#app`, delega a `renderCatalogView`, maneja
  el error global); la composición de la página se movió a `src/views/catalog.view.ts`,
  y la carga de datos a `src/api/` + `src/services/` en vez de un import estático de
  mocks. El `try/catch` de nivel superior (top-level `await`) cubre toda esa cadena: si
  el fetch falla, responde no-ok, o el dato no cumple el contrato, se muestra
  `ErrorFallback`.
- `src/mocks/concerts.mocks.ts` deja de ser la fuente de datos de la app y queda como
  fixture exclusivo de la suite de tests (`main.test.ts` mockea `global.fetch` en vez
  del módulo de mocks).
- El catálogo se ordena por fecha ascendente sin mutar el array original
  (`Array.prototype.toSorted`).
- El renderizado de `ConcertCard` pasó de construir HTML como string a clonar un
  `<template>` propio y rellenar los nodos con `textContent`/`append`, cerrando cualquier
  vía de inyección de HTML.
- Los estilos se migraron de CSS a mano a utilidades de Tailwind CSS v4 (`@apply`) sobre
  tokens de diseño compartidos.

### Fixed

- `concerts.mocks.ts` había quedado sin ningún export activo (el array comentado por
  completo), lo que rompía el `import` estático de `main.ts` con un `SyntaxError` de
  módulo no recuperable por ningún `try/catch` (el linking de ES modules falla antes
  de ejecutar el cuerpo de cualquier módulo del grafo). Se resolvió reemplazando esa
  fuente por la carga vía `fetch` (`concert.api.ts` + `concert.service.ts`) en vez de
  restaurar el import estático a los mocks.
- Las fechas del badge de la tarjeta se leen con los métodos `getUTC*()` de `Date` en vez
  de los locales: `new Date('YYYY-MM-DD')` se interpreta como medianoche UTC, y leerla en
  hora local podía mostrar el día anterior según el huso horario del navegador.

[Unreleased]: https://github.com/keber/neonpulse-frontend/commits/main
