import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('nanoid', () => ({ nanoid: () => 'test-call-id' }));
vi.mock('next/headers', () => ({ headers: vi.fn().mockResolvedValue(new Headers()) }));
vi.mock('@/lib/auth/oboToken', () => ({ getOboTokenFromRequest: vi.fn() }));
vi.mock('@/lib/modia-headers', () => ({ hentModiaHeaders: vi.fn(() => ({})) }));

import { NextRequest } from 'next/server';
import { lagProxyKall } from '@/app/(decorator-proxy)/_lib/proxy-handler';
import { getOboTokenFromRequest } from '@/lib/auth/oboToken';

const mockGetOboToken = vi.mocked(getOboTokenFromRequest);

beforeEach(() => {
    vi.clearAllMocks();
    mockGetOboToken.mockResolvedValue({ ok: true, token: 'obo-token' });
    vi.stubGlobal(
        'fetch',
        vi
            .fn()
            .mockResolvedValue(
                new Response(JSON.stringify({}), { status: 200, headers: { 'content-type': 'application/json' } }),
            ),
    );
});

function callHandler(baseUrl: string, scope: string, slug: string[], query?: string) {
    const handler = lagProxyKall({ baseUrl, scope });
    const url = `http://localhost/${slug.join('/')}${query ? `?${query}` : ''}`;
    const request = new NextRequest(new URL(url));
    return handler(request, { params: Promise.resolve({ slug }) });
}

function getCalledUrl() {
    return vi.mocked(fetch).mock.calls.at(0)?.at(0) as string;
}

function mockFetchResponse(status: number, headers: HeadersInit = {}) {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status, headers }));
}

/**
 * Verifiserer at proxy-rutene bygger riktig target-URL for prod.
 *
 * Klient-komponenter (dekoratøren, visittkort) kaller disse stiene.
 * [...slug] fanger opp hele stien etter rutenavnet og sender den
 * videre uendret til backend-tjenesten.
 */
describe('Proxy-ruter i prod', () => {
    it.each([
        {
            name: 'modiacontextholder',
            baseUrl: 'https://modiacontextholder.intern.nav.no',
            scope: 'api://prod-gcp.personoversikt.modiacontextholder/.default',
            slug: ['api', 'context'],
            expectedUrl: 'https://modiacontextholder.intern.nav.no/api/context',
        },
        {
            name: 'veilarboppfolging',
            baseUrl: 'http://veilarboppfolging.poao/veilarboppfolging',
            scope: 'api://prod-gcp.poao.veilarboppfolging/.default',
            slug: ['api', 'v3', 'oppfolging', 'hent-veilederTilgang'],
            expectedUrl: 'http://veilarboppfolging.poao/veilarboppfolging/api/v3/oppfolging/hent-veilederTilgang',
        },
        {
            name: 'veilarbdialog',
            baseUrl: 'http://veilarbdialog.dab/veilarbdialog',
            scope: 'api://prod-gcp.dab.veilarbdialog/.default',
            slug: ['api', 'dialog'],
            expectedUrl: 'http://veilarbdialog.dab/veilarbdialog/api/dialog',
        },
        {
            name: 'veilarbperson',
            baseUrl: 'http://veilarbperson.obo/veilarbperson',
            scope: 'api://prod-gcp.obo.veilarbperson/.default',
            slug: ['api', 'v3', 'person', 'hent-tilrettelagtekommunikasjon'],
            expectedUrl: 'http://veilarbperson.obo/veilarbperson/api/v3/person/hent-tilrettelagtekommunikasjon',
        },
        {
            name: 'veilarbveileder',
            baseUrl: 'http://veilarbveileder.obo/veilarbveileder',
            scope: 'api://prod-gcp.obo.veilarbveileder/.default',
            slug: ['api', 'veileder', 'me'],
            expectedUrl: 'http://veilarbveileder.obo/veilarbveileder/api/veileder/me',
        },
        {
            name: 'obo-unleash',
            baseUrl: 'http://obo-unleash.obo.svc.cluster.local',
            scope: 'api://prod-gcp.obo.obo-unleash/.default',
            slug: ['api', 'feature'],
            expectedUrl: 'http://obo-unleash.obo.svc.cluster.local/api/feature',
        },
    ])('/$name/$slug → $expectedUrl', async ({ baseUrl, scope, slug, expectedUrl }) => {
        await callHandler(baseUrl, scope, slug);

        expect(getCalledUrl()).toBe(expectedUrl);
        expect(mockGetOboToken).toHaveBeenCalledWith(expect.any(Headers), scope);
    });

    it('skal videresende query-parametere til target-URL', async () => {
        await callHandler(
            'https://fiktiv-base-url.intern.nav.no',
            'api://prod-gcp.seriøst-api/.default',
            ['api', 'context', 'heipådeg'],
            'enhet=0219',
        );

        expect(getCalledUrl()).toBe('https://fiktiv-base-url.intern.nav.no/api/context/heipådeg?enhet=0219');
    });

    it.each([301, 302, 303, 307, 308])('skal videresende redirect %s med Location-header', async (status) => {
        mockFetchResponse(status, { location: 'https://ekstern.nav.no/videre' });

        const response = await callHandler(
            'https://fiktiv-base-url.intern.nav.no',
            'api://prod-gcp.seriøst-api/.default',
            ['api', 'redirect'],
        );

        expect(response.status).toBe(status);
        expect(response.headers.get('location')).toBe('https://ekstern.nav.no/videre');
    });

    it.each([301, 302, 303, 307, 308])('skal returnere 502 når redirect %s mangler Location-header', async (status) => {
        mockFetchResponse(status);

        const response = await callHandler(
            'https://fiktiv-base-url.intern.nav.no',
            'api://prod-gcp.seriøst-api/.default',
            ['api', 'redirect'],
        );

        expect(response.status).toBe(502);
        await expect(response.json()).resolves.toEqual({
            message: 'Proxy request feilet',
            callId: 'test-call-id',
        });
    });
});
