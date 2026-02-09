import 'server-only';
import { validateAzureToken } from '@navikt/oasis';

/**
 * Validation of Azure token
 */
const brukerMock = process.env.ENABLE_MOCK === 'enabled';
type TokenValidationSuccess = { ok: true };
type TokenValidationFailure = {
	ok: false;
	errorType: 'missing-token' | 'token expired' | 'unknown';
	error: Error;
};

export type TokenValidationResult = TokenValidationSuccess | TokenValidationFailure;

async function validateToken(bearerToken: string): Promise<TokenValidationResult> {
	if (brukerMock) {
		return {
			ok: true,
		};
	}

	if (!bearerToken) {
		return {
			ok: false,
			errorType: 'missing-token',
			error: new Error('Bearer token is missing'),
		};
	}

	const result = await validateAzureToken(bearerToken);
	if (result.ok === false) {
		return {
			ok: false,
			errorType: result.errorType,
			error: result.error,
		};
	}
	return { ok: true };
}

export { validateToken };
