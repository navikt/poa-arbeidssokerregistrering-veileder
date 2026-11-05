import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const interceptorPath = fileURLToPath(new URL('./network.mjs', import.meta.url));
const validEnvironment = {
    ENABLE_MOCK: 'enabled',
    NEXT_PUBLIC_ENABLE_MOCK: 'enabled',
    NAIS_CLUSTER_NAME: 'local-uu',
    NODE_OPTIONS: '',
};

function runNode(source, overrides = {}) {
    return spawnSync(process.execPath, ['--input-type=module', '-e', source, interceptorPath], {
        encoding: 'utf8',
        env: { ...validEnvironment, ...overrides },
    });
}

test('requires both mock flags and the local UU cluster', () => {
    for (const environment of [
        { ENABLE_MOCK: undefined },
        { ENABLE_MOCK: 'disabled' },
        { NEXT_PUBLIC_ENABLE_MOCK: undefined },
        { NEXT_PUBLIC_ENABLE_MOCK: 'disabled' },
        { NAIS_CLUSTER_NAME: 'dev-gcp' },
    ]) {
        const result = runNode('await import(process.argv[1]);', environment);
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /requires its isolated local mock environment/);
    }
});

test('stubs only the exact manifest GET with synthetic data', () => {
    const result = runNode(`
        let forwarded = 0;
        globalThis.fetch = async () => { forwarded++; throw new Error('unexpected forwarding'); };
        await import(process.argv[1]);
        const response = await fetch('https://cdn.nav.no/poao/veilarbvisittkortfs-dev/build/asset-manifest.json');
        const manifest = await response.json();
        if (response.status !== 200 || manifest['index.html'].file !== 'uu-stub.js' || manifest['index.html'].css.length !== 0 || forwarded !== 0) {
            throw new Error('manifest stub mismatch');
        }
    `);
    assert.equal(result.status, 0, result.stderr);
});

test('rejects external HTTP and HTTPS fetches without exposing their URLs', () => {
    const result = runNode(`
        await import(process.argv[1]);
        for (const url of [
            'http://example.invalid/private/path?token=test-secret',
            'https://example.invalid/private/path?token=test-secret',
        ]) {
            try {
                await fetch(url);
                throw new Error('external request was not blocked');
            } catch (error) {
                if (error.message !== 'Blocked non-loopback HTTP(S) fetch in UU test mode' || error.message.includes(url) || error.message.includes('test-secret')) {
                    throw new Error('external denial message was not sanitized');
                }
            }
        }
    `);
    assert.equal(result.status, 0, result.stderr);
});

test('forwards loopback requests with manual redirects regardless of caller settings', () => {
    const result = runNode(`
        const forwarded = [];
        globalThis.fetch = async (input, init) => {
            forwarded.push({ input, init });
            return new Response('loopback');
        };
        await import(process.argv[1]);
        await fetch('http://127.0.0.1:3100/redirect', { redirect: 'follow' });
        const request = new Request('http://localhost:3100/request-redirect', { redirect: 'follow' });
        await fetch(request);
        await fetch('http://[::1]:3100/redirect', { redirect: 'error' });
        if (forwarded.length !== 3 || forwarded[0].init.redirect !== 'manual' || forwarded[1].input !== request || forwarded[1].init.redirect !== 'manual' || forwarded[2].init.redirect !== 'manual') {
            throw new Error('loopback forwarding did not force manual redirects');
        }
    `);
    assert.equal(result.status, 0, result.stderr);
});
