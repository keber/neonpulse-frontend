import { type BookingModel } from '@/models';

// Valores tal como salen del formulario — todavía strings sin parsear,
// uno por cada campo de BookingModel. Es el "DTO" de esta capa: el
// equivalente a lo que ConcertDto es para concert.api.ts, solo que acá el
// origen no es una respuesta de red sino la entrada de la persona usuaria.
export interface RawBookingInput {
    email: string;
    quantity: string;
}

export type BookingValidationResult =
    | { valid: true; data: BookingModel }
    | { valid: false; field: keyof RawBookingInput; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;

// Contrato real de "qué es una reserva válida", independiente del <form>:
// el HTML (required/type=email/min/max, con step=1 implícito) ya cubre
// estos mismos casos hoy, pero esa validación vive atada a los atributos
// de un <input> y no alcanza para reglas de negocio futuras (cruces entre
// campos, restricciones que no se expresan en HTML, etc.). Esta función
// es la que decide, tipa el resultado y explica qué campo falló y por qué.
export function validateBooking(input: RawBookingInput): BookingValidationResult {
    const email = input.email.trim();
    if (!EMAIL_RE.test(email)) {
        return { valid: false, field: 'email', message: 'Ingresá un email válido.' };
    }

    const quantity = Number(input.quantity);
    if (!Number.isInteger(quantity) || quantity < MIN_QUANTITY || quantity > MAX_QUANTITY) {
        return {
            valid: false,
            field: 'quantity',
            message: `La cantidad debe ser un número entero entre ${MIN_QUANTITY} y ${MAX_QUANTITY}.`,
        };
    }

    return { valid: true, data: { email, quantity } };
}
