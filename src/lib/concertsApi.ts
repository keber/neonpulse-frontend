import { type ConcertModel } from '@/models';

const CONCERTS_URL = '/data/concerts.json';

// Igual que ConcertModel, pero `date` todavía es el string crudo del JSON
// (no lo pasamos por `new Date()` hasta después de validarlo).
type ConcertDto = Omit<ConcertModel, 'date'> & { date: string };

export async function fetchConcerts(): Promise<ConcertModel[]> {
    const response = await fetch(CONCERTS_URL);

    if (!response.ok) {
        throw new Error(
            `No se pudo cargar el catálogo de conciertos (HTTP ${response.status})`,
        );
    }

    const raw: ConcertDto[] = await response.json();

    return raw.map((concert) => ({
        ...concert,
        date: new Date(concert.date),
    }));
}