'use server';

import type { Bekreftelsesloesning } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { isFeatureEnabledWithContext } from '../unleash/feature-flags';

export type OversiktType = {
    id: number;
    navn: string;
    dagerLedig: number;
    bekreftelsesloesning: Bekreftelsesloesning;
    onskerVeileder: { svar: boolean; dato: string };
    rapportertArbeid: { svar: boolean; dato: string };
};

// const brukerMock = process.env.ENABLE_MOCK === 'enabled';
// const isDev = process.env.NAIS_CLUSTER_NAME === 'dev-gcp';

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
    if (ident || !enhetsId) return { oversikt: null, manglerTilgang: true };

    const erAktivert = await isFeatureEnabledWithContext('arbeidssokerregistrering-for-veileder.oversikten', {
        enhetsId: enhetsId,
    });
    if (!erAktivert) return { oversikt: null, manglerTilgang: true };
    // if (brukerMock || isDev) {
    const { default: oversikt } = (await import('@/lib/mocks/oversikten.json', {
        with: { type: 'json' },
    })) as { default: OversiktType[] };
    return { oversikt };
    // }
    // TODO: hent og returner ekte data - bruker mock frem til endepunkt er på plass
    // return {
    //     oversikt: null,
    // };
}

export { getOversikten };
