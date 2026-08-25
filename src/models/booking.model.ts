// Contrato tipado de una reserva ya validada — lo produce
// services/booking.service.ts a partir de los strings crudos del
// formulario (ver RawBookingInput ahí). Solo 2 campos por ahora, pero es
// el lugar donde crecer cuando pidan más (fecha de la función, cantidad
// de acompañantes, etc.), igual que ConcertModel para conciertos.
export interface BookingModel {
    email: string;
    quantity: number;
}
