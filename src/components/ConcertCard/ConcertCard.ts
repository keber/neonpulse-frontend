// Componente HTML que recibe un objeto de tipo Concert y renderiza una tarjeta con la información del concierto.
import { type ConcertModel, ConcertStatus } from '../../models';

const STATUS_LABELS: Record<ConcertStatus, string> = {
    [ConcertStatus.SCHEDULED]: 'Próximo',
    [ConcertStatus.LIVE]: 'En vivo',
    [ConcertStatus.FINISHED]: 'Finalizado',
    [ConcertStatus.CANCELED]: 'Cancelado',
};

function getStatusModifier(status: ConcertStatus): string {
    return status.toLowerCase();
}

export function generateConcertCardHTML(concert: ConcertModel): string {
    const statusModifier = getStatusModifier(concert.status);
    const statusLabel = STATUS_LABELS[concert.status];
    const dateLabel = concert.time
        ? `${concert.date.toDateString()} · ${concert.time}`
        : concert.date.toDateString();

    return `
        <article class="concert-card concert-card--${statusModifier}">
            <span class="concert-card__status concert-card__status--${statusModifier}">${statusLabel}</span>
            <h3 class="concert-card__title">${concert.title}</h3>
            <p class="concert-card__band">${concert.band}</p>
            <div class="concert-card__meta">
                <span class="concert-card__date">📅 ${dateLabel}</span>
                <span class="concert-card__location">📍 ${concert.location}</span>
            </div>
        </article>
    `;
}
