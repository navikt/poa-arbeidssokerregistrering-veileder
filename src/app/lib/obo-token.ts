import { requestAzureOboToken } from '@navikt/oasis';
import { logger } from 'storybook/internal/node-logger';

async function hentOboToken(token: string, scope: string): Promise<string> {
    if (!token) {
        throw new Error('Ingen token funnet');
    }

    const result = await requestAzureOboToken(token, scope);
    if (!result.ok) {
        logger.error(`Tokenutveksling feilet for ${scope}`);
        throw new Error(`Tokenutveksling feilet for OBO med følgende scope: ${scope}`);
    }
    return result.token;
}

export { hentOboToken };
