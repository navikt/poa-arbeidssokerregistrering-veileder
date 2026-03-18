'use server';

import type { Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { logger } from '@navikt/next-logger';
import { headers } from 'next/headers';
import { authenticatedFetch } from '@/lib/authenticatedFetch';
import { manglerTilgangResult } from '@/lib/tilgang';

export type SnapshotResult = {
    snapshot: Snapshot | null;
    error?: Error;
    notFound?: boolean;
    manglerTilgang?: boolean;
};

const brukerMock = process.env.ENABLE_MOCK === 'enabled';
const OPPSLAG_V2_URL = process.env.OPPSLAG_API_V2_URL;
const OPPSLAG_V2_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-api-oppslag-v2/.default`;

async function getSnapshot(identitetsnummer: string | null): Promise<SnapshotResult> {
    if (!identitetsnummer) {
        logger.warn('identitetsnummer mangler, kan ikke hente snapshot');
        return { snapshot: null };
    }
    if (brukerMock) {
        const { default: snapshot } = (await import('@/lib/mocks/snapshot.json', {
            with: { type: 'json' },
        })) as { default: Snapshot };
        await new Promise((res) => setTimeout(res, 500));
        return { snapshot };
    }

    if (!OPPSLAG_V2_URL) {
        logger.error('url til oppslag v2 mangler');
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
        const { error, problemDetails, status } = result;
        if (status === 403) {
            return manglerTilgangResult('snapshot');
        }
        if (problemDetails?.type === 'urn:paw:perioder:periode-ikke-funnet' || status === 404) {
            logger.info({
                message: 'getSnapshot: periode ikke funnet',
                event: 'hent_snapshot_ikke_funnet',
            });
            return {
                snapshot: null,
                notFound: true,
            };
        }
        logger.warn({
            message: 'getSnapshot feilet',
            event: 'hent_snapshot_feilet',
        });
        return { snapshot: null, error };
    }

    logger.info({
        message: 'getSnapshot vellykket',
        event: 'hent_snapshot_ok',
    });
    return {
        snapshot: result.data,
    };
}

export { getSnapshot };
