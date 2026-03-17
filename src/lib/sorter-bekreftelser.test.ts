import type { TilgjengeligBekreftelse } from '@navikt/arbeidssokerregisteret-utils';
import { describe, expect, it } from 'vitest';
import flereBekreftelser from '@/lib/mocks/bekreftelser-flere.json';
import { sorterBekreftelser } from './sorter-bekreftelser';

describe('sorterBekreftelser', () => {
    it('sorterer bekreftelser etter gjelderTil i stigende rekkefølge', () => {
        const reversed = [...flereBekreftelser].reverse() as TilgjengeligBekreftelse[];

        const result = sorterBekreftelser(reversed);

        const first = result[0] as TilgjengeligBekreftelse;
        const second = result[1] as TilgjengeligBekreftelse;
        const expectedFirst = flereBekreftelser[0] as TilgjengeligBekreftelse;
        const expectedSecond = flereBekreftelser[1] as TilgjengeligBekreftelse;

        expect(first.bekreftelseId).toBe(expectedFirst.bekreftelseId);
        expect(second.bekreftelseId).toBe(expectedSecond.bekreftelseId);
        expect(new Date(first.gjelderTil).getTime()).toBeLessThan(new Date(second.gjelderTil).getTime());
    });

    it('returnerer en ny array uten å mutere input', () => {
        const input = [...flereBekreftelser].reverse() as TilgjengeligBekreftelse[];
        const inputCopy = [...input];

        const result = sorterBekreftelser(input);

        expect(result).not.toBe(input);
        expect(input).toEqual(inputCopy);
    });

    it('håndterer tom liste', () => {
        expect(sorterBekreftelser([])).toEqual([]);
    });

    it('håndterer liste med én bekreftelse', () => {
        const single = [flereBekreftelser[0]] as TilgjengeligBekreftelse[];
        const result = sorterBekreftelser(single);

        const first = result[0] as TilgjengeligBekreftelse;
        const expected = flereBekreftelser[0] as TilgjengeligBekreftelse;

        expect(result).toHaveLength(1);
        expect(first.bekreftelseId).toBe(expected.bekreftelseId);
    });
});
