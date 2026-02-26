'use server';

import type { TilgjengeligBekreftelse } from '@navikt/arbeidssokerregisteret-utils';
import { headers } from 'next/headers';
import { authenticatedFetch } from '@/app/lib/authenticatedFetch';

const brukerMock = process.env.ENABLE_MOCK === 'enabled';
const BEKREFTELSER_API_URL = process.env.BEKREFTELSE_API_URL;
const BEKREFTELSE_API_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-api-bekreftelse/.default`;

export type BekreftelseApiResult = {
    bekreftelser: TilgjengeligBekreftelse[] | null;
    error?: Error;
};

async function getBekreftelser(identitetsnummer: string | null): Promise<BekreftelseApiResult> {
    if (!identitetsnummer) {
        return {
            bekreftelser: null,
            error: new Error('Identitetsnummer mangler'),
        };
    }

    if (brukerMock) {
        const { default: bekreftelser } = (await import('@/app/mocks/bekreftelser.json', {
            with: { type: 'json' },
        })) as { default: TilgjengeligBekreftelse[] };
        await new Promise((res) => setTimeout(res, 500));
        return { bekreftelser };
    }

    if (!BEKREFTELSER_API_URL) {
        return { error: new Error('Bekreftelse API URL mangler'), bekreftelser: null };
    }

    const result = await authenticatedFetch<TilgjengeligBekreftelse[]>({
        url: `${BEKREFTELSER_API_URL}/api/v1/tilgjengelige-bekreftelser`,
        scope: BEKREFTELSE_API_SCOPE,
        headers: await headers(),
        method: 'POST',
        body: { identitetsnummer: identitetsnummer },
    });

    if (!result.ok) {
        const { error } = result as { ok: false; error: Error };
        return { bekreftelser: null, error };
    }
    return {
        bekreftelser: result.data,
    };
}

export { getBekreftelser };
