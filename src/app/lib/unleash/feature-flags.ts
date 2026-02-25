import { logger } from '@navikt/next-logger';
import { evaluateFlags, flagsClient, getDefinitions } from '@unleash/nextjs';
import { featureMocks } from '@/pages/api/mocks/features';
import 'server-only';

const REVALIDATE_SECONDS = 15;

async function getServerSideDefinitions() {
    const brukerMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';
    if (brukerMock) {
        return featureMocks;
    }

    try {
        return await getDefinitions({
            fetchOptions: { next: { revalidate: REVALIDATE_SECONDS } },
        });
    } catch (error) {
        logger.error(error, 'Feil ved henting av feature toggles fra unleash');
        return featureMocks;
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
