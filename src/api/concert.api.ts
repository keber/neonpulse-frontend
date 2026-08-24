import { type ConcertModel, ConcertStatus } from '@/models';

const CONCERTS_URL = '/data/concerts.json';

// Forma cruda tal como llega del JSON: igual que ConcertModel, pero `date`
// todavía es un string sin parsear. La transformación a Date es una regla
// de negocio y vive en la capa de servicio, no acá.
export type ConcertDto = Omit<ConcertModel, 'date'> & { date: string };

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

// Capa de transporte: trae el payload y garantiza en runtime que cumple el
// contrato esperado del endpoint. No sabe nada de ConcertModel ni hace
// transformaciones de negocio — eso es responsabilidad de concert.service.ts.
export async function fetchConcertsPayload(): Promise<ConcertDto[]> {
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

    return payload;
}
