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

function isKanStartePeriodeFeil(value: unknown): value is KanStartePeriodeFeil {
    return (
        value !== null &&
        typeof value === 'object' &&
        'melding' in value &&
        typeof (value as KanStartePeriodeFeil).melding === 'string' &&
        'feilKode' in value &&
        typeof (value as KanStartePeriodeFeil).feilKode === 'string'
    );
}

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

    const result = await authenticatedFetch<Record<string, never>, KanStartePeriodeFeil>({
        url: KAN_STARTE_PERIODE_URL,
        scope: INNGANG_API_SCOPE,
        headers: await headers(),
        method: 'PUT',
        body: { identitetsnummer },
    });

    if (!result.ok) {
        const { error, problemDetails, status } = result;
        if (status === 403) {
            // Backend sender 403 både for ekte tilgangsfeil (feilKode: 'IKKE_TILGANG')
            // og for domene-avvisninger (feilKode: 'AVVIST', f.eks. UNDER_18_AAR).
            // Sjekk om bodyen inneholder en strukturert avvisning.
            const feil403 = isKanStartePeriodeFeil(problemDetails) ? problemDetails : undefined;
            if (feil403?.feilKode === 'AVVIST' && feil403.aarsakTilAvvisning) {
                const regler = feil403.aarsakTilAvvisning.regler?.map((r) => r.id);
                logger.warn({
                    message: 'kanStartePeriode ble avvist (403)',
                    event: 'kan_starte_periode_avvist',
                    feilKode: feil403.feilKode,
                });
                return { ok: false, error: feil403.melding, feil: feil403 };
            }
            // Ekte tilgangsfeil — ingen strukturert avvisning
            return tilgangNektetError();
        }
        const feil = isKanStartePeriodeFeil(problemDetails) ? problemDetails : undefined;

        if (feil) {
            const regler = feil.aarsakTilAvvisning?.regler?.map((r) => r.id);
            logger.warn({
                message: 'kanStartePeriode ble avvist',
                event: 'kan_starte_periode_avvist',
                feilKode: feil.feilKode,
            });
        } else {
            logger.warn({
                message: 'kanStartePeriode feilet',
                event: 'kan_starte_periode_avvist',
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
