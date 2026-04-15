'use server';

import { logger } from '@navikt/next-logger';
import { headers } from 'next/headers';
import { authenticatedFetch } from '@/lib/authenticatedFetch';
import kanStartePeriodeMock from '@/lib/mocks/kan-starte-periode.json';
import { tilgangNektetError } from '@/lib/tilgang';
import type { KanStartePeriodeFeil, KanStartePeriodeResult } from '@/model/kan-starte-periode';

const KAN_STARTE_PERIODE_URL = `${process.env.INNGANG_API_URL}/api/v2/arbeidssoker/kanStartePeriode`;
const INNGANG_API_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssokerregisteret-api-inngang/.default`;
const brukerMock = process.env.ENABLE_MOCK === 'enabled';

async function kanStartePeriode(identitetsnummer?: string | null): Promise<KanStartePeriodeResult> {
    if (!identitetsnummer) {
        logger.warn(`Ingen identitetsnummer, ikke mulig å sjekke om periode kan starte`);
        return { ok: false, error: 'Identitetsnummer mangler' };
    }
    if (brukerMock) {
        logger.info(`Mock: sjekke om periode kan starte`);
        const feil = kanStartePeriodeMock as KanStartePeriodeFeil;
        return { ok: false, error: feil.melding, feil };
    }

    if (!KAN_STARTE_PERIODE_URL || !process.env.INNGANG_API_URL) {
        logger.error('Api-url (kan starte periode) er ikke konfigurert');
        return { ok: false, error: 'API URL mangler i konfigurasjon' };
    }

    const result = await authenticatedFetch<Record<string, never>>({
        url: KAN_STARTE_PERIODE_URL,
        scope: INNGANG_API_SCOPE,
        headers: await headers(),
        method: 'PUT',
        body: { identitetsnummer },
    });

    if (!result.ok) {
        const { error, backendError, status } = result;
        if (status === 403) {
            // inngang-api sender 403 både for ekte tilgangsfeil (feilKode: IKKE_TILGANG)
            // og for domene-avvisninger (feilKode: AVVIST, f.eks. UNDER_18_AAR).
            const feil403 =
                backendError?.kind === 'feilV2' ? (backendError.rawBody as KanStartePeriodeFeil) : undefined;
            if (feil403?.feilKode === 'AVVIST' && feil403.aarsakTilAvvisning) {
                logger.warn({
                    message: 'kanStartePeriode ble avvist (403)',
                    event: 'kan_starte_periode_avvist',
                    feilKode: feil403.feilKode,
                });
                return { ok: false, error: feil403.melding, feil: feil403 };
            }
            return tilgangNektetError();
        }
        const feil = backendError?.kind === 'feilV2' ? (backendError.rawBody as KanStartePeriodeFeil) : undefined;

        if (feil) {
            logger.warn({
                message: 'kanStartePeriode ble avvist',
                event: 'kan_starte_periode_avvist',
                feilKode: feil.feilKode,
            });
        }

        return { ok: false, error: error.message, feil };
    }

    logger.info({
        message: 'kanStartePeriode vellykket',
        event: 'kan_starte_periode_ok',
    });

    return { ok: true };
}
export { kanStartePeriode };
