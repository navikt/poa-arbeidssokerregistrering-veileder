'use server';

import type { Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { logger } from '@navikt/next-logger';
import { nanoid } from 'nanoid';
import { headers } from 'next/headers';
import { getOboTokenFromRequest } from '../lib/auth/oboToken';
import { hentModiaHeaders } from '../lib/modia-headers';
import { isProblemDetails, type ProblemDetails } from '../lib/types/problem-details';

const brukerMock = process.env.ENABLE_MOCK === 'enabled';
const OPPSLAG_V2_URL = process.env.OPPSLAG_API_V2_URL;
const OPPSLAG_V2_SCOPE = `api://${process.env.NAIS_CLUSTER_NAME}.paw.paw-arbeidssoekerregisteret-api-oppslag-v2/.default`;

async function getPerioder(identitetsnummer: string | null): Promise<{
	perioder: Periode[] | null;
	error?: Error;
}> {
	if (!identitetsnummer) {
		return {
			perioder: null,
			error: new Error('Identitetsnummer mangler'),
		};
	}
	if (brukerMock) {
		const { default: perioder } = (await import('@/app/mocks/perioder.json', {
			with: { type: 'json' },
		})) as { default: Periode[] };
		await new Promise((res) => setTimeout(res, 500));
		return {
			perioder,
		};
	}

	if (!OPPSLAG_V2_URL) {
		return {
			perioder: null,
			error: new Error('url til oppslag v2 mangler'),
		};
	}

	const PERIODER_URL = `${OPPSLAG_V2_URL}/api/v3/perioder?ordering=DESC`;

	const headerList = await headers();
	const oboToken = await getOboTokenFromRequest(headerList, OPPSLAG_V2_SCOPE);

	if (!oboToken.ok) {
		return {
			perioder: null,
			error: new Error('Azure OBO token request failed'),
		};
	}

	const traceId = headerList.get('x-trace-id') ?? nanoid();
	const customNavHeader = hentModiaHeaders(oboToken.token, traceId);

	try {
		const response = await fetch(PERIODER_URL, {
			method: 'POST',
			body: JSON.stringify({
				identitetsnummer: identitetsnummer,
				type: 'IDENTITETSNUMMER',
			}),
			headers: customNavHeader,
		});

		if (!response.ok) {
			let problemDetails: ProblemDetails | null = null;

			try {
				problemDetails = await response.json();
				if (isProblemDetails(problemDetails)) {
					logger.error({
						message: `Feil fra API: ${problemDetails.status} ${problemDetails.title} - ${problemDetails.detail || 'ingen detaljer gitt'}`,
					});
				}
			} catch (_e) {
				// Ignore JSON parse errors
			}
			// - Dersom det ikke er RFC 9457, logg generisk error
			if (!problemDetails) {
				logger.error({
					message: `Feil fra API uten RFC 9457: ${response.status} ${response.statusText}`,
				});
			}
			const errorMsg = problemDetails?.detail
				? `${problemDetails.status} ${problemDetails.title} - ${problemDetails.detail}`
				: `${response.status} ${response.statusText}`;

			return {
				perioder: null,
				error: new Error(errorMsg),
			};
		}

		try {
			return {
				perioder: (await response.json()) as Periode[],
			};
		} catch (_e) {
			return {
				perioder: null,
				error: new Error(`Kunne ikke parse JSON fra responsen APIet`),
			};
		}
	} catch (_e) {
		return {
			perioder: null,
			error: new Error('Noe gikk galt'),
		};
	}
}

export { getPerioder };
