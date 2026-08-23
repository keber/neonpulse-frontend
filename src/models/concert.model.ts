// definir enum con valores

import { ConcertStatus } from './concertStatus.ts';

export interface ConcertModel {
    id: string;
    title: string;
    band: string;
    date: Date;
    time?: string; // HH:mm
    location: string;
    status: ConcertStatus;
    /**
     * Decisión editorial explícita: true si el equipo de contenido eligió
     * mostrar este concierto en el banner de destacados. No se infiere del
     * `status` (p. ej. LIVE) — esa regla de negocio queda para más adelante.
     */
    featured?: boolean;
}
