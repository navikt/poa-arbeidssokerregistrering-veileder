'use server';

import { logger } from '@navikt/next-logger';
import { headers } from 'next/headers';
import { authenticatedFetch } from '@/lib/authenticatedFetch';
import type { PeriodeFeil, PeriodeResult, StartStoppPeriodeRequest } from '@/model/inngang-periode';

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
        const { error, status, problemDetails } = result;

        logger.error({
            message: 'start periode kall feilet',
            httpStatus: status,
            errorMessage: error.message,
            feilKode: problemDetails?.feilKode,
            melding: problemDetails?.melding,
            avvisningsRegler: problemDetails?.aarsakTilAvvisning?.regler?.map((r) => r.id),
            avvisningsDetaljer: problemDetails?.aarsakTilAvvisning?.detaljer,
        });

        const errorMessage = problemDetails?.melding
            ? `${problemDetails.feilKode}: ${problemDetails.melding}`
            : error.message;

        return { ok: false, error: errorMessage, feil: problemDetails };
    }

    return { ok: true };
}

export { startPeriode };
