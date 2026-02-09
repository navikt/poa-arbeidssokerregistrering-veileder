import 'server-only';
import { validateAzureToken } from '@navikt/oasis';

/**
 * Validation of Azure token
 * !TODO: Should we return simple bool, or custom object with msg?
 */
const brukerMock = process.env.ENABLE_MOCK === 'enabled';

async function validateToken(bearerToken: string): Promise<{
	ok: boolean;
}> {
	if (brukerMock) {
		return { ok: true };
	}

	if (!bearerToken) return { ok: false };

	const validated = await validateAzureToken(bearerToken);
	if (!validated.ok) {
		return { ok: false };
	}
	return { ok: true };
}

export { validateToken };
