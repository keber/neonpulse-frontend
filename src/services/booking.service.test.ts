import { describe, expect, it } from 'vitest';
import { validateBooking } from './booking.service';

describe('validateBooking', () => {
    it('con datos válidos, devuelve el BookingModel tipado (cantidad ya como number)', () => {
        const result = validateBooking({ email: 'user@example.com', quantity: '3' });

        expect(result).toEqual({ valid: true, data: { email: 'user@example.com', quantity: 3 } });
    });

    it('recorta los espacios del email', () => {
        const result = validateBooking({ email: '  user@example.com  ', quantity: '1' });

        expect(result).toEqual({ valid: true, data: { email: 'user@example.com', quantity: 1 } });
    });

    it.each([
        ['sin arroba', 'userexample.com'],
        ['sin dominio', 'user@'],
        ['con espacios en medio', 'user @example.com'],
        ['vacío', ''],
    ])('rechaza un email inválido (%s)', (_caso, email) => {
        const result = validateBooking({ email, quantity: '1' });

        expect(result).toEqual({ valid: false, field: 'email', message: expect.any(String) });
    });

    it.each([
        ['decimal', '3.5'],
        ['cero', '0'],
        ['negativa', '-1'],
        ['mayor al máximo', '11'],
        ['no numérica', 'abc'],
        ['vacía', ''],
    ])('rechaza una cantidad inválida (%s)', (_caso, quantity) => {
        const result = validateBooking({ email: 'user@example.com', quantity });

        expect(result).toEqual({ valid: false, field: 'quantity', message: expect.any(String) });
    });

    it.each(['1', '10'])('acepta los límites de cantidad (%s)', (quantity) => {
        expect(validateBooking({ email: 'user@example.com', quantity }).valid).toBe(true);
    });
});
