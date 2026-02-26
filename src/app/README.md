# App router migrering - hva er greia?

I korte trekk:

- En gradevis migrering til app router, en sti om gangen. Første sti er /tidslinjer
- Alle sider bruker visittkortet og decoratøren, så for at /tidslinjer skulle funke, måtte vi også håndtere api-kallene, disse finnes nå i `(decorator-proxy)`, MEN. Men proxy-håndteringen vi gjør for /tidslinjer gjør seg gjeldene på alle sider. Altså er den gamle api-proxy-håndteringen i pages (kun for dekoratør og visittkort) nå overflødig.
- Gjenstående side, feks /historikk treffer pages, MEN App Router sin handleren "vinner" over pages sin. Derfor er all proxy-håndtering som finnes i app-router gjeldene for alle paths/routes.

## Routes som er over
- [x] - /tidslinjer
- [x] - /historikk
- [x] - /(forsiden)

## Routes som gjenstår
- [ ] - /404
- [ ] - /arbeidssoekerperiode-er-avsluttet
- [ ] - /arbeidssoekerperiode-er-slettet
- [ ] - /avslutt-arbeidssoekerperiode
- [ ] - /bekreftelse
- [ ] - /feil
- [ ] - /kan-registreres-som-arbeidssoeker
- [ ] - /kvittering-arbeidssoker
- [ ] - /kvittering-oppdatert-opplysninger
- [ ] - /oppdater-opplysninger
- [ ] - /registrering-arbeidssoeker-sjekk
- [ ] - /registrering-arbeidssoker
- [ ] - /slett-arbeidssoekerperiode
- [ ] - /veiledning/mangler-tilgang-til-aa-registeret

# App Router — mental modell for datahenting

### Hva er greia spør du?

Jo, altså det meste vi gjør og skal hente frem baserer seg på et `fnr` fra Modia konteksten. Dette får vi fra en `useModiaContext`, men dette tvinger oss til å bruker
`use client` overalt, og siden vi helt fint kan hente den samme modia konteksten direkte på servern (hentModiaContext (endepunkt)), så kan vi fint hente riktig data ved
første sidelastning. Derfor har jeg lagt opp til en hybrid-modell. Der vi henter data med modia-kontekst som vi fikk server-side første gangen, før vi deretter
oppdaterer med `useModiaContext()` på klienten når det blir aktuelt.

## Mønster for datahenting

Vi bruker et tre-lags mønster: **Page → Wrapper → Komponent**

### 1. `page.tsx` — Server Component (ingen `'use client'`)

Henter initial data og sender **uløst promise** videre som prop.

```tsx
// page.tsx (Server Component)
export default async function TidslinjerPage() {
    const ctx = await hentModiaContext();
    const dataPromise = getData(ctx.fnr); // ikke await!

    return (
        <Suspense fallback={<Loading />}>
            <Wrapper initialDataPromise={dataPromise} />
        </Suspense>
    );
}
```

### 2. `Wrapper.tsx` — Client Component

Holder på promise i state. Lytter på kontekst-endringer (f.eks. nytt fnr fra dekoratøren) og trigrer refetch via `startTransition`.

```tsx
// Wrapper.tsx ('use client')
const Wrapper = ({ initialDataPromise }) => {
    const { fnr } = useModiaContext();
    const [dataPromise, setDataPromise] = useState(initialDataPromise);
    const [isPending, startTransition] = useTransition();
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return; // skip — har allerede server-data
        }
        startTransition(() => {
            setDataPromise(getData(fnr)); // server action kalt fra transition = OK
        });
    }, [fnr]);

    return (
        <Suspense fallback={<Loading />}>
            <Komponent dataPromise={dataPromise} />
        </Suspense>
    );
};
```

### 3. `Komponent.tsx` — Client Component

Pakker ut promiset med `use()`. Ren presentasjon.

```tsx
// Komponent.tsx ('use client')
const Komponent = ({ dataPromise }) => {
    const data = use(dataPromise);
    return <div>{/* rendre data */}</div>;
};
```

## Flyten oppsummert

| Fase                  | Hva skjer                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| **Server-render**     | `page.tsx` kaller server-funksjon → sender promise til Wrapper                                  |
| **Hydration**         | Wrapper hydreres med server-promiset, `use()` resolver umiddelbart                              |
| **Bruker bytter fnr** | Kontekst oppdateres → `useEffect` → `startTransition` → nytt promise → `use()` resolver ny data |

#### Se `tidslinjer/` for komplett eksempel.

## Auth

Vi har tre auth-behov i app routeren, og de løses på tre ulike måter:

| Behov                        | Løsning                         | Hvor                        |
| ---------------------------- | ------------------------------- | --------------------------- |
| Beskytte sider               | `proxy.ts` (global)             | `src/proxy.ts`              |
| Server-side API-kall med OBO | `authenticatedFetch`            | `lib/authenticatedFetch.ts` |
| Proxy for klient-komponenter | `lagProxyKall` (route handlers) | `(decorator-proxy)/`        |

### 1. Sidebeskyttelse — `proxy.ts`

