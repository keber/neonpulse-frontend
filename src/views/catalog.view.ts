import { type ConcertModel } from '@/models';
import { getConcerts } from '@/services/concert.service';
import { createConcertCardElement } from '@/components/ConcertCard';
import { createFeaturedBannerElement } from '@/components/FeaturedBanner';
import { renderBookingFormView } from '@/views/bookingform.view';

const CATALOG_EMPTY_MESSAGE = 'No hay conciertos programados por el momento. ¡Vuelve pronto!';

/*
Atom component: ConcertCard, StatusBadge
Molecule component: FeaturedBanner
Organism component: ConcertCatalog
View component: CatalogView
 */

interface CatalogSections {
    featuredContainer: HTMLElement;
    catalogContainer: HTMLElement;
    bookingFormContainer: HTMLElement;
}

// Builds the view's static skeleton (fixed markup we wrote ourselves —
// never data) and returns references to where the dynamic sections get
// inserted. This is the only function that touches innerHTML.
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
        
        <section class="booking-form-section" aria-labelledby="booking-form-heading">
            <h2 id="booking-form-heading" class="section-heading">Formulario de reserva</h2>
            <div id="booking-form-container"></div>
        </section>
        `;

    return {
        featuredContainer: container.querySelector<HTMLElement>('#featured-banner')!,
        catalogContainer: container.querySelector<HTMLElement>('#catalog-container')!,
        bookingFormContainer: container.querySelector<HTMLElement>('#booking-form-container')!,
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

// Loads the catalog with getConcerts() (src/services/concert.service.ts):
// throws if the fetch fails, the response isn't ok, or any record doesn't
// match the contract — whoever calls this view decides what to do about it.
export async function renderCatalogView(container: HTMLElement): Promise<void> {
    const concerts = await getConcerts();
    const { featuredContainer, catalogContainer, bookingFormContainer } = renderShell(container);

    renderFeatured(featuredContainer, concerts);
    renderCatalog(catalogContainer, concerts);
    //TODO: render Booking Form - concert o concerts?
    renderBookingFormView(bookingFormContainer);
}
