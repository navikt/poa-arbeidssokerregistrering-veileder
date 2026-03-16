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
        logger.warn('Mangler identitetsnummer, kan ikke starte periode');
        return { ok: false, error: 'Mangler identitetsnummer' };
    }
    if (brukerMock) {
        logger.info(`Mock: starter periode`);
        return { ok: true };
    }
    if (!INNGANG_API_URL || !process.env.INNGANG_API_URL) {
        logger.error('Api-url (start-periode) er ikke konfigurert');
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
        const { error, problemDetails } = result;

        const regler = problemDetails?.aarsakTilAvvisning?.regler?.map((r) => r.id);
        const detaljer = problemDetails?.aarsakTilAvvisning?.detaljer;

        if (regler?.length || detaljer?.length) {
            logger.warn({
                message: 'start periode ble avvist',
                event: 'start_periode_avvist',
                feilKode: problemDetails?.feilKode,
                avvisningsRegler: regler,
                avvisningsDetaljer: detaljer,
            });
        }

        const errorMessage = problemDetails?.melding
            ? `${problemDetails.feilKode}: ${problemDetails.melding}`
            : error.message;

        logger.warn({
            message: 'startPeriode feilet',
            event: 'start_periode_feilet',
        });

        return { ok: false, error: errorMessage, feil: problemDetails };
    }

    logger.info({
        message: 'startPeriode vellykket',
        event: 'start_periode_ok',
    });

    return { ok: true };
}

export { startPeriode };
