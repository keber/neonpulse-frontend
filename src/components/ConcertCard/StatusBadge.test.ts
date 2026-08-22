import { describe, expect, it } from 'vitest';
import { ConcertStatus } from '@/models';
import { generateStatusBadgeHTML, getStatusModifier } from './StatusBadge';

describe('getStatusModifier', () => {
    it.each([
        [ConcertStatus.SCHEDULED, 'scheduled'],
        [ConcertStatus.LIVE, 'live'],
        [ConcertStatus.FINISHED, 'finished'],
        [ConcertStatus.CANCELED, 'canceled'],
    ])('convierte %s a %s', (status, modifier) => {
        expect(getStatusModifier(status)).toBe(modifier);
    });
});

describe('generateStatusBadgeHTML', () => {
    it.each([
        [ConcertStatus.SCHEDULED, 'scheduled', 'Próximo'],
        [ConcertStatus.LIVE, 'live', 'En vivo'],
        [ConcertStatus.FINISHED, 'finished', 'Finalizado'],
        [ConcertStatus.CANCELED, 'canceled', 'Cancelado'],
    ])('mapea el estado %s a la clase --%s y la etiqueta "%s"', (status, modifier, label) => {
        const html = generateStatusBadgeHTML(status);

        expect(html).toBe(
            `<span class="concert-card__status concert-card__status--${modifier}">${label}</span>`,
        );
    });
});
