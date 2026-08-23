import { describe, expect, it } from 'vitest';
import { ConcertStatus } from '@/models';
import { createStatusBadgeElement, getStatusModifier } from './StatusBadge';

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

describe('createStatusBadgeElement', () => {
    it.each([
        [ConcertStatus.SCHEDULED, 'scheduled', 'Próximo'],
        [ConcertStatus.LIVE, 'live', 'En vivo'],
        [ConcertStatus.FINISHED, 'finished', 'Finalizado'],
        [ConcertStatus.CANCELED, 'canceled', 'Cancelado'],
    ])('mapea el estado %s a la clase --%s y la etiqueta "%s"', (status, modifier, label) => {
        const badge = createStatusBadgeElement(status);

        expect(badge.tagName.toLowerCase()).toBe('span');
        expect(badge.className).toBe(`concert-card__status concert-card__status--${modifier}`);
        expect(badge.textContent).toBe(label);
    });
});
