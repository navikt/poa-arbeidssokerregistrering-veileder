// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next/link', () => ({
    default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

vi.mock('@/lib/tracking', () => ({
    loggAktivitet: vi.fn(),
}));

import { loggAktivitet } from '@/lib/tracking';
import { Bekreftelse } from './Bekreftelse';

const LINK_TEXT = 'Bekreft arbeidssøkerperiode på vegne av bruker';

describe('Bekreftelse', () => {
    it('viser én lenke uten nestet knapp og logger én gang ved klikk', () => {
        const { container } = render(<Bekreftelse antallTilgjengeligBekreftelser={1} />);

        const link = screen.getByRole('link', { name: LINK_TEXT });
        expect(link.getAttribute('href')).toBe('/bekreftelse');
        expect(container.querySelectorAll('a')).toHaveLength(1);
        expect(link.querySelector('button')).toBeNull();

        fireEvent.click(link);

        expect(loggAktivitet).toHaveBeenCalledTimes(1);
        expect(loggAktivitet).toHaveBeenCalledWith({ aktivitet: 'Går til bekreftelser' });
    });

    it('skjuler statusikonene for hjelpemidler', () => {
        const { container } = render(<Bekreftelse antallTilgjengeligBekreftelser={1} />);

        const icon = container.querySelector('svg');
        expect(icon?.getAttribute('aria-hidden')).toBe('true');
        expect(screen.queryByRole('img')).toBeNull();
    });
});
