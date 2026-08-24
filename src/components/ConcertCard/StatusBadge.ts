// Atom: the concert's status badge (Upcoming/Live/Finished/Canceled).
// Extracted from ConcertCard because it's a reusable piece in its own
// right — e.g. if a compact listing (ConcertGrid) shows up later that
// only needs the badge without the rest of the card.
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

export function createStatusBadgeElement(status: ConcertStatus): HTMLElement {
    const badge = document.createElement('span');
    badge.className = `concert-card__status concert-card__status--${getStatusModifier(status)}`;
    badge.textContent = STATUS_LABELS[status];
    return badge;
}
