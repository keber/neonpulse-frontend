import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type ConcertModel, ConcertStatus } from '@/models';
import { createFeaturedBannerElement, selectFeaturedConcert } from './FeaturedBanner';

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

describe('selectFeaturedConcert', () => {
    beforeEach(() => {
        vi.setSystemTime(new Date('2026-06-01T12:00:00Z'));
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('prioriza el concierto marcado como destacado por el editor', () => {
        const featured = buildConcert({ id: '2', featured: true, date: new Date('2026-08-01') });
        const notFeatured = buildConcert({ id: '1', date: new Date('2026-06-10') });

        expect(selectFeaturedConcert([notFeatured, featured])).toEqual({
            concert: featured,
            isFallback: false,
        });
        expect(console.error).not.toHaveBeenCalled();
    });

    it('si hay varios destacados, usa el más próximo por fecha (todavía no hay carrusel)', () => {
        const later = buildConcert({ id: '2', featured: true, date: new Date('2026-09-01') });
        const sooner = buildConcert({ id: '1', featured: true, date: new Date('2026-07-01') });

        expect(selectFeaturedConcert([later, sooner]).concert?.id).toBe('1');
    });

    it('sin destacados, usa como fallback el no cancelado más próximo a hoy y avisa por consola', () => {
        const canceled = buildConcert({
            id: '1',
            status: ConcertStatus.CANCELED,
            date: new Date('2026-06-02'),
        });
        const nearest = buildConcert({ id: '2', date: new Date('2026-06-10') });
        const farther = buildConcert({ id: '3', date: new Date('2026-12-01') });

        expect(selectFeaturedConcert([canceled, farther, nearest])).toEqual({
            concert: nearest,
            isFallback: true,
        });
        expect(console.error).toHaveBeenCalledOnce();
    });

    it('sin ningún concierto, no hay candidato y avisa por consola', () => {
        expect(selectFeaturedConcert([])).toEqual({ concert: null, isFallback: true });
        expect(console.error).toHaveBeenCalledOnce();
    });

    it('si todos los conciertos están cancelados, tampoco hay candidato para el fallback', () => {
        const result = selectFeaturedConcert([buildConcert({ status: ConcertStatus.CANCELED })]);

        expect(result).toEqual({ concert: null, isFallback: true });
        expect(console.error).toHaveBeenCalledOnce();
    });
});

describe('createFeaturedBannerElement', () => {
    beforeEach(() => {
        vi.setSystemTime(new Date('2026-06-01T12:00:00Z'));
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('renderiza el título, la banda y la ubicación del concierto destacado', () => {
        const banner = createFeaturedBannerElement([
            buildConcert({ featured: true, title: 'Neon Nights', band: 'Arctic Monkeys' }),
        ]);

        expect(banner.querySelector('.featured-banner__title')?.textContent).toBe('Neon Nights');
        expect(banner.querySelector('.featured-banner__band')?.textContent).toBe('Arctic Monkeys');
        expect(banner.querySelector('.featured-banner__location')?.textContent?.trim()).toBe(
            'Estadio Nacional',
        );
    });

    it('nunca interpreta el texto del concierto como HTML (usa textContent, no innerHTML)', () => {
        const banner = createFeaturedBannerElement([
            buildConcert({ featured: true, title: '<img src=x onerror=alert(1)>' }),
        ]);

        expect(banner.querySelector('.featured-banner__title img')).toBeNull();
        expect(banner.querySelector('.featured-banner__title')?.textContent).toBe(
            '<img src=x onerror=alert(1)>',
        );
    });

    it('renderiza un banner genérico cuando no hay ningún concierto disponible', () => {
        const banner = createFeaturedBannerElement([]);

        expect(banner.classList.contains('featured-banner--generic')).toBe(true);
        expect(banner.querySelector('.featured-banner__title')?.textContent).not.toBe('');
    });
});
