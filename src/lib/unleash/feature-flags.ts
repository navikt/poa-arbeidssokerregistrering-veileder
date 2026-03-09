import { logger } from '@navikt/next-logger';
import { evaluateFlags, flagsClient, getDefinitions } from '@unleash/nextjs';
import 'server-only';

const REVALIDATE_SECONDS = 15;
const EMPTY_DEFINITIONS = { version: 1, features: [] };
const brukerMock = process.env.ENABLE_MOCK === 'enabled';

async function getServerSideDefinitions() {
    try {
        if (brukerMock) {
            return EMPTY_DEFINITIONS;
        }
        return await getDefinitions({
            fetchOptions: { next: { revalidate: REVALIDATE_SECONDS } },
        });
    } catch (error) {
        logger.error(error, 'Feil ved henting av feature toggles fra unleash');
        return EMPTY_DEFINITIONS;
    }
}

async function getServerSideFeatureFlags() {
    const definitions = await getServerSideDefinitions();

    const { toggles } = evaluateFlags(definitions);
    return flagsClient(toggles);
}

async function isFeatureEnabled(flagName: string): Promise<boolean> {
    const flags = await getServerSideFeatureFlags();
    return flags.isEnabled(flagName);
}

export { isFeatureEnabled };
