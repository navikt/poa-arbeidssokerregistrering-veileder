'use server';

import { logger } from '@navikt/next-logger';
import { headers } from 'next/headers';
import { authenticatedFetch } from '@/lib/authenticatedFetch';
import type { PeriodeFeil, PeriodeResult, StartStoppPeriodeRequest } from '@/model/inngang-periode';

const INNGANG_SLETT_PERIODE_URL = `${process.env.INNGANG_API_URL}/api/v2/arbeidssoker/periode`;
const INNGANG_API_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssokerregisteret-api-inngang/.default`;
const brukerMock = process.env.ENABLE_MOCK === 'enabled';

async function stoppPeriode(identitetsnummer?: string | null): Promise<PeriodeResult> {
    if (!identitetsnummer) {
        logger.warn('Mangler identitetsnummer, kan ikke stoppe periode');
        return { ok: false, error: 'Mangler identitetsnummer' };
    }
    if (brukerMock) {
        logger.info(`Mock: stopper periode`);
        return { ok: true };
    }
    if (!INNGANG_SLETT_PERIODE_URL || !process.env.INNGANG_API_URL) {
        logger.error('Api-url (stopp-periode) er ikke konfigurert');
        return { ok: false, error: 'API URL mangler i konfigurasjon' };
    }

    const body: StartStoppPeriodeRequest = {
        identitetsnummer,
        periodeTilstand: 'STOPPET',
    };

    const result = await authenticatedFetch<Record<string, never>, PeriodeFeil>({
        url: INNGANG_SLETT_PERIODE_URL,
        scope: INNGANG_API_SCOPE,
        headers: await headers(),
        method: 'PUT',
        body,
    });

    if (!result.ok) {
        const { error, problemDetails } = result;
        logger.warn({
            message: 'stoppPeriode feilet',
            event: 'stopp_periode_feilet',
        });
        return { ok: false, error: error.message, feil: problemDetails };
    }

    logger.info({
        message: 'stoppPeriode vellykket',
        event: 'stopp_periode_ok',
    });
    return { ok: true };
}

export { stoppPeriode };
