// import './style.css'

import { concertsLists } from './mocks/concerts.mocks';

const appContainer = document.getElementById('app');

console.log("Hola, Mundo!");
console.log(concertsLists);

const listContainer = document.createElement('ul');
listContainer.innerHTML = concertsLists.reduce((acc, concert) => {
    return (
        acc +
        `<li>${concert.title} - ${concert.band} - ${concert.date.toDateString()}</li>`
    );
}, '');

if (appContainer){
    appContainer.innerHTML = `
        <h1>NeonPulse</H1>
        <p>Entorno de desarrollo inicializado con Vite y VanillaJS</p>
        `
    appContainer.appendChild(listContainer);
}