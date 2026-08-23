import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getConcertDateParts } from './concertDate';

describe('getConcertDateParts', () => {
    beforeEach(() => {
        vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('lee el día, el mes y el año en UTC', () => {
        expect(getConcertDateParts(new Date('2026-08-22'))).toEqual({
            day: 22,
            month: 'AGO',
            year: 2026,
            isCurrentYear: true,
        });
    });

    it('marca isCurrentYear en false cuando el año difiere del actual', () => {
        expect(getConcertDateParts(new Date('2025-11-02')).isCurrentYear).toBe(false);
    });
});
