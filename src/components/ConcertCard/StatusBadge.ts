// Átomo: la etiqueta de estado del concierto (Próximo/En vivo/Finalizado/
// Cancelado). Se extrae de ConcertCard porque es una pieza reusable en sí
// misma — p. ej. si más adelante aparece un listado compacto (ConcertGrid)
// que solo necesita el badge sin el resto de la tarjeta.
import { ConcertStatus } from '@/models';

const STATUS_LABELS: Record<ConcertStatus, string> = {
    [ConcertStatus.SCHEDULED]: 'Próximo',
    [ConcertStatus.LIVE]: 'En vivo',
    [ConcertStatus.FINISHED]: 'Finalizado',
    [ConcertStatus.CANCELED]: 'Cancelado',
};

export function getStatusModifier(status: ConcertStatus): string {
    return status.toLowerCase();
}

export function generateStatusBadgeHTML(status: ConcertStatus): string {
    const modifier = getStatusModifier(status);
    const label = STATUS_LABELS[status];

    return `<span class="concert-card__status concert-card__status--${modifier}">${label}</span>`;
}
