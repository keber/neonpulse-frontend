import { concertsLists } from './mocks/concerts.mocks';
import { generateConcertCardHTML } from "./components/ConcertCard";

const appContainer = document.getElementById('app');


if(appContainer){
    const concertGridHTML = concertsLists.map((
        concert) => generateConcertCardHTML(concert)
    ).join('');

    /*
    Componente átomo: ConcertCard
    Componente molecula: ConcertGrid
    Componente organismo: ConcertCatalog
    Componente sistema: App
     */
    appContainer.innerHTML = `
        <h1>NeonPulse</H1>
        <p>Entorno de desarrollo inicializado con Vite y VanillaJS</p>
        
        <main id="catalog-container">
        ${concertGridHTML}
        </main>
        `;
}
