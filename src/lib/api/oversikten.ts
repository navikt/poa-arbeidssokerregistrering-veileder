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
const isDev = process.env.NAIS_CLUSTER_NAME === 'dev-gcp';

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
    if (ident) return { oversikt: null };
    const erNoe = enhetsId === '4154';
    if (!erNoe) return { oversikt: null };
    if (brukerMock || isDev) {
        logger.info('Is localhost or dev, using mock data');
        const { default: oversikt } = (await import('@/lib/mocks/oversikten.json', {
            with: { type: 'json' },
        })) as { default: OversiktType[] };
        return { oversikt };
    }
    return {
        oversikt: null,
    };
}

export { getOversikten };
