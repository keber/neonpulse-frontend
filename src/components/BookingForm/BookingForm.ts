import templateHtml from './BookingForm_template.html?raw';

const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = templateHtml;

export function createBookingFormElement(): HTMLElement {
    return TEMPLATE.content.firstElementChild!.cloneNode(true) as HTMLElement;
}
