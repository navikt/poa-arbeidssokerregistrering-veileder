import { useEffect, useState } from 'react';
import Script from 'next/script';

const isBrowser = () => typeof window !== 'undefined';
const isProduction = isBrowser() && window.location.href.includes('intern.nav.no');
interface Manifest {
    'index.html': { file: string; css: string[] };
}

function useHentVisittkortUrl() {
    const cdnUrl = `https://cdn.nav.no/poao/veilarbvisittkortfs-${isProduction ? 'prod' : 'dev'}/build`;
    const [url, settUrl] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${cdnUrl}/asset-manifest.json`)
            .then((res) => res.json())
            .then((manifest: Manifest) => {
                const jsUrl = `${cdnUrl}/${manifest['index.html'].file}`;
                settUrl(jsUrl);
            })
            .catch(console.error);
    }, []);

    return url;
}

export const VisittkortScript = () => {
    const url = useHentVisittkortUrl();

    if (!url) return null;

    return <Script src={url} strategy="afterInteractive" type={'module'} />;
};
