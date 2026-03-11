import 'server-only';
import { logger } from '@navikt/next-logger';
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

type TokenValidationResult = TokenValidationSuccess | TokenValidationFailure;

async function validateToken(bearerToken: string | null): Promise<TokenValidationResult> {
    if (brukerMock) {
        logger.info(`Mocked validering av token`);
        return {
            ok: true,
        };
    }

    if (!bearerToken) {
        logger.warn('Bearer token mangler');
        return {
            ok: false,
            errorType: 'missing-token',
            error: new Error('Bearer token is missing'),
        };
    }

    const result = await validateAzureToken(bearerToken);
    if (!result.ok) {
        logger.error({
            message: `Feil ved validering av token: ${result.errorType}`,
            error: result.error,
        });
        return {
            ok: false,
            errorType: result.errorType,
            error: result.error,
        };
    }
    return { ok: true };
}

export { validateToken };
