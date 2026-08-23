// Componente que decide y renderiza el concierto destacado del banner
// principal. Sigue el mismo enfoque que ConcertCard: <template> fijo
// clonado por llamada, datos volcados con textContent/append (nunca
// innerHTML con datos).
import { type ConcertModel, ConcertStatus } from '@/models';
import { getConcertDateParts } from '@/lib/concertDate';
import { icon } from '../icons';
import { createStatusBadgeElement } from '../ConcertCard/StatusBadge';

export interface FeaturedSelection {
    concert: ConcertModel | null;
    isFallback: boolean;
}

/**
 * Decide qué concierto mostrar en el banner de destacados:
 *
 * 1. Preferencia: conciertos marcados `featured: true` por el equipo de
 *    contenido (decisión editorial, no derivada del `status`). Si hay más
 *    de uno, se muestra el más próximo por fecha — todavía no hay carrusel.
 * 2. Si no hay ningún destacado editorial, fallback: el concierto no
 *    cancelado más cercano a hoy. Se avisa por consola porque implica que
 *    el catálogo quedó sin destacados y alguien debería revisarlo.
 * 3. Si tampoco hay ningún concierto disponible (todos cancelados o
 *    catálogo vacío), no hay nada que destacar — se avisa por consola y el
 *    render resuelve un banner genérico.
 */
export function selectFeaturedConcert(concerts: ConcertModel[]): FeaturedSelection {
    const featured = concerts
        .filter((concert) => concert.featured)
        .toSorted((a, b) => a.date.getTime() - b.date.getTime());

    if (featured.length > 0) {
        return { concert: featured[0], isFallback: false };
    }

    const nonCanceled = concerts.filter((concert) => concert.status !== ConcertStatus.CANCELED);

    if (nonCanceled.length === 0) {
        console.error(
            '[FeaturedBanner] No hay conciertos destacados ni conciertos disponibles para usar como fallback; se muestra un banner genérico.',
        );
        return { concert: null, isFallback: true };
    }

    console.error(
        '[FeaturedBanner] No hay conciertos marcados como destacados; se usa el más próximo a hoy como fallback.',
    );

    const now = Date.now();
    const nearest = nonCanceled.reduce((closest, concert) =>
        Math.abs(concert.date.getTime() - now) < Math.abs(closest.date.getTime() - now)
            ? concert
            : closest,
    );

    return { concert: nearest, isFallback: true };
}

const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
    <article class="featured-banner">
        <div class="featured-banner__body">
            <span class="featured-banner__eyebrow">Destacado</span>
            <h3 class="featured-banner__title"></h3>
            <p class="featured-banner__band"></p>
            <div class="featured-banner__meta">
                <span class="featured-banner__date"></span>
                <span class="featured-banner__location"></span>
            </div>
        </div>
    </article>
`;

const GENERIC_TEMPLATE = document.createElement('template');
GENERIC_TEMPLATE.innerHTML = `
    <article class="featured-banner featured-banner--generic">
        <div class="featured-banner__body">
            <span class="featured-banner__eyebrow">Destacado</span>
            <h3 class="featured-banner__title">Muy pronto, nuevos conciertos</h3>
            <p class="featured-banner__band">Todavía no hay shows confirmados en la cartelera.</p>
        </div>
    </article>
`;

function renderGenericBanner(): HTMLElement {
    return GENERIC_TEMPLATE.content.firstElementChild!.cloneNode(true) as HTMLElement;
}

export function createFeaturedBannerElement(concerts: ConcertModel[]): HTMLElement {
    const { concert } = selectFeaturedConcert(concerts);

    if (!concert) {
        return renderGenericBanner();
    }

    const banner = TEMPLATE.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const body = banner.querySelector('.featured-banner__body')!;

    body.prepend(createStatusBadgeElement(concert.status));
    banner.querySelector('.featured-banner__title')!.textContent = concert.title;
    banner.querySelector('.featured-banner__band')!.textContent = concert.band;

    const { day, month, year, isCurrentYear } = getConcertDateParts(concert.date);
    const dateLabel = `${day} ${month}${isCurrentYear ? '' : ` ${year}`}${
        concert.time ? ` · ${concert.time}` : ''
    }`;
    banner.querySelector('.featured-banner__date')!.append(icon('calendar'), ` ${dateLabel}`);
    banner
        .querySelector('.featured-banner__location')!
        .append(icon('map-pin'), ` ${concert.location}`);

    return banner;
}
