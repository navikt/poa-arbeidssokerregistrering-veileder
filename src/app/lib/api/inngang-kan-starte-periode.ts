'use server';

import { logger } from '@navikt/next-logger';
import { headers } from 'next/headers';
import { authenticatedFetch } from '@/app/lib/authenticatedFetch';
import type { KanStartePeriodeFeil, KanStartePeriodeResult } from '@/app/lib/models/kan-starte-periode';
import kanStartePeriodeMock from '@/app/mocks/kan-starte-periode.json';

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
        return { ok: false, error: 'Identitetsnummer mangler' };
    }
    if (brukerMock) {
        const feil = kanStartePeriodeMock as KanStartePeriodeFeil;
        return { ok: false, error: feil.melding, feil };
    }

    if (!KAN_STARTE_PERIODE_URL || !process.env.INNGANG_API_URL) {
        logger.error('Api-url (kan starte periode) er ikke konfigurert');
        return { ok: false, error: 'API URL mangler i konfigurasjon' };
    }

    const result = await authenticatedFetch<Record<string, unknown>>({
        url: KAN_STARTE_PERIODE_URL,
        scope: INNGANG_API_SCOPE,
        headers: await headers(),
        method: 'PUT',
        body: { identitetsnummer },
    });

    if (!result.ok) {
        const { error, problemDetails } = result as { ok: false; error: Error; problemDetails?: unknown };
        logger.error(`kanStartePeriode kall feilet: ${error.message}`);

        const feil = isKanStartePeriodeFeil(problemDetails) ? problemDetails : undefined;

        return { ok: false, error: error.message, feil };
    }

    return { ok: true };
}
export { kanStartePeriode };
