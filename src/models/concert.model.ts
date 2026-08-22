// definir enum con valores

import {ConcertStatus} from "./concertStatus.ts";

export interface ConcertModel {
    id: string;
    title: string;
    band: string;
    date: Date;
    time?: string; // HH:mm
    location: string;
    status: ConcertStatus;
}