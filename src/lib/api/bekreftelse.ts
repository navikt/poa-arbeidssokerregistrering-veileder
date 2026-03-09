'use server';

import type { TilgjengeligBekreftelse } from '@navikt/arbeidssokerregisteret-utils';
import { logger } from '@navikt/next-logger';
import { headers } from 'next/headers';
import { authenticatedFetch } from '@/lib/authenticatedFetch';
import { sorterBekreftelser } from '@/lib/sorter-bekreftelser';
import type { ProblemDetails } from '../types/problem-details';

const brukerMock = process.env.ENABLE_MOCK === 'enabled';
const BEKREFTELSER_API_URL = process.env.BEKREFTELSE_API_URL;
const BEKREFTELSE_API_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-api-bekreftelse/.default`;

export type BekreftelseApiResult = {
    bekreftelser: TilgjengeligBekreftelse[] | null;
    error?: Error;
};

type SendBekreftelseResult = { ok: true } | { ok: false; error?: string };

async function getBekreftelser(identitetsnummer: string | null): Promise<BekreftelseApiResult> {
    if (!identitetsnummer) {
        return {
            bekreftelser: null,
            error: new Error('Identitetsnummer mangler'),
        };
    }

    if (brukerMock) {
        const { default: bekreftelser } = (await import('@/lib/mocks/bekreftelser-flere.json', {
            with: { type: 'json' },
        })) as { default: TilgjengeligBekreftelse[] };
        await new Promise((res) => setTimeout(res, 500));
        return { bekreftelser: sorterBekreftelser(bekreftelser) };
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
        bekreftelser: sorterBekreftelser(result.data),
    };
}

async function sendBekreftelse({
    identitetsnummer,
    bekreftelseId,
    harJobbetIDennePerioden,
    vilFortsetteSomArbeidssoeker,
}: {
    identitetsnummer: string | null;
    bekreftelseId: string;
    harJobbetIDennePerioden: boolean;
    vilFortsetteSomArbeidssoeker: boolean;
}): Promise<SendBekreftelseResult> {
    if (!identitetsnummer) {
        return { ok: false, error: 'Identitetsnummer mangler' };
    }

    if (brukerMock) {
        await new Promise((res) => setTimeout(res, 500));
        return { ok: true };
    }

    if (!BEKREFTELSER_API_URL) {
        logger.error('Bekreftelse api url mangler');
        return { ok: false, error: 'Bekreftelse API URL mangler' };
    }

    const result = await authenticatedFetch<void, ProblemDetails>({
        url: `${BEKREFTELSER_API_URL}/api/v1/bekreftelse`,
        scope: BEKREFTELSE_API_SCOPE,
        headers: await headers(),
        method: 'POST',
        body: {
            identitetsnummer,
            bekreftelseId,
            harJobbetIDennePerioden,
            vilFortsetteSomArbeidssoeker,
        },
    });

    if (!result.ok) {
        const { error, problemDetails } = result as { ok: false; error: Error; problemDetails?: ProblemDetails };
        const errorMessage = problemDetails?.detail ?? error?.message ?? 'Ukjent feil ved innsending av bekreftelse';
        logger.error({ message: `Feil ved innsending av bekreftelse: ${errorMessage}` });
        return { ok: false, error: errorMessage };
    }

    return { ok: true };
}

export { getBekreftelser, sendBekreftelse };
