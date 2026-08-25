// Component that decides and renders the main banner's featured concert.
// Follows the same approach as ConcertCard: a fixed <template> cloned per
// call, data poured in with textContent/append (never innerHTML with data).
import { type ConcertModel, ConcertStatus } from '@/models';
import { getConcertDateParts } from '@/lib/concertDate';
import { icon } from '../icons';
import { createStatusBadgeElement } from '../ConcertCard/StatusBadge';
import templateHtml from './FeaturedBanner_template.html?raw';
import templateHtmlGeneric from './FeaturedBannerGeneric_template.html?raw';

export interface FeaturedSelection {
    concert: ConcertModel | null;
    isFallback: boolean;
}

/**
 * Decides which concert to show in the featured banner:
 *
 * 1. Preference: concerts marked `featured: true` by the content team
 *    (an editorial decision, not derived from `status`). If there's more
 *    than one, the nearest by date is shown — no carousel yet.
 * 2. If there's no editorial pick, fallback: the nearest non-canceled
 *    concert to today. Logged to the console because it means the catalog
 *    was left without a featured pick and someone should look into it.
 * 3. If there's no concert available at all (everything canceled or an
 *    empty catalog), there's nothing to feature — logged to the console,
 *    and the render resolves to a generic banner.
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
TEMPLATE.innerHTML = templateHtml;

const GENERIC_TEMPLATE = document.createElement('template');
GENERIC_TEMPLATE.innerHTML = templateHtmlGeneric;

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
