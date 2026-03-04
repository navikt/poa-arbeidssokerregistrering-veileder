'use server';

import { logger } from '@navikt/next-logger';
import { headers } from 'next/headers';
import { authenticatedFetch } from '@/app/lib/authenticatedFetch';

const INNGANG_SLETT_PERIODE_URL = `${process.env.INNGANG_API_URL}/api/v2/arbeidssoker/periode`;
const INNGANG_API_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssokerregisteret-api-inngang/.default`;
const brukerMock = process.env.ENABLE_MOCK === 'enabled';

export type SlettPeriodeResult = { ok: true } | { ok: false; error: string };

async function slettPeriode(identitetsnummer?: string | null): Promise<SlettPeriodeResult> {
    if (!identitetsnummer) {
        return { ok: false, error: 'Mangler identitetsnummer' };
    }
    if (brukerMock) {
        return { ok: true };
    }
    if (!INNGANG_SLETT_PERIODE_URL || !process.env.INNGANG_API_URL) {
        logger.error('Api-url (periode) er ikke konfigurert');
        return { ok: false, error: 'API URL mangler i konfigurasjon' };
    }
    const result = await authenticatedFetch<Record<string, unknown>>({
        url: INNGANG_SLETT_PERIODE_URL,
        scope: INNGANG_API_SCOPE,
        headers: await headers(),
        method: 'PUT',
        body: {
            identitetsnummer,
            periodeTilstand: 'STOPPET',
            feilretting: {
                feilType: 'Feilregistrering',
            },
        },
    });

    if (!result.ok) {
        // TODO. se om vi skal ha mer feilhåndtering her
        // evt problemDetails
        const { error, problemDetails } = result as { ok: false; error: Error; problemDetails?: unknown };
        logger.error(`slett periode kall feilet: ${error.message}`);
        return { ok: false, error: error.message };
    }

    return { ok: true };
}

export { slettPeriode };
