'use server';

import { logger } from '@navikt/next-logger';
import { headers } from 'next/headers';
import { authenticatedFetch } from '@/lib/authenticatedFetch';
import type { PeriodeFeil, PeriodeResult, StartStoppPeriodeRequest } from '@/model/inngang-periode';

const INNGANG_SLETT_PERIODE_URL = `${process.env.INNGANG_API_URL}/api/v2/arbeidssoker/periode`;
const INNGANG_API_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssokerregisteret-api-inngang/.default`;
const brukerMock = process.env.ENABLE_MOCK === 'enabled';

async function slettPeriode(identitetsnummer?: string | null): Promise<PeriodeResult> {
    if (!identitetsnummer) {
        logger.warn(`Ingen identitetsnummer, ikke mulig å slette periode`);
        return { ok: false, error: 'Mangler identitetsnummer' };
    }
    if (brukerMock) {
        logger.info(`Mock: sletter periode`);
        return { ok: true };
    }
    if (!INNGANG_SLETT_PERIODE_URL || !process.env.INNGANG_API_URL) {
        logger.error('URL for slett-url-api er ikke konfigurert');
        return { ok: false, error: 'API URL mangler i konfigurasjon' };
    }
    const body: StartStoppPeriodeRequest = {
        identitetsnummer,
        periodeTilstand: 'STOPPET',
        feilretting: {
            feilType: 'Feilregistrering',
        },
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
        return { ok: false, error: error.message, feil: problemDetails };
    }

    return { ok: true };
}

export { slettPeriode };
