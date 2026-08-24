// Atom that wraps lucide-static: exposes an icon's SVG as a real DOM
// element, ready to insert with appendChild/append.
import calendarSvg from 'lucide-static/icons/calendar.svg?raw';
import clockSvg from 'lucide-static/icons/clock.svg?raw';
import mapPinSvg from 'lucide-static/icons/map-pin.svg?raw';

const ICON_SOURCES = {
    calendar: calendarSvg,
    clock: clockSvg,
    'map-pin': mapPinSvg,
} as const;

export type IconName = keyof typeof ICON_SOURCES;

// One <template> per icon, parsed once and cached — the raw SVG comes
// from the lucide-static package (not dynamic data), so assigning it to
// innerHTML is safe. Each call to icon() just clones that <template>.
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
 * Returns a new <svg> element for the requested icon.
 *
 * - Marked `aria-hidden="true"` because these icons always sit next to
 *   text that already describes their meaning (they're decorative, not
 *   the only source of information).
 * - Size and color are controlled with Tailwind utilities (defaults to
 *   `w-4 h-4 shrink-0`; color is inherited from `currentColor`).
 */
export function icon(name: IconName, className = 'w-4 h-4 shrink-0'): SVGSVGElement {
    const svg = getTemplate(name).content.firstElementChild!.cloneNode(true) as SVGSVGElement;
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', className);
    return svg;
}
