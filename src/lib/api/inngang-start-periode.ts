'use server';

import { logger } from '@navikt/next-logger';
import { headers } from 'next/headers';
import { authenticatedFetch } from '@/lib/authenticatedFetch';
import { tilgangNektetError } from '@/lib/tilgang';
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
        const { error, problemDetails, status } = result;

        if (status === 403) {
            // Backend sender 403 både for ekte tilgangsfeil (feilKode: 'IKKE_TILGANG')
            // og for domene-avvisninger (feilKode: 'AVVIST', f.eks. UNDER_18_AAR).
            // Sjekk om bodyen inneholder en strukturert avvisning.
            if (
                problemDetails &&
                'feilKode' in problemDetails &&
                problemDetails.feilKode === 'AVVIST' &&
                problemDetails.aarsakTilAvvisning
            ) {
                logger.warn({
                    message: 'start periode ble avvist (403)',
                    event: erForhandsgodkjent ? 'start_periode_avvist_forhandsgodkjent' : 'start_periode_avvist',
                    feilKode: problemDetails.feilKode,
                });
                const errorMessage = problemDetails.melding
                    ? `${problemDetails.feilKode}: ${problemDetails.melding}`
                    : error.message;
                return { ok: false, error: errorMessage, feil: problemDetails };
            }
            // Ekte tilgangsfeil — ingen strukturert avvisning
            return tilgangNektetError();
        }

        const regler = problemDetails?.aarsakTilAvvisning?.regler?.map((r) => r.id);

        if (regler?.length) {
            logger.warn({
                message: 'start periode ble avvist',
                event: erForhandsgodkjent ? 'start_periode_avvist_forhandsgodkjent' : 'start_periode_avvist',
                feilKode: problemDetails?.feilKode,
                avvisningsRegler: regler,
            });
        }

        const errorMessage = problemDetails?.melding
            ? `${problemDetails.feilKode}: ${problemDetails.melding}`
            : error.message;

        logger.warn({
            message: 'startPeriode feilet',
            event: erForhandsgodkjent ? 'start_periode_feilet_forhandsgodkjent' : 'start_periode_feilet',
        });

        return { ok: false, error: errorMessage, feil: problemDetails };
    }

    logger.info({
        message: 'startPeriode vellykket',
        event: erForhandsgodkjent ? 'start_periode_ok_forhandsgodkjent' : 'start_periode_ok',
    });

    return { ok: true };
}

export { startPeriode };
