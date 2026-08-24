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
    }
}

await main();
