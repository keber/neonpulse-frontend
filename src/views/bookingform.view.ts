import { createBookingFormElement } from '@/components/BookingForm';
import { type RawBookingInput, validateBooking } from '@/services/booking.service';
import { requireElement } from '@/lib/dom';

// BEM modifier that reuses the same #errorBox for the success message
// instead of creating a second element — see BookingForm.css.
const SUCCESS_MODIFIER = 'error-box--success';

// Must match --message-timeout in BookingForm.css (the progress bar
// animation's duration) — this is where the actual dismissal is scheduled.
const MESSAGE_TIMEOUT_MS = 5000;

// Orchestrates the booking form: mounts the component (presentational,
// see BookingForm.ts) and wires up its behavior — prevents the native
// submit (which would reload the page since the <form> has no action),
// validates in two steps (the browser's constraint validation first,
// then booking.service.ts) and shows the result — error or success — in
// #errorBox instead of the native tooltips.
export function renderBookingFormView(container: HTMLElement): void {
    container.appendChild(createBookingFormElement());

    const form = requireElement<HTMLFormElement>(container, '#bookingForm');
    const emailInput = requireElement<HTMLInputElement>(container, '#email');
    const quantityInput = requireElement<HTMLInputElement>(container, '#quantity');
    const messageBox = requireElement<HTMLElement>(container, '#errorBox');

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

        // Hide the box for an instant and force a reflow: if it was already
        // visible (e.g. two errors in a row), the progress bar restarts its
        // animation from scratch instead of continuing where it was.
        messageBox.hidden = true;
        void messageBox.offsetWidth;

        messageBox.textContent = text;
        messageBox.classList.toggle(SUCCESS_MODIFIER, isSuccess);
        messageBox.hidden = false;

        dismissTimer = setTimeout(hideMessage, MESSAGE_TIMEOUT_MS);
    }

    // First the browser's constraint validation (required, type=email,
    // min/max with an implicit step=1) — its messages already come
    // localized and cover the most common cases (empty field, format).
    // Only once that passes does the business validation run
    // (booking.service.ts), which is what actually types the result and
    // leaves room for future rules.
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

    // Checks the whole form (not just the field that triggered the event)
    // so we don't overwrite a different field's message when one that's
    // already valid loses focus.
    function validateAndReport(): ReturnType<typeof validateBooking> {
        const result = runValidation();
        if (result.valid) {
            hideMessage();
        } else {
            showMessage(result.message, false);
        }
        return result;
    }

    // Since the form has novalidate, the browser never validates on its
    // own — we decide when: here, on blur of any field, plus on submit
    // below.
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
