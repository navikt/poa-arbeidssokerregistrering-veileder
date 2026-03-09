import { logger } from '@navikt/next-logger';

type Manifest = {
    'index.html': { file: string; css: string[] };
};

const isProduction = process.env.NAIS_CLUSTER_NAME === 'prod-gcp';

async function hentVisittkortScriptUrl(): Promise<string | null> {
    const cdnUrl = `https://cdn.nav.no/poao/veilarbvisittkortfs-${isProduction ? 'prod' : 'dev'}/build`;
    try {
        const res = await fetch(`${cdnUrl}/asset-manifest.json`);
        logger.info('fetch manifest');
        const manifest: Manifest = await res.json();
        logger.info(`${JSON.stringify(manifest)}`);
        return `${cdnUrl}/${manifest['index.html'].file}`;
    } catch (e) {
        logger.error(`Klarte ikke å hente visittkort-url. ${e}`);
        return null;
    }
}

export { hentVisittkortScriptUrl };
