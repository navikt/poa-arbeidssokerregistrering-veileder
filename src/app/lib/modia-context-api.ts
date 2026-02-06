import 'server-only'; // Være ekstra påpasslige her
import { logger } from '@navikt/next-logger';
import { nanoid } from 'nanoid';
import { headers } from 'next/headers';
import type { ModiaContext } from './models';
import { hentModiaHeaders } from './modia-headers';
import { hentOboToken } from './obo-token';

const brukerMock = process.env.ENABLE_MOCK === 'enabled';
const MODIACONTEXTHOLDER_URL = `${process.env.MODIACONTEXTHOLDER_URL}/api/context/`;
const MODIACONTEXTHOLDER_SCOPE = `api://${process.env.MODIACONTEXTHOLDER_AAD_APP_CLIENT_ID}/.default`;
const DEFAULT_RESPONSE: ModiaContext = {
	fnr: undefined,
	enhetId: undefined,
};

async function hentModiaContext(): Promise<ModiaContext> {
	if (brukerMock) {
		return {
			fnr: '01237890',
			enhetId: '123456789',
		};
	}

	const headerList = await headers();
	const bearerToken = headerList.get('authorization')?.replace('Bearer', '');
	// TODO: sjekk om det er noe forskjell på å gjøre det sånn her
	// eller å ta det via req:NextApiRequest (gamlemåten)
	const callId = headerList.get('x-trace-id') ?? nanoid();

	if (!bearerToken) {
		logger.error('Ingen auth header funnet');
		return DEFAULT_RESPONSE;
	}

	try {
		// TODO: Om OBO feiler, så får aldri bruker innhold, burde vi returnert tomt?
		const oboToken = await hentOboToken(bearerToken, MODIACONTEXTHOLDER_SCOPE);
		const modiaHeaders = hentModiaHeaders(oboToken, callId);
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
