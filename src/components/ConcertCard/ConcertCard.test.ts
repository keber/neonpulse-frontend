import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type ConcertModel, ConcertStatus } from '@/models';
import { generateConcertCardHTML } from './ConcertCard';

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

describe('generateConcertCardHTML', () => {
    beforeEach(() => {
        // Fija el "hoy" del sistema para que la lógica de "mostrar año solo si
        // es distinto al actual" sea determinista en las pruebas.
        vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('incluye el título, la banda y la ubicación del concierto', () => {
        const html = generateConcertCardHTML(buildConcert());

        expect(html).toContain('Latinomerican Tour 2026');
        expect(html).toContain('The Rolling Stones');
        expect(html).toContain('Estadio Nacional');
    });

    it('lee el día y el mes en UTC para no correrse un día según el huso horario local', () => {
        // Regresión: new Date('2026-08-22') es medianoche UTC; usar
        // getDate()/getMonth() (hora local) podía mostrar el 21 de agosto
        // en husos horarios detrás de UTC.
        const html = generateConcertCardHTML(
            buildConcert({ date: new Date('2026-08-22') }),
        );

        expect(html).toContain('<span class="concert-card__day">22</span>');
        expect(html).toContain('<span class="concert-card__month">AGO</span>');
    });

    it('no muestra el año cuando el concierto es del año actual', () => {
        const html = generateConcertCardHTML(
            buildConcert({ date: new Date('2026-06-15') }),
        );

        expect(html).toContain('<span class="concert-card__year"></span>');
        expect(html).not.toContain('>2026<');
    });

    it('muestra el año cuando el concierto es de un año distinto al actual', () => {
        const html = generateConcertCardHTML(
            buildConcert({ date: new Date('2025-11-02') }),
        );

        expect(html).toContain('<span class="concert-card__year">2025</span>');
    });

    it('renderiza la hora solo cuando el concierto la especifica', () => {
        const withTime = generateConcertCardHTML(buildConcert({ time: '21:30' }));
        const withoutTime = generateConcertCardHTML(buildConcert({ time: undefined }));

        expect(withTime).toContain('concert-card__time');
        expect(withTime).toContain('21:30');
        expect(withoutTime).not.toContain('concert-card__time');
    });

    it.each([
        [ConcertStatus.SCHEDULED, 'scheduled', 'Próximo'],
        [ConcertStatus.LIVE, 'live', 'En vivo'],
        [ConcertStatus.FINISHED, 'finished', 'Finalizado'],
        [ConcertStatus.CANCELED, 'canceled', 'Cancelado'],
    ])('mapea el estado %s a la clase --%s y la etiqueta "%s"', (status, modifier, label) => {
        const html = generateConcertCardHTML(buildConcert({ status }));

        expect(html).toContain(`concert-card concert-card--${modifier}`);
        expect(html).toContain(`concert-card__status concert-card__status--${modifier}`);
        expect(html).toContain(`>${label}</span>`);
    });
});
