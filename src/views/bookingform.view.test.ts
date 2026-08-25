import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderBookingFormView } from './bookingform.view';
import { requireElement } from '@/lib/dom';

// Dispatches a "real" submit (bubbling + cancelable) without depending on
// SubmitEvent, which isn't needed here since the handler doesn't use
// `submitter`.
function submit(form: HTMLFormElement): Event {
    const event = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(event);
    return event;
}

describe('renderBookingFormView', () => {
    let container: HTMLElement;

    beforeEach(() => {
        // Attached to the document (not just created loose): focus()/blur()
        // need the element in the tree to actually update
        // document.activeElement.
        container = document.createElement('div');
        document.body.appendChild(container);
        renderBookingFormView(container);
    });

    afterEach(() => {
        container.remove();
        vi.useRealTimers();
    });

    function getElements() {
        return {
            form: requireElement<HTMLFormElement>(container, '#bookingForm'),
            email: requireElement<HTMLInputElement>(container, '#email'),
            quantity: requireElement<HTMLInputElement>(container, '#quantity'),
            errorBox: requireElement<HTMLElement>(container, '#errorBox'),
        };
    }

    it('monta el formulario dentro del contenedor', () => {
        expect(container.querySelector('.booking-form')).not.toBeNull();
    });

    it('evita el submit nativo (no debe recargar la página)', () => {
        const { form } = getElements();

        expect(submit(form).defaultPrevented).toBe(true);
    });

    it('con campos vacíos, muestra en #errorBox el mensaje de validación y enfoca el primer campo inválido', () => {
        const { form, email, errorBox } = getElements();

        submit(form);

        expect(errorBox.hidden).toBe(false);
        expect(errorBox.textContent).toBe(email.validationMessage);
        expect(errorBox.classList.contains('error-box--success')).toBe(false);
        expect(document.activeElement).toBe(email);
    });

    it('valida al perder el foco de un campo, sin necesidad de hacer submit', () => {
        const { email, errorBox } = getElements();

        email.focus();
        email.blur();

        expect(errorBox.hidden).toBe(false);
        expect(errorBox.textContent).toBe(email.validationMessage);
    });

    it('al perder el foco revisa todo el formulario, no solo el campo que lo disparó', () => {
        const { email, quantity, errorBox } = getElements();

        // Email ends up valid, but quantity is still empty: the message
        // should be quantity's, not disappear just because email is fine now.
        email.value = 'user@example.com';
        email.focus();
        email.blur();

        expect(errorBox.hidden).toBe(false);
        expect(errorBox.textContent).toBe(quantity.validationMessage);
    });

    it('corregir el campo y perder el foco oculta el mensaje sin esperar el timeout', () => {
        const { email, quantity, errorBox } = getElements();

        email.focus();
        email.blur();
        expect(errorBox.hidden).toBe(false);

        email.value = 'user@example.com';
        quantity.value = '2';
        quantity.focus();
        quantity.blur();

        expect(errorBox.hidden).toBe(true);
    });

    it('con datos válidos, muestra un mensaje de éxito con el email y la cantidad (plural) y resetea el formulario', () => {
        const { form, email, quantity, errorBox } = getElements();
        email.value = 'user@example.com';
        quantity.value = '3';

        submit(form);

        expect(errorBox.hidden).toBe(false);
        expect(errorBox.classList.contains('error-box--success')).toBe(true);
        expect(errorBox.textContent).toContain('user@example.com');
        expect(errorBox.textContent).toContain('3 entradas');
        expect(email.value).toBe('');
        expect(quantity.value).toBe('');
    });

    it('con cantidad 1, el mensaje de éxito usa el singular ("1 entrada")', () => {
        const { form, email, quantity, errorBox } = getElements();
        email.value = 'user@example.com';
        quantity.value = '1';

        submit(form);

        expect(errorBox.textContent).toContain('1 entrada');
        expect(errorBox.textContent).not.toContain('1 entradas');
    });

    it('rechaza una cantidad decimal aunque sea aceptada por checkValidity nativo', () => {
        // The native step default (1) already rejects this, so this test
        // documents the intentional redundancy: booking.service.ts is the
        // source of truth even if the <input>'s markup changes.
        const { form, email, quantity, errorBox } = getElements();
        email.value = 'user@example.com';
        quantity.value = '3.5';

        submit(form);

        expect(errorBox.hidden).toBe(false);
        expect(errorBox.classList.contains('error-box--success')).toBe(false);
        expect(document.activeElement).toBe(quantity);
    });

    it('el mensaje se cierra solo después del timeout', () => {
        vi.useFakeTimers();
        const { form, email, quantity, errorBox } = getElements();
        email.value = 'user@example.com';
        quantity.value = '3';

        submit(form);
        expect(errorBox.hidden).toBe(false);

        vi.advanceTimersByTime(5000);

        expect(errorBox.hidden).toBe(true);
    });

    it('un mensaje nuevo reinicia el temporizador de cierre en vez de sumarse al anterior', () => {
        vi.useFakeTimers();
        const { form, email, quantity, errorBox } = getElements();

        submit(form); // error: empty fields, starts its own 5s timer
        vi.advanceTimersByTime(3000);

        email.value = 'user@example.com';
        quantity.value = '3';
        submit(form); // success: replaces the message and restarts the timer

        vi.advanceTimersByTime(3000); // 3s since the 2nd message (6s since the 1st)
        expect(errorBox.hidden).toBe(false);

        vi.advanceTimersByTime(2000); // completes the 2nd message's 5s
        expect(errorBox.hidden).toBe(true);
    });
});
