import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConcertStatus } from '@/models';
import { ConcertsFetchError } from './errors';
import { fetchConcertsPayload } from './concert.api';

function jsonResponse(body: unknown, init: { ok?: boolean; status?: number } = {}): Response {
    return {
        ok: init.ok ?? true,
        status: init.status ?? 200,
        json: async () => body,
    } as Response;
}

const validDto = {
    id: '1',
    title: 'Latinomerican Tour 2026',
    band: 'The Rolling Stones',
    date: '2026-06-15',
    time: '20:00',
    location: 'Estadio Nacional',
    status: ConcertStatus.SCHEDULED,
    featured: true,
};

describe('fetchConcertsPayload', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('devuelve el payload tal cual cuando la respuesta es válida', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse([validDto])));

        await expect(fetchConcertsPayload()).resolves.toEqual([validDto]);
    });

    it('lanza ConcertsFetchError con el HTTP status cuando la respuesta no es ok', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(jsonResponse(null, { ok: false, status: 404 })),
        );

        await expect(fetchConcertsPayload()).rejects.toMatchObject({
            name: 'ConcertsFetchError',
            message: 'No se pudo cargar el catálogo de conciertos (HTTP 404)',
        });
    });

    it('lanza ConcertsFetchError (con la causa original) si fetch() falla por red', async () => {
        const networkError = new TypeError('Failed to fetch');
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(networkError));

        const error: unknown = await fetchConcertsPayload().catch((e: unknown) => e);

        expect(error).toBeInstanceOf(ConcertsFetchError);
        expect((error as ConcertsFetchError).message).toBe(
            'No se pudo conectar con el servidor de conciertos',
        );
        expect((error as ConcertsFetchError).cause).toBe(networkError);
    });

    it('lanza ConcertsFetchError (con la causa original) si el body no es JSON válido', async () => {
        const parseError = new SyntaxError('Unexpected token');
        const response = jsonResponse(null);
        response.json = () => Promise.reject(parseError);
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

        const error: unknown = await fetchConcertsPayload().catch((e: unknown) => e);

        expect(error).toBeInstanceOf(ConcertsFetchError);
        expect((error as ConcertsFetchError).message).toBe(
            'La respuesta del catálogo de conciertos no es JSON válido',
        );
        expect((error as ConcertsFetchError).cause).toBe(parseError);
    });

    it('lanza ConcertsFetchError si el payload no es un array', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ not: 'an array' })));

        await expect(fetchConcertsPayload()).rejects.toMatchObject({
            name: 'ConcertsFetchError',
            message: 'La respuesta del catálogo de conciertos no es un array',
        });
    });

    it('lanza ConcertsFetchError si a una entrada le falta un campo requerido', async () => {
        const withoutBand: Record<string, unknown> = { ...validDto };
        delete withoutBand.band;
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse([withoutBand])));

        await expect(fetchConcertsPayload()).rejects.toMatchObject({
            name: 'ConcertsFetchError',
            message: 'El catálogo de conciertos tiene entradas con forma inválida',
        });
    });

    it('lanza ConcertsFetchError si el status no es uno de los valores válidos', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(jsonResponse([{ ...validDto, status: 'not-a-status' }])),
        );

        await expect(fetchConcertsPayload()).rejects.toMatchObject({
            name: 'ConcertsFetchError',
            message: 'El catálogo de conciertos tiene entradas con forma inválida',
        });
    });

    it('lanza ConcertsFetchError si la fecha no viene en formato YYYY-MM-DD', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(jsonResponse([{ ...validDto, date: '15/06/2026' }])),
        );

        await expect(fetchConcertsPayload()).rejects.toMatchObject({
            name: 'ConcertsFetchError',
            message: 'El catálogo de conciertos tiene entradas con forma inválida',
        });
    });
});
