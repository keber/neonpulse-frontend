import { createBookingFormElement } from '@/components/BookingForm';

// Modificador BEM que reutiliza la misma caja de #errorBox para el mensaje
// de éxito, en vez de crear un segundo elemento — ver BookingForm.css.
const SUCCESS_MODIFIER = 'error-box--success';

// Debe coincidir con --message-timeout en BookingForm.css (la duración de
// la animación de la barra de progreso) — acá se programa el cierre real.
const MESSAGE_TIMEOUT_MS = 5000;

// Orquesta el formulario de reserva: monta el componente (presentacional,
// ver BookingForm.ts) y le engancha el comportamiento — evita el submit
// nativo (que recargaría la página porque el <form> no tiene action),
// valida con la Constraint Validation API del navegador y muestra el
// resultado (error o éxito) en #errorBox en vez de los tooltips nativos.
export function renderBookingFormView(container: HTMLElement): void {
    container.appendChild(createBookingFormElement());

    const form = container.querySelector<HTMLFormElement>('#bookingForm')!;
    const emailInput = container.querySelector<HTMLInputElement>('#email')!;
    const messageBox = container.querySelector<HTMLElement>('#errorBox')!;

    let dismissTimer: ReturnType<typeof setTimeout> | undefined;

    function hideMessage(): void {
        clearTimeout(dismissTimer);
        messageBox.hidden = true;
    }

    function showMessage(text: string, isSuccess: boolean): void {
        clearTimeout(dismissTimer);

        // Oculta el box un instante y fuerza un reflow: si ya estaba visible
        // (p. ej. dos errores seguidos), la barra de progreso reinicia su
        // animación desde el principio en vez de seguir donde iba.
        messageBox.hidden = true;
        void messageBox.offsetWidth;

        messageBox.textContent = text;
        messageBox.classList.toggle(SUCCESS_MODIFIER, isSuccess);
        messageBox.hidden = false;

        dismissTimer = setTimeout(hideMessage, MESSAGE_TIMEOUT_MS);
    }

    // Revisa el formulario completo (no solo el campo que disparó el evento)
    // para no pisar el mensaje de un campo distinto al perder el foco de uno
    // que ya está bien.
    function validateForm(): boolean {
        const firstInvalid = form.querySelector<HTMLInputElement>(':invalid');
        if (firstInvalid) {
            showMessage(firstInvalid.validationMessage, false);
            return false;
        }
        hideMessage();
        return true;
    }

    // Como el form tiene novalidate, el navegador no valida solo en ningún
    // momento — decidimos nosotros cuándo: acá, al perder el foco de
    // cualquier campo, además del submit más abajo.
    form.querySelectorAll<HTMLInputElement>('input').forEach((field) => {
        field.addEventListener('blur', validateForm);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!validateForm()) {
            form.querySelector<HTMLInputElement>(':invalid')?.focus();
            return;
        }

        showMessage(
            `¡Reserva confirmada! Te enviamos la confirmación a ${emailInput.value}.`,
            true,
        );
        form.reset();
    });
}
