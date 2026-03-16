'use server';

import { logger } from '@navikt/next-logger';
import { headers } from 'next/headers';
import { authenticatedFetch } from '@/lib/authenticatedFetch';
import byggOpplysningerPayload from '@/lib/bygg-opplysninger-payload';
import type { RegistreringState } from '@/model/registrering';

/**
 * Server action for POST /api/v1/arbeidssoker/opplysninger
 * Mapper skjema-state til API-format via byggOpplysningerPayload, håndterer OBO-auth via authenticatedFetch.
 */

const INNGANG_OPPLYSNINGER_URL = `${process.env.OPPLYSNINGER_API_URL}/api/v1/arbeidssoker/opplysninger`;
const OPPLYSNINGER_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssokerregisteret-api-inngang/.default`;
const brukerMock = process.env.ENABLE_MOCK === 'enabled';

type OpplysningerResult =
    | {
          ok: true;
      }
    | {
          ok: false;
          error: string;
          feilKode?: string;
      };

async function registrerOpplysninger(
    identitetsnummer: string | undefined,
    skjemaState: RegistreringState,
): Promise<OpplysningerResult> {
    if (!identitetsnummer) {
        logger.warn('registrerOpplysninger kalt uten identitetsnummer');
        return { ok: false, error: 'Identitetsnummer mangler' };
    }

    const { opplysningerOmArbeidssoeker } = byggOpplysningerPayload(skjemaState);

    const requestBody = {
        identitetsnummer,
        opplysningerOmArbeidssoeker,
    };

    if (brukerMock) {
        logger.info('registrerOpplysninger: bruker mock — returnerer ok');
        await new Promise((res) => setTimeout(res, 500));
        return { ok: true };
    }

    if (!INNGANG_OPPLYSNINGER_URL) {
        logger.error('OPPLYSNINGER_API_URL er ikke konfigurert');
        return { ok: false, error: 'Opplysninger API URL mangler i konfigurasjon' };
    }

    const result = await authenticatedFetch<Record<string, unknown>>({
        url: INNGANG_OPPLYSNINGER_URL,
        scope: OPPLYSNINGER_SCOPE,
        headers: await headers(),
        method: 'POST',
        body: requestBody,
    });

    if (!result.ok) {
        // TODO: FIX THIS, må sette riktig feiltype i authfetch
        const { error } = result as { ok: false; error: Error };
        logger.warn({
            message: 'registrerOpplysninger feilet',
            event: 'registrer_opplysninger_feilet',
        });
        return { ok: false, error: error.message };
    }

    logger.info({
        message: 'registrerOpplysninger vellykket',
        event: 'registrer_opplysninger_ok',
    });
    return { ok: true };
}

export { registrerOpplysninger };
