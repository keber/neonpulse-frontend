// Los componentes de este proyecto (ver ConcertCard) renderizan devolviendo
// strings que terminan asignados a innerHTML. Los campos de texto libre de
// los datos (título, banda, ubicación, …) deben pasar por acá antes de
// interpolarse, para que no puedan inyectar HTML si alguna vez dejan de ser
// mocks locales y pasan a venir de una API o de un formulario.
const HTML_ESCAPES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

export function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}
