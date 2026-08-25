import { describe, expect, it } from 'vitest';
import { requireElement } from './dom';

describe('requireElement', () => {
    it('devuelve el elemento cuando el selector matchea', () => {
        const root = document.createElement('div');
        root.innerHTML = '<span class="target">hola</span>';

        const el = requireElement<HTMLSpanElement>(root, '.target');

        expect(el.textContent).toBe('hola');
    });

    it('lanza un error descriptivo (con el selector) cuando no hay match', () => {
        const root = document.createElement('div');

        expect(() => requireElement(root, '.missing')).toThrow(
            'Expected element matching ".missing" to exist',
        );
    });
});
