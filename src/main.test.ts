import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('main', () => {
    beforeEach(() => {
        vi.resetModules();
        document.body.innerHTML = '<main id="app"></main>';
    });

    afterEach(() => {
        vi.restoreAllMocks();
        // vi.resetModules() solo limpia la caché de módulos, no las fábricas
        // registradas con vi.doMock — sin este unmock, el mock de un test se
        // filtraba al siguiente (concertsLists seguía "vacío" en el test del
        // fallback de error, que dependía de tener conciertos reales).
        vi.doUnmock('./mocks/concerts.mocks');
        vi.doUnmock('./components/ConcertCard');
        document.body.innerHTML = '';
    });

    it('renderiza el destacado, los títulos de sección y una tarjeta por cada concierto del catálogo', async () => {
        const { concertsLists } = await import('./mocks/concerts.mocks');
        await import('./main');

        const app = document.getElementById('app');

        expect(app?.querySelector('#featured-banner .featured-banner')).not.toBeNull();
        expect(
            Array.from(app?.querySelectorAll('.section-heading') ?? []).map((el) => el.textContent),
        ).toEqual(['Destacados', 'Revisa el catálogo de conciertos']);
        expect(app?.querySelectorAll('.concert-card').length).toBe(concertsLists.length);
    });

    it('ordena las tarjetas por fecha ascendente sin mutar el array original de conciertos', async () => {
        const { concertsLists } = await import('./mocks/concerts.mocks');
        const originalOrder = concertsLists.map((concert) => concert.id);

        await import('./main');

        const renderedTitles = Array.from(document.querySelectorAll('.concert-card__title')).map(
            (el) => el.textContent,
        );
        const expectedTitles = concertsLists
            .toSorted((a, b) => a.date.getTime() - b.date.getTime())
            .map((concert) => concert.title);

        expect(renderedTitles).toEqual(expectedTitles);
        // Regresión: el ordenamiento no debe mutar el array exportado por el módulo de mocks.
        expect(concertsLists.map((concert) => concert.id)).toEqual(originalOrder);
    });

    it('no lanza error si la página no tiene un contenedor #app', async () => {
        document.body.innerHTML = '';

        await expect(import('./main')).resolves.not.toBeUndefined();
    });

    it('muestra el mensaje de catálogo vacío cuando no hay conciertos', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.doMock('./mocks/concerts.mocks', () => ({ concertsLists: [] }));

        await import('./main');

        const app = document.getElementById('app');
        expect(app?.querySelector('.catalog-empty')?.textContent).toBe(
            'No hay conciertos programados por el momento. ¡Vuelve pronto!',
        );
        expect(app?.querySelectorAll('.concert-card').length).toBe(0);
        // Sin conciertos tampoco hay nada para destacar: el banner cae a su
        // variante genérica y avisa por consola (comportamiento de FeaturedBanner).
        expect(app?.querySelector('.featured-banner--generic')).not.toBeNull();
        expect(console.error).toHaveBeenCalled();
    });

    it('muestra el fallback global de error si el render falla inesperadamente', async () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.doMock('./components/ConcertCard', () => ({
            createConcertCardElement: () => {
                throw new Error('boom');
            },
        }));

        await import('./main');

        const app = document.getElementById('app');
        expect(app?.querySelector('.error-fallback')).not.toBeNull();
        expect(app?.querySelector('.concert-card')).toBeNull();
        expect(consoleError).toHaveBeenCalledWith(
            '[NeonPulse] Error inesperado al renderizar la app:',
            expect.any(Error),
        );
    });
});
