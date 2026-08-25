import './style.css';

import { renderCatalogView } from '@/views/catalog.view';
import { createErrorFallbackElement } from '@/components/ErrorFallback';

async function main(): Promise<void> {
    const appContainer = document.getElementById('app');

    if (!appContainer) return;

    try {
        await renderCatalogView(appContainer);
    } catch (error) {
        // Safety net: any unexpected error during render (fetch failing or
        // responding non-ok, malformed data, a component that throws, etc.)
        // replaces the whole app with a generic fallback instead of leaving
        // it half-rendered.
        console.error('[NeonPulse] Error inesperado al renderizar la app:', error);
        appContainer.replaceChildren(createErrorFallbackElement());
    } finally {
        // Se quita recién acá: renderCatalogView() y el catch de arriba
        // reemplazan el innerHTML de #app (ver el esqueleto estático en
        // index.html), pero aria-busy queda en el propio elemento y no se va
        // solo con ese reemplazo.
        appContainer.removeAttribute('aria-busy');
    }
}

await main();
