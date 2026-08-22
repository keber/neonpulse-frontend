import { describe, expect, it } from 'vitest';
import { escapeHtml } from './escapeHtml';

describe('escapeHtml', () => {
    it('escapa las etiquetas para que no se interpreten como HTML', () => {
        expect(escapeHtml('<script>alert(1)</script>')).toBe(
            '&lt;script&gt;alert(1)&lt;/script&gt;',
        );
    });

    it('escapa comillas y ampersands', () => {
        expect(escapeHtml(`Tom & Jerry's "Live"`)).toBe(
            'Tom &amp; Jerry&#39;s &quot;Live&quot;',
        );
    });

    it('deja intacto el texto que no tiene caracteres especiales', () => {
        expect(escapeHtml('The Rolling Stones')).toBe('The Rolling Stones');
    });
});
