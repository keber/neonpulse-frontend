import { describe, expect, it } from 'vitest';
import { createErrorFallbackElement } from './ErrorFallback';

describe('createErrorFallbackElement', () => {
    it('devuelve un contenedor con role="alert" y un mensaje para la persona usuaria', () => {
        const fallback = createErrorFallbackElement();

        expect(fallback.getAttribute('role')).toBe('alert');
        expect(fallback.querySelector('.error-fallback__title')?.textContent).not.toBe('');
        expect(fallback.querySelector('.error-fallback__message')?.textContent).not.toBe('');
    });

    it('cada llamada devuelve un elemento nuevo, no una instancia compartida', () => {
        expect(createErrorFallbackElement()).not.toBe(createErrorFallbackElement());
    });
});
