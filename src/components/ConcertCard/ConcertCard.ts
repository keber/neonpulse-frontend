// Componente que recibe un objeto de tipo Concert y devuelve un elemento
// del DOM con la tarjeta del concierto, lista para insertar con
// appendChild. Arma el esqueleto una sola vez como <template> (markup fijo,
// escrito por nosotros — no datos) y en cada llamada solo clona ese
// template y rellena las partes dinámicas con textContent/append, que el
// navegador nunca interpreta como HTML. Así el escapado ya no depende de
// que alguien se acuerde de llamarlo a mano (antes: escapeHtml()).
import { type ConcertModel } from '@/models';
import { icon } from '../icons';
import { createStatusBadgeElement, getStatusModifier } from './StatusBadge';

const MONTHS_ES = [
    'ENE',
    'FEB',
    'MAR',
    'ABR',
    'MAY',
    'JUN',
    'JUL',
    'AGO',
    'SEP',
    'OCT',
    'NOV',
    'DIC',
];

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

    // Se usan los métodos UTC porque las fechas se construyen a partir de
    // strings tipo "YYYY-MM-DD", que Date interpreta como medianoche UTC;
    // leerlas en hora local podía mostrar el día anterior según el huso horario.
    const day = concert.date.getUTCDate();
    const month = MONTHS_ES[concert.date.getUTCMonth()];
    const year = concert.date.getUTCFullYear();
    const currentYear = new Date().getUTCFullYear();

    card.querySelector('.concert-card__day')!.textContent = String(day);
    card.querySelector('.concert-card__month')!.textContent = month;
    // Se muestra el año solo para los conciertos que no son del año actual.
    card.querySelector('.concert-card__year')!.textContent =
        year !== currentYear ? String(year) : '';

    card.querySelector('.concert-card__body')!.prepend(createStatusBadgeElement(concert.status));
    card.querySelector('.concert-card__title')!.textContent = concert.title;
    card.querySelector('.concert-card__band')!.textContent = concert.band;

    card.querySelector('.concert-card__location')!.append(icon('map-pin'), ` ${concert.location}`);

    const timeEl = card.querySelector<HTMLElement>('.concert-card__time')!;
    if (concert.time) {
        timeEl.append(icon('clock'), ` ${concert.time}`);
    } else {
        timeEl.remove();
    }

    return card;
}
