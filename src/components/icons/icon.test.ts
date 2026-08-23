import { describe, expect, it } from 'vitest';
import { icon } from './icon';

describe('icon', () => {
    it('devuelve un elemento <svg>', () => {
        expect(icon('calendar').tagName.toLowerCase()).toBe('svg');
    });

    it('marca el ícono como decorativo con aria-hidden', () => {
        expect(icon('map-pin').getAttribute('aria-hidden')).toBe('true');
    });

    it('aplica la clase de tamaño por defecto', () => {
        expect(icon('calendar').getAttribute('class')).toBe('w-4 h-4 shrink-0');
    });

    it('permite sobreescribir la clase', () => {
        expect(icon('calendar', 'w-6 h-6').getAttribute('class')).toBe('w-6 h-6');
    });

    it('cada llamada devuelve un nodo nuevo, no una instancia compartida', () => {
        expect(icon('calendar')).not.toBe(icon('calendar'));
    });
});
