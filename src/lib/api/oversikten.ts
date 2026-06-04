'use server';

import type { Bekreftelsesloesning } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { logger } from '@navikt/next-logger';
import { isFeatureEnabledWithContext } from '../unleash/feature-flags';

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
    if (ident || !enhetsId) {
        return { oversikt: null, manglerTilgang: true };
    }

    if (brukerMock) {
        const { default: oversikt } = (await import('@/lib/mocks/oversikten.json', {
            with: { type: 'json' },
        })) as { default: OversiktType[] };
        return { oversikt };
    }

    const erAktivert = await isFeatureEnabledWithContext('arbeidssokerregistrering-for-veileder.oversikten', {
        enhetsId: enhetsId,
    });
    if (!erAktivert) return { oversikt: null, manglerTilgang: true };
    logger.info({ enhetsId }, 'arbeidssokerregistrering-for-veileder.oversikten');
    const { default: oversikt } = (await import('@/lib/mocks/oversikten.json', {
        with: { type: 'json' },
    })) as { default: OversiktType[] };
    return { oversikt };
}

export { getOversikten };
