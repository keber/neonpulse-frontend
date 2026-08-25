import { type ConcertModel, ConcertStatus } from '@/models';
import { ConcertsFetchError } from '@/api/errors';

const CONCERTS_URL = 'https://neonpulse-api.keber.dev/api/v1/concerts';

// Raw shape as it arrives from the JSON: same as ConcertModel, but `date`
// is still an unparsed string. The transformation to Date is a business
// rule and lives in the service layer, not here.
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

// Transport layer: fetches the payload and guarantees at runtime that it
// matches the endpoint's expected contract. Knows nothing about
// ConcertModel and does no business transformations — that's
// concert.service.ts's responsibility.
export async function fetchConcertsPayload(): Promise<ConcertDto[]> {
    let response: Response;
    try {
        response = await fetch(CONCERTS_URL);
    } catch (error) {
        // fetch() itself rejects for network-level failures (offline, DNS,
        // CORS, connection refused, etc.) — a raw TypeError with no `.ok`
        // to check. Wrap it so callers only ever deal with ConcertsFetchError.
        throw new ConcertsFetchError('No se pudo conectar con el servidor de conciertos', {
            cause: error,
        });
    }

    if (!response.ok) {
        throw new ConcertsFetchError(
            `No se pudo cargar el catálogo de conciertos (HTTP ${response.status})`,
        );
    }

    let payload: unknown;
    try {
        payload = await response.json();
    } catch (error) {
        throw new ConcertsFetchError('La respuesta del catálogo de conciertos no es JSON válido', {
            cause: error,
        });
    }

    if (!Array.isArray(payload)) {
        throw new ConcertsFetchError('La respuesta del catálogo de conciertos no es un array');
    }

    if (!payload.every(isConcertDto)) {
        throw new ConcertsFetchError('El catálogo de conciertos tiene entradas con forma inválida');
    }

    return payload;
}
