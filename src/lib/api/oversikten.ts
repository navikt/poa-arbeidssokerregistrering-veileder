'use server';

import type { Bekreftelsesloesning } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { logger } from '@navikt/next-logger';

export type OversiktType = {
    id: number;
    navn: string;
    dagerLedig: number;
    bekreftelsesloesning: Bekreftelsesloesning;
    onskerVeileder: { svar: boolean; dato: string };
    rapportertArbeid: { svar: boolean; dato: string };
};

const brukerMock = process.env.ENABLE_MOCK === 'enabled';

export type OversiktenApiResult = {
    oversikt: OversiktType[] | null;
    error?: Error;
    manglerTilgang?: boolean;
};

/**
 *
 * @param enhetsId siden denne kan bli satt/endret på klienten uten av det
 * gjøres en refresh, så må den komme som param fremfor at vi selv henter
 * modia-context inne i getOversikten
 * @returns
 */
async function getOversikten(ident: string | null, enhetsId: string | null): Promise<OversiktenApiResult> {
    // Dersom ident finnes, så er vi ikke liste-modus, og skal uansett ikke vise noe data.
    if (ident) return { oversikt: null };
    // TODO: Trenger vi å finne ut hvilken veileder du er her? Evt lage en noe sjekk?
    const erVeileder = true;
    const erNoe = enhetsId === '4154';
    if (!erVeileder || !erNoe) return { oversikt: null };
    // if (brukerMock) {
    logger.info('brukerMock er aktiv, henter mockdata');
    const { default: oversikt } = (await import('@/lib/mocks/oversikten.json', {
        with: { type: 'json' },
    })) as { default: OversiktType[] };
    return { oversikt };
    // }
    // return {
    // oversikt: null,
    // };
}

export { getOversikten };
