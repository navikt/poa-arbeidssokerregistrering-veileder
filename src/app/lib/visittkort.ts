import { logger } from '@navikt/next-logger';

type Manifest = {
    'index.html': { file: string; css: string[] };
};

const isBrowser = () => typeof window !== 'undefined';
const isProduction = isBrowser() && window.location.href.includes('intern.nav.no');

async function hentVisittkortScriptUrl(): Promise<string | null> {
    const cdnUrl = `https://cdn.nav.no/poao/veilarbvisittkortfs-${isProduction ? 'prod' : 'dev'}/build`;
    try {
        const res = await fetch(`${cdnUrl}/asset-manifest.json`);
        const manifest: Manifest = await res.json();
        return `${cdnUrl}/${manifest['index.html'].file}`;
    } catch (e) {
        logger.error(`Klarte ikke å hente visittkort-url. ${e}`);
        return null;
    }
}

export { hentVisittkortScriptUrl };
