// Component that takes a Concert object and returns a DOM element with
// the concert card, ready to insert with appendChild. Builds the skeleton
// once as a <template> (fixed markup we wrote ourselves — not data), and
// each call just clones that template and fills in the dynamic parts with
// textContent/append, which the browser never interprets as HTML. That
// way escaping no longer depends on someone remembering to call it by
// hand (previously: escapeHtml()).
import { type ConcertModel } from '@/models';
import { getConcertDateParts } from '@/lib/concertDate';
import { requireElement } from '@/lib/dom';
import { icon } from '../icons';
import { createStatusBadgeElement, getStatusModifier } from './StatusBadge';

const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
    <article class="concert-card">
        <div class="concert-card__date">
            <span class="concert-card__day"></span>
            <span class="concert-card__month"></span>
            <span class="concert-card__year"></span>
        </div>
        <div class="concert-card__body">
            <h3 class="concert-card__title"></h3>
            <p class="concert-card__band"></p>
            <div class="concert-card__meta">
                <span class="concert-card__location"></span>
                <span class="concert-card__time"></span>
            </div>
        </div>
    </article>
`;

export function createConcertCardElement(concert: ConcertModel): HTMLElement {
    const card = TEMPLATE.content.firstElementChild!.cloneNode(true) as HTMLElement;
    card.classList.add(`concert-card--${getStatusModifier(concert.status)}`);

    const { day, month, year, isCurrentYear } = getConcertDateParts(concert.date);

    requireElement(card, '.concert-card__day').textContent = String(day);
    requireElement(card, '.concert-card__month').textContent = month;
    // The year is only shown for concerts that aren't in the current year.
    requireElement(card, '.concert-card__year').textContent = isCurrentYear ? '' : String(year);

    requireElement(card, '.concert-card__body').prepend(createStatusBadgeElement(concert.status));
    requireElement(card, '.concert-card__title').textContent = concert.title;
    requireElement(card, '.concert-card__band').textContent = concert.band;

    requireElement(card, '.concert-card__location').append(icon('map-pin'), ` ${concert.location}`);

    const timeEl = requireElement<HTMLElement>(card, '.concert-card__time');
    if (concert.time) {
        timeEl.append(icon('clock'), ` ${concert.time}`);
    } else {
        timeEl.remove();
    }

    return card;
}
