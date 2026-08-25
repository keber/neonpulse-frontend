// Global fallback UI: mounted when something breaks the app's render. It
// doesn't replace the expected empty states (catalog with no concerts, no
// featured concert), which have their own message — this is the safety
// net for what can't be foreseen, plus known-but-unrecoverable failures
// (e.g. the backend being unreachable) that get a more specific message.
export interface ErrorFallbackContent {
    title: string;
    message: string;
}

// Default: reserved for truly unexpected errors (a bug in the render
// pipeline) — see main.ts's catch block, which picks a more specific
// message when the failure is a known one (ConcertsFetchError).
const DEFAULT_CONTENT: ErrorFallbackContent = {
    title: 'Algo salió mal',
    message: 'No pudimos cargar la cartelera. Probá recargar la página en unos minutos.',
};

const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
    <div class="error-fallback" role="alert">
        <h2 class="error-fallback__title"></h2>
        <p class="error-fallback__message"></p>
    </div>
`;

export function createErrorFallbackElement(
    content: ErrorFallbackContent = DEFAULT_CONTENT,
): HTMLElement {
    const fallback = TEMPLATE.content.firstElementChild!.cloneNode(true) as HTMLElement;

    fallback.querySelector('.error-fallback__title')!.textContent = content.title;
    fallback.querySelector('.error-fallback__message')!.textContent = content.message;

    return fallback;
}
