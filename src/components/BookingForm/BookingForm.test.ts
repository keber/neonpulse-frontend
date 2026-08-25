import { describe, expect, it } from 'vitest';
import { createBookingFormElement } from './BookingForm';

describe('createBookingFormElement', () => {
    it('incluye los campos de email y cantidad, y el botón de envío', () => {
        const form = createBookingFormElement();

        expect(form.querySelector<HTMLInputElement>('#email')?.type).toBe('email');
        expect(form.querySelector<HTMLInputElement>('#quantity')?.type).toBe('number');
        expect(form.querySelector('.booking-form__submit')?.textContent).toBe('Reservar');
    });

    it('desactiva la validación nativa del navegador (la maneja bookingform.view.ts)', () => {
        const form = createBookingFormElement();

        expect(form.querySelector('#bookingForm')?.hasAttribute('novalidate')).toBe(true);
    });

    it('el errorBox arranca oculto y con aria-live para lectores de pantalla', () => {
        const form = createBookingFormElement();
        const errorBox = form.querySelector<HTMLElement>('#errorBox');

        expect(errorBox?.hidden).toBe(true);
        expect(errorBox?.getAttribute('aria-live')).toBe('polite');
    });

    it('cada llamada devuelve un elemento nuevo (clonado), no una referencia compartida', () => {
        expect(createBookingFormElement()).not.toBe(createBookingFormElement());
    });
});
