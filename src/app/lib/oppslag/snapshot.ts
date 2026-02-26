'use server';

import type { Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { headers } from 'next/headers';
import { authenticatedFetch } from '../authenticatedFetch';
import type { ProblemDetails } from '../types/problem-details';

export type SnapshotResult = {
    snapshot: Snapshot | null;
    error?: Error;
    notFound?: boolean;
};

const brukerMock = process.env.ENABLE_MOCK === 'enabled';
const OPPSLAG_V2_URL = process.env.OPPSLAG_API_V2_URL;
const OPPSLAG_V2_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-api-oppslag-v2/.default`;

async function getSnapshot(identitetsnummer: string | null): Promise<SnapshotResult> {
    if (!identitetsnummer) {
        return { snapshot: null, error: new Error('Identitetsnummer mangler') };
    }
    if (brukerMock) {
        const { default: snapshot } = (await import('@/app/mocks/snapshot.json', {
            with: { type: 'json' },
        })) as { default: Snapshot };
        await new Promise((res) => setTimeout(res, 500));
        return { snapshot };
    }

    if (!OPPSLAG_V2_URL) {
        return { snapshot: null, error: new Error('url til oppslag v2 mangler') };
    }

    const SNAPSHOT_URL = `${OPPSLAG_V2_URL}/api/v3/snapshot`;

    const result = await authenticatedFetch<Snapshot>({
        url: SNAPSHOT_URL,
        scope: OPPSLAG_V2_SCOPE,
        headers: await headers(),
        method: 'POST',
        body: { identitetsnummer: identitetsnummer, type: 'IDENTITETSNUMMER' },
    });

    if (!result.ok) {
        const { error, problemDetails } = result as { ok: false; error: Error; problemDetails?: ProblemDetails };
        if (problemDetails?.type === 'urn:paw:perioder:periode-ikke-funnet') {
            return {
                snapshot: null,
                notFound: true,
            };
        }
        return { snapshot: null, error };
    }
    return {
        snapshot: result.data,
    };
}

export { getSnapshot };