Next.js 16 sin [proxy](https://nextjs.org/docs/app/getting-started/proxy) (tidligere kalt middleware) validerer Azure-tokenet før noen side rendres. Matcher-konfigen bestemmer hvilke ruter som er beskyttet. Feiler valideringen, redirectes bruker til login.

### 2. Server-side API-kall — `authenticatedFetch`

Når en server component eller server action trenger data fra et backend-API, bruker vi `authenticatedFetch`. Den håndterer hele flyten: OBO-tokenutveksling, modia-headere, trace-id, fetch, feilhåndtering (inkl. RFC 9457 ProblemDetails) og JSON-parsing.

```tsx
// actions.ts
const result = await authenticatedFetch<Periode[]>({
    url: `${OPPSLAG_V2_URL}/api/v3/perioder?ordering=DESC`,
    scope: OPPSLAG_V2_SCOPE,
    headers: await headers(),
    method: 'POST',
    body: { identitetsnummer, type: 'IDENTITETSNUMMER' },
});

if (!result.ok) {
    return { perioder: null, error: result.error };
}
return { perioder: result.data };
```

Under panseret bruker `authenticatedFetch` → `getOboTokenFromRequest` → `validateToken` → `validateAzureToken` (oasis).

### 3. Proxy for klient-komponenter — `lagProxyKall`

Dekoratøren og visittkortet er klient-komponenter vi ikke kontrollerer. De gjør fetch-kall fra nettleseren, men kan ikke snakke direkte med backend-APIene (ingen OBO-token, APIene er interne). Derfor har vi route handlers under `(decorator-proxy)/` som tar imot klient-kall, utveksler OBO-token, og videresender til riktig backend.

```
Nettleser → /modiacontextholder/[...slug] (route handler) → Backend API
```

Disse bruker `lagProxyKall` som er en factory som tar `baseUrl` + `scope` og returnerer en route handler. Auth skjer via den samme `getOboTokenFromRequest`.

### Hvorfor ikke HOF-mønsteret fra pages router?

I app routeren bruker vi **ikke** dette mønsteret, av tre grunner:

1. **Sidebeskyttelse er løst globalt.** `proxy.ts` med `matcher` beskytter alle relevante ruter automatisk. I pages routeren måtte man huske `withAuthenticatedPage` på hver eneste side.

2. **Server actions har unik domenologikk rundt auth.** Hver server action har egen validering, mock-håndtering og feilmapping før og etter selve API-kallet. En HOF-wrapper ville bare dekket en liten del av flyten — resten måtte uansett ligge i action-funksjonen. Å kalle en utility (`authenticatedFetch`) direkte virket mer naturlig og fleksibelt.

3. **`authenticatedFetch` dekker behovet.** Istedenfor å wrappe handleren med auth, kaller vi en utility som gjør auth + fetch i ett. Resultatet er like konsist og eksplisitt.

### Oversikt over auth-filer

```
src/
├── proxy.ts                          # Sidebeskyttelse (Next.js 16 proxy/middleware)
├── app/lib/
│   ├── auth/
│   │   ├── validateToken.ts          # Mock-aware Azure token-validering
│   │   └── oboToken.ts              # Token → validering → OBO-utveksling
│   ├── authenticatedFetch.ts         # Auth + fetch + feilhåndtering i ett
│   └── modia-headers.ts             # Bygger NAV-headere med OBO-token + trace-id
```

## Feature flags (Unleash)

I pages routeren ble feature toggles hentet via en API-route (`pages/api/features.ts`) som returnerte rå definisjoner til klienten, som selv evaluerte flaggene. I app routeren evalueres flaggene server-side i `lib/unleash/feature-flags.ts`.

## Kjent tsconfig-problem: `strictNullChecks`

Prosjektet har `strictNullChecks: false` i rot-`tsconfig.json`. Dette gjør at TypeScript ikke klarer å narrowe discriminated unions (f.eks. `FetchResult<T> = FetchSuccess<T> | FetchFailure`) etter en `if (!result.ok)`-sjekk. Vi jobber rundt dette med eksplisitte type assertions (`as { ok: false; error: Error }`).

`src/app/tsconfig.json` overstyrer dette med `strictNullChecks: true`. Det betyr at IDE-en (som plukker opp nærmeste tsconfig) viser ingen feil for filer under `src/app/`, mens `npx tsc` (pre-commit hook og CI) bruker rot-tsconfigen og feiler. Dette er grunnen til at man kan ha "ingen feil i editoren" men likevel få feil ved commit.

Vi bør på sikt skru på `strictNullChecks: true` i rot-`tsconfig.json` — da vil discriminated unions fungere uten assertions, IDE og CLI vil være i sync, og vi kan fjerne alle workarounds.

## Testing

Vi bruker [Vitest](https://vitest.dev/) for testing av app router-kode. Vitest er scopet til kun `src/app/` via `vitest.config.ts` i prosjektrot — resten av prosjektet bruker fortsatt Jest. Kjør `npm run test:app` for å kjøre testene, eller `npm run test:app:watch` for watch-modus. CI kjører begge via `npm run test:ci`.
