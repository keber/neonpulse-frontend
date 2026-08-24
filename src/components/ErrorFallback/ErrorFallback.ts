// Global fallback UI: mounted when something unexpected breaks the app's
// render (concerts fetch failing or responding non-ok, malformed data, a
// component that throws, etc.). It doesn't replace the expected empty
// states (catalog with no concerts, no featured concert), which have their
// own message — this is the safety net for what can't be foreseen.
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
