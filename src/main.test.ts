import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type ConcertModel } from '@/models';

function jsonResponse(body: unknown, init: { ok?: boolean; status?: number } = {}): Response {
    return {
        ok: init.ok ?? true,
        status: init.status ?? 200,
        json: async () => body,
    } as Response;
}

function toRawConcert(concert: ConcertModel) {
    return { ...concert, date: concert.date.toISOString().slice(0, 10) };
}

describe('main', () => {
    beforeEach(() => {
        vi.resetModules();
        // aria-busy="true" replica el esqueleto estático de index.html: así
        // los tests cubren que main() lo quita al terminar, con o sin error.
        document.body.innerHTML = '<main id="app" aria-busy="true"></main>';
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals(); // clears the fetch stub between tests
        vi.doUnmock('./components/ConcertCard');
        document.body.innerHTML = '';
    });

    it('renderiza el destacado, los títulos de sección y una tarjeta por cada concierto del catálogo', async () => {
        const { concertsLists } = await import('./mocks/concerts.mocks');
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(jsonResponse(concertsLists.map(toRawConcert))),
        );
        await import('./main');

        const app = document.getElementById('app');

        expect(app?.querySelector('#featured-banner .featured-banner')).not.toBeNull();
        expect(
            Array.from(app?.querySelectorAll('.section-heading') ?? []).map((el) => el.textContent),
        ).toEqual(['Destacados', 'Revisa el catálogo de conciertos', 'Formulario de reserva']);
        expect(app?.querySelectorAll('.concert-card').length).toBe(concertsLists.length);
        // El esqueleto de carga (aria-busy="true" en index.html) se apaga
        // apenas termina el render.
        expect(app?.hasAttribute('aria-busy')).toBe(false);
    });

    it('ordena las tarjetas por fecha ascendente sin mutar el array original de conciertos', async () => {
        const { concertsLists } = await import('./mocks/concerts.mocks');
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(jsonResponse(concertsLists.map(toRawConcert))),
        );
        const originalOrder = concertsLists.map((concert) => concert.id);

        await import('./main');

        const renderedTitles = Array.from(document.querySelectorAll('.concert-card__title')).map(
            (el) => el.textContent,
        );
        const expectedTitles = concertsLists
            .toSorted((a, b) => a.date.getTime() - b.date.getTime())
            .map((concert) => concert.title);

        expect(renderedTitles).toEqual(expectedTitles);
        // Regression: sorting must not mutate the array exported by the mocks module.
        expect(concertsLists.map((concert) => concert.id)).toEqual(originalOrder);
    });

    it('no lanza error si la página no tiene un contenedor #app', async () => {
        document.body.innerHTML = '';

        await expect(import('./main')).resolves.not.toBeUndefined();
    });

    it('muestra el mensaje de catálogo vacío cuando no hay conciertos', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse([])));

        await import('./main');

        const app = document.getElementById('app');
        expect(app?.querySelector('.catalog-empty')?.textContent).toBe(
            'No hay conciertos programados por el momento. ¡Vuelve pronto!',
        );
        expect(app?.querySelectorAll('.concert-card').length).toBe(0);
        // With no concerts there's also nothing to feature: the banner falls
        // back to its generic variant and warns via console (FeaturedBanner's
        // own behavior).
        expect(app?.querySelector('.featured-banner--generic')).not.toBeNull();
        expect(console.error).toHaveBeenCalled();
    });

    it('muestra el fallback global de error si el render falla inesperadamente', async () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        const { concertsLists } = await import('./mocks/concerts.mocks');
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(jsonResponse(concertsLists.map(toRawConcert))),
        );
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
        // El esqueleto de carga se apaga también cuando el render termina en error.
        expect(app?.hasAttribute('aria-busy')).toBe(false);
    });

    it('muestra el fallback de error cuando el fetch de conciertos falla', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(jsonResponse(null, { ok: false, status: 500 })),
        );

        await import('./main');

        const app = document.getElementById('app');
        expect(app?.querySelector('.error-fallback')).not.toBeNull();
    });
});
