'use server';

import type { Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { logger } from '@navikt/next-logger';
import { headers } from 'next/headers';
import { authenticatedFetch } from '@/lib/authenticatedFetch';
import { manglerTilgangResult } from '@/lib/tilgang';

const brukerMock = process.env.ENABLE_MOCK === 'enabled';
const OPPSLAG_V2_URL = process.env.OPPSLAG_API_V2_URL;
const OPPSLAG_V2_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-api-oppslag-v2/.default`;

export type PeriodeResult = { perioder: Periode[] | null; error?: Error; manglerTilgang?: boolean };

async function getPerioder(identitetsnummer: string | null): Promise<PeriodeResult> {
    if (!identitetsnummer) {
        logger.warn(`Ingen identitetsnummer, ikke mulig å hente perioder`);
        return { perioder: null };
    }
    if (brukerMock) {
        logger.info(`BrukerMock er aktiv, henter perioder fra mock`);
        const { default: perioder } = (await import('@/lib/mocks/perioder.json', {
            with: { type: 'json' },
        })) as { default: Periode[] };
        await new Promise((res) => setTimeout(res, 500));
        return { perioder };
    }

    if (!OPPSLAG_V2_URL) {
        logger.error(`Url til oppslag v2 mangler, ikke mulig å hente perioder`);
        return { perioder: null, error: new Error('url til oppslag v2 mangler') };
    }

    const PERIODER_URL = `${OPPSLAG_V2_URL}/api/v3/perioder?ordering=DESC`;

    const result = await authenticatedFetch<Periode[]>({
        url: PERIODER_URL,
        scope: OPPSLAG_V2_SCOPE,
        headers: await headers(),
        method: 'POST',
        body: { identitetsnummer: identitetsnummer, type: 'IDENTITETSNUMMER' },
    });

    if (!result.ok) {
        const { error, status } = result;
        if (status === 403) {
            return manglerTilgangResult('perioder');
        }
        logger.warn({
            message: 'getPerioder feilet',
            event: 'hent_perioder_feilet',
        });
        return { perioder: null, error };
    }

    logger.info({
        message: 'getPerioder vellykket',
        event: 'hent_perioder_ok',
    });
    return {
        perioder: result.data,
    };
}

export { getPerioder };
