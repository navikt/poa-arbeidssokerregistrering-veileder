// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { loggAktivitet } from '@/lib/tracking';
import { TrackAktivitet } from './TrackAktivitet';

vi.mock('@/lib/tracking', () => ({
    loggAktivitet: vi.fn(),
}));

describe('TrackAktivitet', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders a tracked Aksel link with text and calls tracking and the caller once', () => {
        const data = { aktivitet: 'Går til skjema for dagpenger' } as const;
        const onClick = vi.fn();

        render(
            <TrackAktivitet data={data} href='https://www.nav.no/start/soknad-dagpenger?stegvalg=1' onClick={onClick}>
                Uinnlogget dagpengesøknad og papirsøknad finner du her.
            </TrackAktivitet>,
        );

        const link = screen.getByRole('link', {
            name: 'Uinnlogget dagpengesøknad og papirsøknad finner du her.',
        });
        expect(link.getAttribute('href')).toBe('https://www.nav.no/start/soknad-dagpenger?stegvalg=1');

        fireEvent.click(link);

        expect(loggAktivitet).toHaveBeenCalledTimes(1);
        expect(loggAktivitet).toHaveBeenCalledWith(data);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('renders nested ReactNode children without inspecting them', () => {
        render(
            <TrackAktivitet data={{ aktivitet: 'Går til skjema for dagpenger' }} href='/dagpenger'>
                Søk om <span>dagpenger</span>
            </TrackAktivitet>,
        );

        expect(screen.getByRole('link', { name: 'Søk om dagpenger' }).getAttribute('href')).toBe('/dagpenger');
    });
});
