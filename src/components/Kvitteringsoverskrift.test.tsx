// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { Kvitteringsoverskrift } from './Kvitteringsoverskrift';

describe('Kvitteringsoverskrift', () => {
    it('rendrer en fokusert h1 uten å legge til interaktive elementer', () => {
        render(<Kvitteringsoverskrift>Arbeidssøkerperioden er avsluttet</Kvitteringsoverskrift>);

        const heading = screen.getByRole('heading', { name: 'Arbeidssøkerperioden er avsluttet', level: 1 });
        expect(heading.tagName).toBe('H1');
        expect(heading.getAttribute('tabindex')).toBe('-1');
        expect(document.activeElement).toBe(heading);
        expect(screen.getAllByRole('heading')).toHaveLength(1);
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    it('beholder brukerens fokus ved uendret tittel og fokuserer når tittelen endres', () => {
        const { rerender } = render(
            <>
                <Kvitteringsoverskrift>Arbeidssøkerperioden er avsluttet</Kvitteringsoverskrift>
                <button type='button'>Fortsett</button>
            </>,
        );
        const button = screen.getByRole('button', { name: 'Fortsett' });
        button.focus();

        rerender(
            <>
                <Kvitteringsoverskrift>Arbeidssøkerperioden er avsluttet</Kvitteringsoverskrift>
                <button type='button'>Fortsett</button>
            </>,
        );
        expect(document.activeElement).toBe(button);

        rerender(
            <>
                <Kvitteringsoverskrift>Arbeidssøkerperioden er slettet</Kvitteringsoverskrift>
                <button type='button'>Fortsett</button>
            </>,
        );
        expect(document.activeElement).toBe(
            screen.getByRole('heading', { name: 'Arbeidssøkerperioden er slettet', level: 1 }),
        );
    });
});
