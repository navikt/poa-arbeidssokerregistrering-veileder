import 'server-only'; // Være ekstra påpasslige her
import { logger } from '@navikt/next-logger';
import { nanoid } from 'nanoid';
import { headers } from 'next/headers';
import { getOboTokenFromRequest } from './auth/oboToken';
import type { ModiaContext } from './models';
import { hentModiaHeaders } from './modia-headers';

const brukerMock = process.env.ENABLE_MOCK === 'enabled';
const MODIACONTEXTHOLDER_URL = `${process.env.MODIACONTEXTHOLDER_URL}/api/context/`;
const MODIACONTEXTHOLDER_SCOPE = `api://${process.env.MODIACONTEXTHOLDER_AAD_APP_CLIENT_ID}/.default`;
const DEFAULT_RESPONSE: ModiaContext = {
	fnr: null,
	enhetId: null,
};

async function hentModiaContext(): Promise<ModiaContext> {
	if (brukerMock) {
		return {
			fnr: '01237890',
			enhetId: '123456789',
		};
	}

	const headerList = await headers();
	const callId = headerList.get('x-trace-id') ?? nanoid();
	const oboToken = await getOboTokenFromRequest(headerList, MODIACONTEXTHOLDER_SCOPE);
	if (!oboToken.ok) {
		const { error } = oboToken as { ok: false; error: Error };
		logger.error(`${error}`);
		return DEFAULT_RESPONSE;
	}

	try {
		const modiaHeaders = hentModiaHeaders(oboToken.token, callId);
		const response = await fetch(MODIACONTEXTHOLDER_URL, {
			method: 'GET',
			headers: modiaHeaders,
		});

		if (!response.ok) {
			logger.error(`Klarte ikke å hente modia context. Status: ${response.status}, ${response.statusText}`);
			return DEFAULT_RESPONSE;
		}
		try {
			// return response.json();
			const data = await response.json();
			return {
				fnr: data.aktivBruker,
				enhetId: data.enhetId,
			};
		} catch (error) {
			logger.info(`Klarte ikke parse JSON fra responsen. ${error}`);
			return DEFAULT_RESPONSE;
		}
	} catch (e) {
		logger.error(e);
		return DEFAULT_RESPONSE;
	}
}

export { hentModiaContext };
