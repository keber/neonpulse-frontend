import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type ConcertModel, ConcertStatus } from '@/models';
import { createConcertCardElement } from './ConcertCard';

function buildConcert(overrides: Partial<ConcertModel> = {}): ConcertModel {
    return {
        id: '1',
        title: 'Latinomerican Tour 2026',
        band: 'The Rolling Stones',
        date: new Date('2026-06-15'),
        time: '20:00',
        location: 'Estadio Nacional',
        status: ConcertStatus.SCHEDULED,
        ...overrides,
    };
}

describe('createConcertCardElement', () => {
    beforeEach(() => {
        // Fija el "hoy" del sistema para que la lógica de "mostrar año solo si
        // es distinto al actual" sea determinista en las pruebas.
        vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('incluye el título, la banda y la ubicación del concierto', () => {
        const card = createConcertCardElement(buildConcert());

        expect(card.querySelector('.concert-card__title')?.textContent).toBe(
            'Latinomerican Tour 2026',
        );
        expect(card.querySelector('.concert-card__band')?.textContent).toBe(
            'The Rolling Stones',
        );
        expect(card.querySelector('.concert-card__location')?.textContent?.trim()).toBe(
            'Estadio Nacional',
        );
    });

    it('nunca interpreta el texto del concierto como HTML (usa textContent, no innerHTML)', () => {
        const card = createConcertCardElement(
            buildConcert({ title: '<img src=x onerror=alert(1)>' }),
        );

        expect(card.querySelector('.concert-card__title img')).toBeNull();
        expect(card.querySelector('.concert-card__title')?.textContent).toBe(
            '<img src=x onerror=alert(1)>',
        );
    });

    it('lee el día y el mes en UTC para no correrse un día según el huso horario local', () => {
        // Regresión: new Date('2026-08-22') es medianoche UTC; usar
        // getDate()/getMonth() (hora local) podía mostrar el 21 de agosto
        // en husos horarios detrás de UTC.
        const card = createConcertCardElement(
            buildConcert({ date: new Date('2026-08-22') }),
        );

        expect(card.querySelector('.concert-card__day')?.textContent).toBe('22');
        expect(card.querySelector('.concert-card__month')?.textContent).toBe('AGO');
    });

    it('no muestra el año cuando el concierto es del año actual', () => {
        const card = createConcertCardElement(
            buildConcert({ date: new Date('2026-06-15') }),
        );

        expect(card.querySelector('.concert-card__year')?.textContent).toBe('');
    });

    it('muestra el año cuando el concierto es de un año distinto al actual', () => {
        const card = createConcertCardElement(
            buildConcert({ date: new Date('2025-11-02') }),
        );

        expect(card.querySelector('.concert-card__year')?.textContent).toBe('2025');
    });

    it('renderiza la hora solo cuando el concierto la especifica', () => {
        const withTime = createConcertCardElement(buildConcert({ time: '21:30' }));
        const withoutTime = createConcertCardElement(buildConcert({ time: undefined }));

        expect(withTime.querySelector('.concert-card__time')?.textContent?.trim()).toBe('21:30');
        expect(withoutTime.querySelector('.concert-card__time')).toBeNull();
    });

    it.each([
        [ConcertStatus.SCHEDULED, 'scheduled', 'Próximo'],
        [ConcertStatus.LIVE, 'live', 'En vivo'],
        [ConcertStatus.FINISHED, 'finished', 'Finalizado'],
        [ConcertStatus.CANCELED, 'canceled', 'Cancelado'],
    ])('mapea el estado %s a la clase --%s y la etiqueta "%s"', (status, modifier, label) => {
        const card = createConcertCardElement(buildConcert({ status }));

        expect(card.classList.contains(`concert-card--${modifier}`)).toBe(true);
        expect(card.querySelector(`.concert-card__status--${modifier}`)?.textContent).toBe(label);
    });

    it('cada llamada devuelve un elemento nuevo (clonado), no una referencia compartida', () => {
        const concert = buildConcert();

        expect(createConcertCardElement(concert)).not.toBe(createConcertCardElement(concert));
    });
});
