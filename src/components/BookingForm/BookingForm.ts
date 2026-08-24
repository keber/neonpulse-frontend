const TEMPLATE: HTMLTemplateElement = document.createElement('template');
TEMPLATE.innerHTML = `
    <div class="booking-form">
        <h2>Reserva de Entradas</h2>
        <form id="bookingForm" class="booking-form__form" novalidate>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Your-Email@example.com" required>
            </div>
            <div class="form-group">
                <label for="quantity">Cantidad:</label>
                <input type="number" id="quantity" name="quantity" min="1" max="10" placeholder="1" required>
            </div>
            <div id="errorBox" class="error-box" hidden aria-live="polite"></div>
            <button type="submit" class="booking-form__submit">Reservar</button>
        </form>
    </div>
`;

export function createBookingFormElement(): HTMLElement {
    return TEMPLATE.content.firstElementChild!.cloneNode(true) as HTMLElement;
}
