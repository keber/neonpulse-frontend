import { describe, expect, it } from 'vitest';
import { ConcertStatus } from '../models';
import { concertsLists } from './concerts.mocks';

describe('concertsLists', () => {
    it('no está vacío', () => {
        expect(concertsLists.length).toBeGreaterThan(0);
    });

    it('tiene ids únicos', () => {
        const ids = concertsLists.map((concert) => concert.id);

        expect(new Set(ids).size).toBe(ids.length);
    });

    it('define fechas válidas y estados reconocidos por ConcertStatus', () => {
        const validStatuses = Object.values(ConcertStatus);

        for (const concert of concertsLists) {
            expect(concert.date instanceof Date && !Number.isNaN(concert.date.getTime())).toBe(true);
            expect(validStatuses).toContain(concert.status);
        }
    });
});
