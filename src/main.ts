// import './style.css'

/*
const saludo: string = 'Hola, soy un nuevo proyecto'
const despedida: string = 'Adiós, soy un footer!'
const numero: number = 42
*/

const appContainer = document.getElementById('app');


/*
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div>${saludo} - ${numero}</div>
`


document.querySelector<HTMLDivElement>('#footer')!.innerHTML = `
<div>${despedida}</div>
`

*/

if (appContainer){
    appContainer.innerHTML = `
    <h1>NeonPulse</H1>
    <p>Entorno de desarrollo inicializado con Vite y VanillaJS</p>
    `
}