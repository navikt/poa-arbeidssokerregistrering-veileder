'use server';

import { logger } from '@navikt/next-logger';
import { headers } from 'next/headers';
import type { ApiPaging, Arbeidssoker, OversiktApiResponse, OversiktenPayload } from '@/model/oversikt-api';
import { authenticatedFetch } from '../authenticatedFetch';
import { isFeatureEnabledWithContext } from '../unleash/feature-flags';

const brukerMock = process.env.ENABLE_MOCK === 'enabled';
const isProd = process.env.NAIS_CLUSTER_NAME === 'prod-gcp';

export type OversiktenApiResult = {
    arbeidssoekere: Arbeidssoker[];
    paging?: ApiPaging;
    error?: Error;
    manglerTilgang?: boolean;
};

async function hentMockData(): Promise<OversiktApiResponse> {
    return (await import('@/lib/mocks/oversikten.json')).default as unknown as OversiktApiResponse;
}

/**
 * Hvem skal se hva?
 * - lokalt viser vi statisk mock data
 * - i dev bruker vi unleash og ekte api data
 * - i prod bruker vi unleash og mock data (kun kontor 4154 i starten)
 */
const OVERSIKT_API_URL = process.env.OVERSIKT_API_URL;
const OVERSIKT_API_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-api-oversikt/.default`;

async function getOversikten(ident: string | null, enhetsId: string | null): Promise<OversiktenApiResult | null> {
    // Oversikten gjelder kun enhetsnivå – ikke ved person-kontekst.
    if (ident || !enhetsId) {
        return null;
    }

    // Lokalt: alltid vis mock uten feature flag-sjekk
    if (brukerMock) {
        return hentMockData();
    }

    // Dev og prod: sjekk feature flag
    const erAktivert = await isFeatureEnabledWithContext('arbeidssokerregistrering-for-veileder.oversikten', {
        enhetsId,
    });

    if (!erAktivert) {
        return null;
    }

    logger.info({ enhetsId, event: 'oversikten_aktivert' }, 'Oversikten er aktivert for kontor');

    // Prod: bruk mock data inntil videre (kun kontor 4154 i starten)
    if (isProd && erAktivert) {
        return hentMockData();
    }

    // Dev: hent fra ekte API
    if (!OVERSIKT_API_URL) {
        logger.error('Feil ved henting av oversikt api url');
        return {
            arbeidssoekere: [],
            error: new Error('Klarte ikke å hente oversikt api url'),
        };
    }

    const result = await authenticatedFetch<OversiktApiResponse, OversiktenPayload>({
        url: `${OVERSIKT_API_URL}/api/v1/oversikt`,
        scope: OVERSIKT_API_SCOPE,
        headers: await headers(),
        method: 'POST',
        body: {
            type: 'TILKNYTTET_KONTOR',
            kontorId: enhetsId,
            paging: {
                page: 1,
                pageSize: 10,
                sortOrder: 'ASC',
            },
        },
    });
    if (!result.ok) {
        logger.error({ event: 'oversikt_feil', httpStatus: result.status }, 'Feil ved henting av oversikt');
        return { arbeidssoekere: [], error: result.error };
    }
    return result.data;
}

export { getOversikten };
