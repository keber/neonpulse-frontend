import { type ConcertModel, ConcertStatus } from '@/models';

const CONCERTS_URL = '/data/concerts.json';

// Igual que ConcertModel, pero `date` todavía es el string crudo del JSON
// (no lo pasamos por `new Date()` hasta después de validarlo).
type ConcertDto = Omit<ConcertModel, 'date'> & { date: string };

const VALID_STATUSES: readonly string[] = Object.values(ConcertStatus);
const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

function isConcertDto(value: unknown): value is ConcertDto {
    if (typeof value !== 'object' || value === null) return false;

    const c = value as Record<string, unknown>;

    return (
        typeof c.id === 'string' &&
        typeof c.title === 'string' &&
        typeof c.band === 'string' &&
        typeof c.date === 'string' &&
        DATE_ONLY_RE.test(c.date) &&
        typeof c.location === 'string' &&
        typeof c.status === 'string' &&
        VALID_STATUSES.includes(c.status) &&
        (c.time === undefined || typeof c.time === 'string') &&
        (c.featured === undefined || typeof c.featured === 'boolean')
    );
}

export async function fetchConcerts(): Promise<ConcertModel[]> {
    const response = await fetch(CONCERTS_URL);

    if (!response.ok) {
        throw new Error(`No se pudo cargar el catálogo de conciertos (HTTP ${response.status})`);
    }

    const payload: unknown = await response.json();

    if (!Array.isArray(payload)) {
        throw new Error('La respuesta del catálogo de conciertos no es un array');
    }

    if (!payload.every(isConcertDto)) {
        throw new Error('El catálogo de conciertos tiene entradas con forma inválida');
    }

    // A esta altura TS ya angostó `payload` a ConcertDto[] — sin ningún `as`.
    return payload.map((concert) => ({
        ...concert,
        date: new Date(concert.date),
    }));
}