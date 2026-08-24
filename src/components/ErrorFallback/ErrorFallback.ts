// Fallback UI global: se monta cuando algo inesperado rompe el render de la
// app (fetch de conciertos que falla o responde no-ok, dato con forma
// inválida, un componente que lanza, etc.). No reemplaza los
// estados vacíos esperados (catálogo sin conciertos, sin destacados), que
// tienen su propio mensaje — esto es la red de seguridad para lo que no se
// puede prever.
const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
    <div class="error-fallback" role="alert">
        <h2 class="error-fallback__title">Algo salió mal</h2>
        <p class="error-fallback__message">
            No pudimos cargar la cartelera. Probá recargar la página en unos minutos.
        </p>
    </div>
`;

export function createErrorFallbackElement(): HTMLElement {
    return TEMPLATE.content.firstElementChild!.cloneNode(true) as HTMLElement;
}
