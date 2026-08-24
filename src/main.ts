import './style.css';

import { type ConcertModel } from '@/models';
import { fetchConcerts } from '@/lib/concertsApi';
import { createConcertCardElement } from './components/ConcertCard';
import { createFeaturedBannerElement } from './components/FeaturedBanner';
import { createErrorFallbackElement } from './components/ErrorFallback';

const CATALOG_EMPTY_MESSAGE = 'No hay conciertos programados por el momento. ¡Vuelve pronto!';

const appContainer = document.getElementById('app');

if (appContainer) {
    try {
        await renderApp(appContainer);
    } catch (error) {
        // Red de seguridad: cualquier error inesperado durante el render
        // (fetch que falla o responde no-ok, dato con forma inválida, un
        // componente que lanza, etc.) reemplaza toda la app por un fallback
        // genérico en vez de dejarla a medio renderizar.
        console.error('[NeonPulse] Error inesperado al renderizar la app:', error);
        appContainer.replaceChildren(createErrorFallbackElement());
    }
}

async function renderApp(appContainer: HTMLElement): Promise<void> {
    /*
    Componente átomo: ConcertCard, StatusBadge
    Componente molécula: FeaturedBanner
    Componente organismo: ConcertCatalog
    Componente sistema: App
     */
    // Trae el catálogo con fetchConcerts() (src/lib/concertsApi.ts): lanza
    // si la respuesta no es ok o algún registro no cumple el contrato
    // esperado, lo que el try/catch de arriba resuelve con el fallback.
    const concertsLists = await fetchConcerts();

    appContainer.innerHTML = `
        <section class="featured-banner-section" aria-labelledby="featured-banner-heading">
            <h2 id="featured-banner-heading" class="section-heading">Destacados</h2>
            <div id="featured-banner"></div>
        </section>

        <section class="catalog-section" aria-labelledby="catalog-heading">
            <h2 id="catalog-heading" class="section-heading">Revisa el catálogo de conciertos</h2>
            <div id="catalog-container"></div>
        </section>
        `;

    const featuredContainer = appContainer.querySelector<HTMLElement>('#featured-banner')!;
    featuredContainer.appendChild(createFeaturedBannerElement(concertsLists));

    const catalogContainer = appContainer.querySelector<HTMLElement>('#catalog-container')!;
    renderCatalog(catalogContainer, concertsLists);
}

function renderCatalog(container: HTMLElement, concerts: ConcertModel[]): void {
    if (concerts.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'catalog-empty';
        empty.textContent = CATALOG_EMPTY_MESSAGE;
        container.appendChild(empty);
        return;
    }

    concerts
        .toSorted((a, b) => a.date.getTime() - b.date.getTime())
        .forEach((concert) => container.appendChild(createConcertCardElement(concert)));
}
