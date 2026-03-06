'use server';

import type { Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { headers } from 'next/headers';
import { authenticatedFetch } from '@/app/lib/authenticatedFetch';

const brukerMock = process.env.ENABLE_MOCK === 'enabled';
const OPPSLAG_V2_URL = process.env.OPPSLAG_API_V2_URL;
const OPPSLAG_V2_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-api-oppslag-v2/.default`;

export type PeriodeResult = { perioder: Periode[] | null; error?: Error };

async function getPerioder(identitetsnummer: string | null): Promise<PeriodeResult> {
    if (!identitetsnummer) {
        return { perioder: null, error: new Error('Identitetsnummer mangler') };
    }
    if (brukerMock) {
        const { default: perioder } = (await import('@/app/mocks/perioder.json', {
            with: { type: 'json' },
        })) as { default: Periode[] };
        await new Promise((res) => setTimeout(res, 500));
        return { perioder };
    }

    if (!OPPSLAG_V2_URL) {
        return { perioder: null, error: new Error('url til oppslag v2 mangler') };
    }

    const PERIODER_URL = `${OPPSLAG_V2_URL}/api/v3/perioder?ordering=DESC`;

    const result = await authenticatedFetch<Periode[]>({
        url: PERIODER_URL,
        scope: OPPSLAG_V2_SCOPE,
        headers: await headers(),
        method: 'POST',
        body: { identitetsnummer: identitetsnummer, type: 'IDENTITETSNUMMER' },
    });

    if (!result.ok) {
        const { error } = result as { ok: false; error: Error };
        return { perioder: null, error };
    }
    return {
        perioder: result.data,
    };
}

export { getPerioder };
