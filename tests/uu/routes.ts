import type { Locator, Page, Response } from '@playwright/test';

export type UuRoute = {
    name: string;
    path: string;
    expectedStatus?: number;
    ready: (page: Page) => Locator;
};

export const routes: UuRoute[] = [
    {
        name: 'Forside med valgt person',
        path: '/',
        ready: (page) =>
            page.getByRole('heading', { name: /^Personen er registrert som arbeidssøker(?:\s|$)/ }),
    },
    {
        name: 'Arbeidssøkerregistrering',
        path: '/registrering-arbeidssoker',
        ready: (page) => page.getByRole('heading', { name: 'Din arbeidssøkersituasjon', exact: true }),
    },
    {
        name: 'Sjekk før arbeidssøkerregistrering',
        path: '/registrering-arbeidssoeker-sjekk',
        ready: (page) => page.getByRole('heading', { name: /Denne personen er under 18 år/ }),
    },
    {
        name: 'Oppdater opplysninger',
        path: '/oppdater-opplysninger',
        ready: (page) => page.getByRole('heading', { name: 'Din arbeidssøkersituasjon', exact: true }),
    },
    {
        name: 'Tidslinjer',
        path: '/tidslinjer',
        ready: (page) => page.getByRole('button', { name: /2026/ }).first(),
    },
    {
        name: 'Bekreftelse',
        path: '/bekreftelse',
        ready: (page) => page.getByRole('radiogroup').first(),
    },
    {
        name: 'Historikk',
        path: '/historikk',
        ready: (page) => page.getByRole('checkbox', { name: 'Vis innhold ekspandert', exact: true }),
    },
    {
        name: 'Avslutt arbeidssøkerperiode',
        path: '/avslutt-arbeidssoekerperiode',
        ready: (page) => page.getByRole('button', { name: 'Avslutt arbeidssøkerperioden' }),
    },
    {
        name: 'Slett arbeidssøkerperiode',
        path: '/slett-arbeidssoekerperiode',
        ready: (page) =>
            page.getByRole('checkbox', {
                name: 'Jeg bekrefter at arbeidssøkerperioden skal slettes på grunn av feilregistrering',
            }),
    },
    {
        name: 'Arbeidssøkerperioden er avsluttet',
        path: '/arbeidssoekerperiode-er-avsluttet',
        ready: (page) => page.getByRole('heading', { name: 'Arbeidssøkerperioden er avsluttet', exact: true }),
    },
    {
        name: 'Arbeidssøkerperioden er slettet',
        path: '/arbeidssoekerperiode-er-slettet',
        ready: (page) => page.getByRole('heading', { name: 'Arbeidssøkerperioden er slettet', exact: true }),
    },
    {
        name: 'Kvittering for registrering',
        path: '/kvittering-arbeidssoker',
        ready: (page) => page.getByRole('heading', { name: 'Personen er registrert som arbeidssøker', exact: true }),
    },
    {
        name: 'Kvittering for oppdaterte opplysninger',
        path: '/kvittering-oppdatert-opplysninger',
        ready: (page) => page.getByRole('heading', { name: 'Opplysningene er oppdatert', exact: true }),
    },
    {
        name: 'Mangler tilgang til AA-registeret',
        path: '/veiledning/mangler-tilgang-til-aa-registeret',
        ready: (page) => page.getByRole('heading', { name: 'Du har ikke tilgang til personens arbeidsforhold', exact: true }),
    },
    {
        name: 'Ukjent side (404)',
        path: '/uu-side-som-ikke-finnes',
        expectedStatus: 404,
        ready: (page) => page.getByRole('heading', { name: 'Fant ikke siden', exact: true }),
    },
];

export const ROUTE_READY_TIMEOUT_MS = 10_000;

export async function openRoute(page: Page, route: UuRoute): Promise<Response | null> {
    const response = await page.goto(route.path);
    const status = response?.status();
    if (status !== undefined && status >= 500) {
        throw new Error(`${route.path}: application navigation returned HTTP ${status}`);
    }
    if (route.expectedStatus !== undefined) {
        if (status !== route.expectedStatus) {
            throw new Error(`${route.path}: expected HTTP ${route.expectedStatus}, received ${status}`);
        }
    }

    const ready = route.ready(page);
    const applicationError = page.getByRole('heading', { name: 'Beklager, noe gikk galt.', exact: true });
    const outcome = await Promise.race([
        ready
            .waitFor({ state: 'visible', timeout: ROUTE_READY_TIMEOUT_MS })
            .then(() => 'ready' as const)
            .catch(() => 'timeout' as const),
        applicationError
            .waitFor({ state: 'visible', timeout: ROUTE_READY_TIMEOUT_MS })
            .then(() => 'application-error' as const)
            .catch(() => 'timeout' as const),
    ]);

    if (outcome === 'application-error' || (await applicationError.isVisible().catch(() => false))) {
        throw new Error(`${route.path}: application render error: Beklager, noe gikk galt.`);
    }
    if (outcome !== 'ready' && !(await ready.isVisible().catch(() => false))) {
        throw new Error(
            `${route.path}: route did not become ready within ${ROUTE_READY_TIMEOUT_MS}ms or show the expected ready content`,
        );
    }

    return response;
}

export async function gotoReady(page: Page, path: string): Promise<Response | null> {
    const route = routes.find((candidate) => candidate.path === path);
    if (!route) {
        throw new Error(`No UU-ready condition is registered for ${path}`);
    }
    return openRoute(page, route);
}
