import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('main', () => {
    beforeEach(() => {
        vi.resetModules();
        document.body.innerHTML = '<div id="app"></div><div id="footer"></div>';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('renderiza el título y una tarjeta por cada concierto del catálogo', async () => {
        const { concertsLists } = await import('./mocks/concerts.mocks');
        await import('./main');

        const app = document.getElementById('app');

        expect(app?.querySelector('h1')?.textContent).toBe('NeonPulse');
        expect(app?.querySelectorAll('.concert-card').length).toBe(concertsLists.length);
    });

    it('ordena las tarjetas por fecha ascendente sin mutar el array original de conciertos', async () => {
        const { concertsLists } = await import('./mocks/concerts.mocks');
        const originalOrder = concertsLists.map((concert) => concert.id);

        await import('./main');

        const renderedTitles = Array.from(
            document.querySelectorAll('.concert-card__title'),
        ).map((el) => el.textContent);
        const expectedTitles = concertsLists
            .toSorted((a, b) => a.date.getTime() - b.date.getTime())
            .map((concert) => concert.title);

        expect(renderedTitles).toEqual(expectedTitles);
        // Regresión: el ordenamiento no debe mutar el array exportado por el módulo de mocks.
        expect(concertsLists.map((concert) => concert.id)).toEqual(originalOrder);
    });

    it('no lanza error si la página no tiene un contenedor #app', async () => {
        document.body.innerHTML = '<div id="footer"></div>';

        await expect(import('./main')).resolves.not.toBeUndefined();
    });
});
