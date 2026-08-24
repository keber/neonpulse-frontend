import { type ConcertModel } from '@/models';
import { getConcerts } from '@/services/concert.service';
import { createConcertCardElement } from '@/components/ConcertCard';
import { createFeaturedBannerElement } from '@/components/FeaturedBanner';

const CATALOG_EMPTY_MESSAGE = 'No hay conciertos programados por el momento. ¡Vuelve pronto!';

/*
Componente átomo: ConcertCard, StatusBadge
Componente molécula: FeaturedBanner
Componente organismo: ConcertCatalog
Componente vista: CatalogView
 */

interface CatalogSections {
    featuredContainer: HTMLElement;
    catalogContainer: HTMLElement;
}

// Arma el esqueleto estático de la vista (markup fijo, escrito por
// nosotros — nunca datos) y devuelve referencias a los puntos donde se
// insertan las secciones dinámicas. Es la única función que toca innerHTML.
function renderShell(container: HTMLElement): CatalogSections {
    container.innerHTML = `
        <section class="featured-banner-section" aria-labelledby="featured-banner-heading">
            <h2 id="featured-banner-heading" class="section-heading">Destacados</h2>
            <div id="featured-banner"></div>
        </section>

        <section class="catalog-section" aria-labelledby="catalog-heading">
            <h2 id="catalog-heading" class="section-heading">Revisa el catálogo de conciertos</h2>
            <div id="catalog-container"></div>
        </section>
        `;

    return {
        featuredContainer: container.querySelector<HTMLElement>('#featured-banner')!,
        catalogContainer: container.querySelector<HTMLElement>('#catalog-container')!,
    };
}

function renderFeatured(container: HTMLElement, concerts: ConcertModel[]): void {
    container.appendChild(createFeaturedBannerElement(concerts));
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

// Trae el catálogo con getConcerts() (src/services/concert.service.ts):
// lanza si el fetch falla, la respuesta no es ok, o algún registro no
// cumple el contrato — quien llame a esta vista decide qué hacer con eso.
export async function renderCatalogView(container: HTMLElement): Promise<void> {
    const concerts = await getConcerts();
    const { featuredContainer, catalogContainer } = renderShell(container);

    renderFeatured(featuredContainer, concerts);
    renderCatalog(catalogContainer, concerts);
}
