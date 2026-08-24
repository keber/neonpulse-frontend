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
     * Explicit editorial decision: true if the content team chose to
     * feature this concert in the banner. Not inferred from `status`
     * (e.g. LIVE) — that business rule is left for later.
     */
    featured?: boolean;
}
