// Componente HTML que recibe un objeto de tipo Concert y renderiza una tarjeta con la información del concierto.
import { type ConcertModel, ConcertStatus } from '../../models';

const STATUS_LABELS: Record<ConcertStatus, string> = {
    [ConcertStatus.SCHEDULED]: 'Próximo',
    [ConcertStatus.LIVE]: 'En vivo',
    [ConcertStatus.FINISHED]: 'Finalizado',
    [ConcertStatus.CANCELED]: 'Cancelado',
};

const MONTHS_ES = [
    'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
    'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC',
];

function getStatusModifier(status: ConcertStatus): string {
    return status.toLowerCase();
}

export function generateConcertCardHTML(concert: ConcertModel): string {
    const statusModifier = getStatusModifier(concert.status);
    const statusLabel = STATUS_LABELS[concert.status];
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
                <span class="concert-card__status concert-card__status--${statusModifier}">${statusLabel}</span>
                <h3 class="concert-card__title">${concert.title}</h3>
                <p class="concert-card__band">${concert.band}</p>
                <div class="concert-card__meta">
                    <span class="concert-card__location">📍 ${concert.location}</span>
                    ${concert.time ? `<span class="concert-card__time">🕗 ${concert.time}</span>` : ''}
                </div>
            </div>
        </article>
    `;
}
