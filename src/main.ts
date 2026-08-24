import './style.css';

import { renderCatalogView } from '@/views/catalog.view';
import { createErrorFallbackElement } from '@/components/ErrorFallback';

async function main(): Promise<void> {
    const appContainer = document.getElementById('app');

    if (!appContainer) return;

    try {
        await renderCatalogView(appContainer);
    } catch (error) {
        // Red de seguridad: cualquier error inesperado durante el render
        // (fetch que falla o responde no-ok, dato con forma inválida, un
        // componente que lanza, etc.) reemplaza toda la app por un fallback
        // genérico en vez de dejarla a medio renderizar.
        console.error('[NeonPulse] Error inesperado al renderizar la app:', error);
        appContainer.replaceChildren(createErrorFallbackElement());
    }
}

await main();
