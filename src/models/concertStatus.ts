export const ConcertStatus = {
    SCHEDULED: 'SCHEDULED',
    LIVE: 'LIVE',
    FINISHED: 'FINISHED',
    CANCELED: 'CANCELED',
} as const;

export type ConcertStatus = (typeof ConcertStatus)[keyof typeof ConcertStatus];
