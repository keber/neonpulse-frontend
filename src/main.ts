import './style.css';

import { renderCatalogView } from '@/views/catalog.view';
import { createErrorFallbackElement } from '@/components/ErrorFallback';
import { ConcertsFetchError } from '@/api/errors';

// Shown when the catalog couldn't be fetched or validated (backend down,
// non-ok response, unexpected payload shape) — a known failure mode, as
// opposed to a bug elsewhere in the render pipeline.
const CONCERTS_FETCH_ERROR_CONTENT = {
    title: 'No pudimos cargar la cartelera',
    message: 'Hubo un problema para conectar con el servidor. Probá recargar en unos minutos.',
};

async function main(): Promise<void> {
    const appContainer = document.getElementById('app');

    if (!appContainer) return;

    try {
        await renderCatalogView(appContainer);
    } catch (error) {
        // Safety net: any error during render (fetch failing or responding
        // non-ok, malformed data, a component that throws, etc.) replaces
        // the whole app with a fallback instead of leaving it half-rendered.
        // Known fetch/validation failures get a more specific message;
        // anything else falls back to the generic "something went wrong".
        console.error('[NeonPulse] Error inesperado al renderizar la app:', error);
        const content =
            error instanceof ConcertsFetchError ? CONCERTS_FETCH_ERROR_CONTENT : undefined;
        appContainer.replaceChildren(createErrorFallbackElement(content));
    } finally {
        // until removed here: renderCatalogView() and the above catch block
        // replaces #app 's innerHTML (see static skeleton in catalog.view.ts)
        // but aria-busy, which stays in the element.
        appContainer.removeAttribute('aria-busy');
    }
}

await main();
