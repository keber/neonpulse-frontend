import './style.css';

import { concertsLists } from './mocks/concerts.mocks';
import { createConcertCardElement } from './components/ConcertCard';

const appContainer = document.getElementById('app');

if (appContainer) {
    /*
    Componente átomo: ConcertCard
    Componente molecula: ConcertGrid
    Componente organismo: ConcertCatalog
    Componente sistema: App
     */
    appContainer.innerHTML = `
        <h1>NeonPulse</H1>
        <p>Cartelera Oficial de Conciertos y Eventos en Vivo</p>

        <main id="catalog-container"></main>
        `;

    const catalogContainer = appContainer.querySelector<HTMLElement>('#catalog-container')!;
    concertsLists
        .toSorted((a, b) => a.date.getTime() - b.date.getTime())
        .forEach((concert) => catalogContainer.appendChild(createConcertCardElement(concert)));
}
