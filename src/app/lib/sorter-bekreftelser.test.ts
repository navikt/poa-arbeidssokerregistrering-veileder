import type { TilgjengeligBekreftelse } from '@navikt/arbeidssokerregisteret-utils';
import { describe, expect, it } from 'vitest';
import flereBekreftelser from '@/app/mocks/bekreftelser-flere.json';
import { sorterBekreftelser } from './sorter-bekreftelser';

describe('sorterBekreftelser', () => {
    it('sorterer bekreftelser etter gjelderTil i stigende rekkefølge', () => {
        const reversed = [...flereBekreftelser].reverse() as TilgjengeligBekreftelse[];

        const result = sorterBekreftelser(reversed);

        expect(result[0].bekreftelseId).toBe(flereBekreftelser[0].bekreftelseId);
        expect(result[1].bekreftelseId).toBe(flereBekreftelser[1].bekreftelseId);
        expect(new Date(result[0].gjelderTil).getTime()).toBeLessThan(new Date(result[1].gjelderTil).getTime());
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

        expect(result).toHaveLength(1);
        expect(result[0].bekreftelseId).toBe(flereBekreftelser[0].bekreftelseId);
    });
});
