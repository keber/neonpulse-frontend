import { type ConcertModel } from '@/models';
import { fetchConcertsPayload } from '@/api/concert.api';

// Business layer: asks the API for the already-validated payload and
// transforms it into the shape the rest of the app consumes
// (date: string → Date). Knows nothing about fetch/HTTP — that's
// concert.api.ts's responsibility.
export async function getConcerts(): Promise<ConcertModel[]> {
    const payload = await fetchConcertsPayload();

    return payload.map((concert) => ({
        ...concert,
        date: new Date(concert.date),
    }));
}
