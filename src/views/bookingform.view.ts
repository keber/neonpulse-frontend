import { createBookingFormElement } from '@/components/BookingForm';
import { type RawBookingInput, validateBooking } from '@/services/booking.service';

// Modificador BEM que reutiliza la misma caja de #errorBox para el mensaje
// de éxito, en vez de crear un segundo elemento — ver BookingForm.css.
const SUCCESS_MODIFIER = 'error-box--success';

// Debe coincidir con --message-timeout en BookingForm.css (la duración de
// la animación de la barra de progreso) — acá se programa el cierre real.
const MESSAGE_TIMEOUT_MS = 5000;

// Orquesta el formulario de reserva: monta el componente (presentacional,
// ver BookingForm.ts) y le engancha el comportamiento — evita el submit
// nativo (que recargaría la página porque el <form> no tiene action),
// valida en dos pasos (constraint validation del navegador primero,
// booking.service.ts después) y muestra el resultado — error o éxito — en
// #errorBox en vez de los tooltips nativos.
export function renderBookingFormView(container: HTMLElement): void {
    container.appendChild(createBookingFormElement());

    const form = container.querySelector<HTMLFormElement>('#bookingForm')!;
    const emailInput = container.querySelector<HTMLInputElement>('#email')!;
    const quantityInput = container.querySelector<HTMLInputElement>('#quantity')!;
    const messageBox = container.querySelector<HTMLElement>('#errorBox')!;

    const fieldElements: Record<keyof RawBookingInput, HTMLInputElement> = {
        email: emailInput,
        quantity: quantityInput,
    };

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

    // Primero la constraint validation del navegador (required, type=email,
    // min/max con step=1 implícito) — sus mensajes ya vienen traducidos y
    // cubren los casos más comunes (campo vacío, formato). Recién si eso
    // pasa, se corre la validación de negocio (booking.service.ts), que es
    // la que de verdad tipa el resultado y deja lugar a reglas futuras.
    function runValidation(): ReturnType<typeof validateBooking> {
        const firstInvalid = form.querySelector<HTMLInputElement>(':invalid');
        if (firstInvalid) {
            return {
                valid: false,
                field: firstInvalid.name as keyof RawBookingInput,
                message: firstInvalid.validationMessage,
            };
        }

        return validateBooking({ email: emailInput.value, quantity: quantityInput.value });
    }

    // Revisa el formulario completo (no solo el campo que disparó el
    // evento) para no pisar el mensaje de un campo distinto al perder el
    // foco de uno que ya está bien.
    function validateAndReport(): ReturnType<typeof validateBooking> {
        const result = runValidation();
        if (result.valid) {
            hideMessage();
        } else {
            showMessage(result.message, false);
        }
        return result;
    }

    // Como el form tiene novalidate, el navegador no valida solo en ningún
    // momento — decidimos nosotros cuándo: acá, al perder el foco de
    // cualquier campo, además del submit más abajo.
    form.querySelectorAll<HTMLInputElement>('input').forEach((field) => {
        field.addEventListener('blur', () => validateAndReport());
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const result = validateAndReport();
        if (!result.valid) {
            fieldElements[result.field].focus();
            return;
        }

        const { email, quantity } = result.data;
        const entradas = quantity === 1 ? 'entrada' : 'entradas';
        showMessage(
            `¡Reserva confirmada! Te enviamos la confirmación a ${email} (${quantity} ${entradas}).`,
            true,
        );
        form.reset();
    });
}
