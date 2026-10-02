'use server';

import { logger } from '@navikt/next-logger';
import { headers } from 'next/headers';
import { authenticatedFetch } from '@/lib/authenticatedFetch';
import type {
    ApiPaging,
    ArbeidssokerKompakt,
    KartleggingApiKompaktResponse,
    KartleggingPayload,
} from '@/model/kartlegging-api';

const brukerMock = process.env.ENABLE_MOCK === 'enabled';

export type KartleggingApiKompaktResult = {
    arbeidssoekere: ArbeidssokerKompakt[];
    paging?: ApiPaging;
    error?: Error;
    manglerTilgang?: boolean;
};

async function hentMockData(): Promise<KartleggingApiKompaktResponse> {
    return (await import('@/lib/mocks/kartlegging-enkeltperson.json', { with: { type: 'json' } }))
        .default as unknown as KartleggingApiKompaktResponse;
}

const KARTLEGGING_API_URL = process.env.KARTLEGGING_API_URL;
const KARTLEGGING_API_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-api-kartlegging/.default`;

async function getKartleggingForEnkeltperson(identitetsnummer: string | null): Promise<KartleggingApiKompaktResult | null> {
    if (!identitetsnummer) {
        return null;
    }

    if (brukerMock) {
        return hentMockData();
    }

    if (!KARTLEGGING_API_URL) {
        logger.error('Feil ved henting av kartlegging api url');
        return {
            arbeidssoekere: [],
            error: new Error('Klarte ikke å hente kartlegging api url'),
        };
    }

    const result = await authenticatedFetch<KartleggingApiKompaktResponse, KartleggingPayload>({
        url: `${KARTLEGGING_API_URL}/api/v1/arbeidsledighet`,
        scope: KARTLEGGING_API_SCOPE,
        headers: await headers(),
        method: 'POST',
        body: {
            type: 'IDENTITETSNUMMER',
            identitetsnummer: identitetsnummer,
        },
    });

    if (!result.ok) {
        logger.error({ event: 'kartlegging_feil', httpStatus: result.status }, 'Feil ved henting av kartlegging for person');
        return { arbeidssoekere: [], error: result.error };
    }

    logger.info({ event: 'kartlegging_suksess' }, 'Kartleggingdata for person er hentet');

    return result.data;
}

export { getKartleggingForEnkeltperson };
