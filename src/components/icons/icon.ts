// Átomo que envuelve lucide-static: expone el SVG crudo de un ícono como
// string, listo para interpolar en un template literal de HTML (el resto
// de los componentes del proyecto, como ConcertCard, renderizan devolviendo
// strings en vez de nodos del DOM, así que un ícono como string encaja sin
// necesitar ningún framework).
import calendarSvg from 'lucide-static/icons/calendar.svg?raw';
import clockSvg from 'lucide-static/icons/clock.svg?raw';
import mapPinSvg from 'lucide-static/icons/map-pin.svg?raw';

const ICONS = {
    calendar: calendarSvg,
    clock: clockSvg,
    'map-pin': mapPinSvg,
} as const;

export type IconName = keyof typeof ICONS;

/**
 * Devuelve el SVG de un ícono de lucide-static como string.
 *
 * - Se marca `aria-hidden="true"` porque estos íconos siempre van junto a
 *   texto que ya describe su significado (son decorativos, no la única
 *   fuente de información).
 * - El tamaño y color se controlan con utilidades de Tailwind (por defecto
 *   `w-4 h-4 shrink-0`; el color lo hereda de `currentColor`).
 */
export function icon(name: IconName, className = 'w-4 h-4 shrink-0'): string {
    return ICONS[name]
        .replace(/<!--[\s\S]*?-->\s*/, '')
        .replace(/\s*class="[^"]*"/, '')
        .replace('<svg', `<svg aria-hidden="true" class="${className}"`);
}
