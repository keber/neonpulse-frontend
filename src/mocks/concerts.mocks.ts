import {type ConcertModel, ConcertStatus} from "../models";

export const concertsLists: ConcertModel[] = [
    {
        id: '1',
        title: 'Latinomerican Tour 2026',
        band: 'The Rolling Stones',
        date: new Date('2026-06-15'),
        time: '20:00',
        location: 'Estadio Nacional',
        status: ConcertStatus.SCHEDULED
    },
    {
        id: '2',
        title: 'Rock Legends Live',
        band: 'Deep Purple',
        date: new Date('2026-09-10'),
        location: 'Movistar Arena',
        status: ConcertStatus.SCHEDULED
    }
];