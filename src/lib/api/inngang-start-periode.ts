'use server';

import { logger } from '@navikt/next-logger';
import { headers } from 'next/headers';
import { authenticatedFetch } from '@/lib/authenticatedFetch';
import type { PeriodeFeil, PeriodeResult, StartStoppPeriodeRequest } from '@/lib/models/inngang-periode';

const INNGANG_API_URL = `${process.env.INNGANG_API_URL}/api/v2/arbeidssoker/periode`;
const INNGANG_API_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssokerregisteret-api-inngang/.default`;
const brukerMock = process.env.ENABLE_MOCK === 'enabled';

async function startPeriode(
    identitetsnummer?: string | null,
    erForhandsgodkjent: boolean = false,
): Promise<PeriodeResult> {
    if (!identitetsnummer) {
        return { ok: false, error: 'Mangler identitetsnummer' };
    }
    if (brukerMock) {
        return { ok: true };
    }
    if (!INNGANG_API_URL || !process.env.INNGANG_API_URL) {
        logger.error('Api-url (periode) er ikke konfigurert');
        return { ok: false, error: 'API URL mangler i konfigurasjon' };
    }

    const body: StartStoppPeriodeRequest = {
        identitetsnummer,
        periodeTilstand: 'STARTET',
        registreringForhaandsGodkjentAvAnsatt: erForhandsgodkjent,
    };

    const result = await authenticatedFetch<Record<string, never>, PeriodeFeil>({
        url: INNGANG_API_URL,
        scope: INNGANG_API_SCOPE,
        headers: await headers(),
        method: 'PUT',
        body,
    });

    if (!result.ok) {
        const { error, problemDetails } = result as { ok: false; error: Error; problemDetails?: PeriodeFeil };
        logger.error(`start periode kall feilet: ${error.message}`);
        return { ok: false, error: error.message, feil: problemDetails };
    }

    return { ok: true };
}

export { startPeriode };
