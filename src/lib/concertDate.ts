// Utilidad compartida para leer día/mes/año de la fecha de un concierto.
// Se extrajo de ConcertCard porque FeaturedBanner también necesita
// formatear la fecha del destacado y no queríamos duplicar la tabla de
// meses ni la lógica de UTC en dos componentes.
export const MONTHS_ES = [
    'ENE',
    'FEB',
    'MAR',
    'ABR',
    'MAY',
    'JUN',
    'JUL',
    'AGO',
    'SEP',
    'OCT',
    'NOV',
    'DIC',
];

export interface ConcertDateParts {
    day: number;
    month: string;
    year: number;
    isCurrentYear: boolean;
}

/**
 * Se usan los métodos UTC porque las fechas se construyen a partir de
 * strings tipo "YYYY-MM-DD", que Date interpreta como medianoche UTC;
 * leerlas en hora local podía mostrar el día anterior según el huso horario.
 */
export function getConcertDateParts(date: Date): ConcertDateParts {
    const day = date.getUTCDate();
    const month = MONTHS_ES[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    const currentYear = new Date().getUTCFullYear();

    return { day, month, year, isCurrentYear: year === currentYear };
}
