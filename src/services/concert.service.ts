import { type ConcertModel } from '@/models';
import { fetchConcertsPayload } from '@/api/concert.api';

// Capa de negocio: pide el payload ya validado a la API y lo transforma a
// la forma que consume el resto de la app (date: string → Date). No sabe
// nada de fetch/HTTP — eso es responsabilidad de concert.api.ts.
export async function getConcerts(): Promise<ConcertModel[]> {
    const payload = await fetchConcertsPayload();

    return payload.map((concert) => ({
        ...concert,
        date: new Date(concert.date),
    }));
}
