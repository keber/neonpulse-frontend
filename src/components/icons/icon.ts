// Átomo que envuelve lucide-static: expone el SVG de un ícono como un
// elemento real del DOM, listo para insertarlo con appendChild/append.
import calendarSvg from 'lucide-static/icons/calendar.svg?raw';
import clockSvg from 'lucide-static/icons/clock.svg?raw';
import mapPinSvg from 'lucide-static/icons/map-pin.svg?raw';

const ICON_SOURCES = {
    calendar: calendarSvg,
    clock: clockSvg,
    'map-pin': mapPinSvg,
} as const;

export type IconName = keyof typeof ICON_SOURCES;

// Un <template> por ícono, parseado una sola vez y cacheado — el SVG crudo
// viene del paquete lucide-static (no de datos dinámicos), así que asignarlo
// a innerHTML es seguro. Cada llamada a icon() solo clona ese <template>.
const iconTemplates = new Map<IconName, HTMLTemplateElement>();

function getTemplate(name: IconName): HTMLTemplateElement {
    let template = iconTemplates.get(name);
    if (!template) {
        template = document.createElement('template');
        template.innerHTML = ICON_SOURCES[name].replace(/<!--[\s\S]*?-->\s*/, '');
        iconTemplates.set(name, template);
    }
    return template;
}

/**
 * Devuelve un nuevo elemento <svg> con el ícono pedido.
 *
 * - Se marca `aria-hidden="true"` porque estos íconos siempre van junto a
 *   texto que ya describe su significado (son decorativos, no la única
 *   fuente de información).
 * - El tamaño y color se controlan con utilidades de Tailwind (por defecto
 *   `w-4 h-4 shrink-0`; el color lo hereda de `currentColor`).
 */
export function icon(name: IconName, className = 'w-4 h-4 shrink-0'): SVGSVGElement {
    const svg = getTemplate(name).content.firstElementChild!.cloneNode(true) as SVGSVGElement;
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', className);
    return svg;
}
