// Componente HTML que recibe un objeto de tipo Concert y renderiza una tarjeta con la información del concierto.
import { type ConcertModel } from '@/models';
import { escapeHtml } from '@/utils/escapeHtml';
import { icon } from '../icons';
import { generateStatusBadgeHTML, getStatusModifier } from './StatusBadge';

const MONTHS_ES = [
    'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
    'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC',
];

export function generateConcertCardHTML(concert: ConcertModel): string {
    const statusModifier = getStatusModifier(concert.status);
    // Se usan los métodos UTC porque las fechas se construyen a partir de
    // strings tipo "YYYY-MM-DD", que Date interpreta como medianoche UTC;
    // leerlas en hora local podía mostrar el día anterior según el huso horario.
    const day = concert.date.getUTCDate();
    const month = MONTHS_ES[concert.date.getUTCMonth()];
    const year = concert.date.getUTCFullYear();

    return `
        <article class="concert-card concert-card--${statusModifier}">
            <div class="concert-card__date">
                <span class="concert-card__day">${day}</span>
                <span class="concert-card__month">${month}</span>
                <!-- se muestra el año para los conciertos que no son del año actual -->
                <span class="concert-card__year">${year!=new Date().getUTCFullYear() ? year : ''}</span>
            </div>
            <div class="concert-card__body">
                ${generateStatusBadgeHTML(concert.status)}
                <h3 class="concert-card__title">${escapeHtml(concert.title)}</h3>
                <p class="concert-card__band">${escapeHtml(concert.band)}</p>
                <div class="concert-card__meta">
                    <span class="concert-card__location">${icon('map-pin')} ${escapeHtml(concert.location)}</span>
                    ${concert.time ? `<span class="concert-card__time">${icon('clock')} ${escapeHtml(concert.time)}</span>` : ''}
                </div>
            </div>
        </article>
    `;
}
