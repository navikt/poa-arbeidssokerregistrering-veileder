'use server';

import type { TilgjengeligBekreftelse } from '@navikt/arbeidssokerregisteret-utils';
import { logger } from '@navikt/next-logger';
import { headers } from 'next/headers';
import { authenticatedFetch } from '@/lib/authenticatedFetch';
import { sorterBekreftelser } from '@/lib/sorter-bekreftelser';
import { manglerTilgangResult, tilgangNektetError } from '@/lib/tilgang';
import type { ProblemDetails } from '../../model/problem-details';

const brukerMock = process.env.ENABLE_MOCK === 'enabled';
const BEKREFTELSER_API_URL = process.env.BEKREFTELSE_API_URL;
const BEKREFTELSE_API_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-api-bekreftelse/.default`;

export type BekreftelseApiResult = {
    bekreftelser: TilgjengeligBekreftelse[] | null;
    error?: Error;
    manglerTilgang?: boolean;
};

type SendBekreftelseResult = { ok: true } | { ok: false; error?: string; manglerTilgang?: boolean };

async function getBekreftelser(identitetsnummer: string | null): Promise<BekreftelseApiResult> {
    if (!identitetsnummer) {
        logger.warn(`Ingen identitetsnummer, ikke mulig å hente bekreftelser`);
        return {
            bekreftelser: null,
        };
    }

    if (brukerMock) {
        logger.info(`Mock: returnerer hardkodet bekreftelser`);
        const { default: bekreftelser } = (await import('@/lib/mocks/bekreftelser-flere.json', {
            with: { type: 'json' },
        })) as { default: TilgjengeligBekreftelse[] };
        await new Promise((res) => setTimeout(res, 500));
        return { bekreftelser: sorterBekreftelser(bekreftelser) };
    }

    if (!BEKREFTELSER_API_URL) {
        logger.error(`Bekreftelse API URL mangler`);
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
        const { error, status } = result;
        if (status === 403) {
            return manglerTilgangResult('bekreftelser');
        }
        logger.warn({
            message: 'getBekreftelser feilet',
            event: 'hent_bekreftelser_feilet',
        });
        return { bekreftelser: null, error };
    }

    logger.info({
        message: 'getBekreftelser vellykket',
        event: 'hent_bekreftelser_ok',
    });
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
        logger.warn(`Ingen identitetsnummer, ikke mulig å sende bekreftelse`);
        return { ok: false, error: 'Identitetsnummer mangler' };
    }

    if (brukerMock) {
        logger.info(`Mock: sende bekreftelse ${bekreftelseId}`);
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
        const { error, problemDetails, status } = result;
        if (status === 403) {
            return tilgangNektetError();
        }
        const errorMessage = problemDetails?.detail ?? error?.message ?? 'Ukjent feil ved innsending av bekreftelse';
        logger.warn({
            message: 'sendBekreftelse feilet',
            event: 'send_bekreftelse_feilet',
        });
        return { ok: false, error: errorMessage };
    }

    logger.info({
        message: 'sendBekreftelse vellykket',
        event: 'send_bekreftelse_ok',
    });
    return { ok: true };
}

export { getBekreftelser, sendBekreftelse };
