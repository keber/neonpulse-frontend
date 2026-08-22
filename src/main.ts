import './style.css';

import { concertsLists } from './mocks/concerts.mocks';
import { generateConcertCardHTML } from "./components/ConcertCard";

const appContainer = document.getElementById('app');


if(appContainer){
    const concertGridHTML = concertsLists
        .toSorted((a, b) => a.date.getTime() - b.date.getTime())
        .map((concert) => generateConcertCardHTML(concert)
    ).join('');

    /*
    Componente átomo: ConcertCard
    Componente molecula: ConcertGrid
    Componente organismo: ConcertCatalog
    Componente sistema: App
     */
    appContainer.innerHTML = `
        <h1>NeonPulse</H1>
        <p>Cartelera Oficial de Conciertos y Eventos en Vivo</p>
        
        <main id="catalog-container">
        ${concertGridHTML}
        </main>
        `;
}
