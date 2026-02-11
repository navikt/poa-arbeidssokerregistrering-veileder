import 'server-only';
import { logger } from '@navikt/next-logger';
import { getToken, requestAzureOboToken, validateAzureToken } from '@navikt/oasis';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { validateToken } from './validateToken';

const brukerMock = process.env.ENABLE_MOCK === 'enabled';

type OboTokenSuccess = { ok: true; token: string };
type OboTokenFailure = { ok: false; error: Error };
type OboTokenResult = OboTokenSuccess | OboTokenFailure;

async function getOboTokenFromRequest(headerList: Headers | ReadonlyHeaders, scope: string): Promise<OboTokenResult> {
	if (brukerMock) {
		return {
			ok: true,
			token: 'mocked-token',
		};
	}
	if (!headerList) {
		return {
			ok: false,
			error: new Error('Ingen token funnet'),
		};
	}

	const incommingToken = getToken(headerList);
	if (!incommingToken) {
		return {
			ok: false,
			error: new Error('Ingen token funnet'),
		};
	}
	const validation = await validateToken(incommingToken);
	if (!validation.ok) {
		logger.info('Ugyldig token');
		return {
			ok: false,
			error: new Error('Ugyldig token'),
		};
	}

	const result = await requestAzureOboToken(incommingToken, scope);
	if (!result.ok) {
		logger.error(`Tokenutveksling feilet for ${scope}`);
		return {
			ok: false,
			error: new Error(`Tokenutveksling feilet for OBO med følgende scope: ${scope}`),
		};
	}
	return {
		ok: true,
		token: result.token,
	};
}

export { getOboTokenFromRequest };
export type { OboTokenResult };
