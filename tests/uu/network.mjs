// Playwright browser routing cannot intercept fetches made by the Next.js server.
// Preload this module only in the isolated local UU test server to stub/deny those requests.
const requiredEnvironment = {
    ENABLE_MOCK: 'enabled',
    NEXT_PUBLIC_ENABLE_MOCK: 'enabled',
    NAIS_CLUSTER_NAME: 'local-uu',
};

for (const [name, expected] of Object.entries(requiredEnvironment)) {
    if (process.env[name] !== expected) {
        throw new Error('UU network interceptor requires its isolated local mock environment');
    }
}

const originalFetch = globalThis.fetch;
const manifestUrl =
    'https://cdn.nav.no/poao/veilarbvisittkortfs-dev/build/asset-manifest.json';
const manifestResponse = new Response(JSON.stringify({ 'index.html': { file: 'uu-stub.js', css: [] } }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
});
const loopbackHosts = new Set(['127.0.0.1', 'localhost', '::1', '[::1]']);

globalThis.fetch = async (input, init) => {
    const requestUrl = new URL(input instanceof Request ? input.url : input.toString());
    const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase();

    if (requestUrl.href === manifestUrl && method === 'GET') {
        return manifestResponse.clone();
    }

    if (
        (requestUrl.protocol === 'http:' || requestUrl.protocol === 'https:') &&
        !loopbackHosts.has(requestUrl.hostname)
    ) {
        throw new Error('Blocked non-loopback HTTP(S) fetch in UU test mode');
    }

    // Keep local requests available while preventing their redirects from reaching remote hosts.
    return originalFetch(input, { ...init, redirect: 'manual' });
};
