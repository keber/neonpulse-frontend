// Shared utility to read a concert's date into day/month/year. Extracted
// from ConcertCard because FeaturedBanner also needs to format the
// featured concert's date, and we didn't want to duplicate the month
// table or the UTC logic across two components.
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
 * UTC methods are used because dates are built from "YYYY-MM-DD" strings,
 * which Date interprets as UTC midnight; reading them in local time could
 * show the previous day depending on the browser's timezone.
 */
export function getConcertDateParts(date: Date): ConcertDateParts {
    const day = date.getUTCDate();
    const month = MONTHS_ES[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    const currentYear = new Date().getUTCFullYear();

    return { day, month, year, isCurrentYear: year === currentYear };
}
