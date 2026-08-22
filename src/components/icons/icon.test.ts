import { describe, expect, it } from 'vitest';
import { icon } from './icon';

describe('icon', () => {
    it('devuelve un <svg> válido para un ícono conocido', () => {
        const svg = icon('calendar');

        expect(svg).toContain('<svg');
        expect(svg).toContain('</svg>');
    });

    it('marca el ícono como decorativo con aria-hidden', () => {
        expect(icon('map-pin')).toContain('aria-hidden="true"');
    });

    it('no incluye el comentario de licencia de lucide-static', () => {
        expect(icon('clock')).not.toContain('@license');
    });

    it('aplica la clase de tamaño por defecto', () => {
        expect(icon('calendar')).toContain('class="w-4 h-4 shrink-0"');
    });

    it('permite sobreescribir la clase', () => {
        expect(icon('calendar', 'w-6 h-6')).toContain('class="w-6 h-6"');
    });

    it('no deja un atributo class duplicado', () => {
        const matches = icon('calendar').match(/class="/g) ?? [];
        expect(matches.length).toBe(1);
    });
});
