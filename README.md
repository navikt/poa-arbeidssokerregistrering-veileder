# poa-arbeidssokerregistrering-veileder

Arbeidssøkerregistrering frontend for veileder (Modia - Arbeidssøkerregisteret).

## Utvikling

Bruk Node.js 24 `nvm use` (dersom du bruker nvm til versjonshåndtering av Node.js).

Siden noen av modulene hentes fra GitHubs package registry må du også gjøre litt ekstra konfigurasjon for å kjøre løsningen lokalt.

- Opprett et PAT (github => settings => developer settings => personal access tokens => tokens (classic)) med `read:packages` scope
- Konfigurer SSO mot NAVIKT for tokenet
- bruk tokenet som passord ved login `npm login --registry https://npm.pkg.github.com`

Deretter fortsette du med

```sh
git clone https://github.com/navikt/poa-arbeidssokerregistrering-veileder.git
cd poa-arbeidssokerregistrering-veileder
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000).

## Testing

Kjør alle tester med [Vitest](https://vitest.dev/):

```sh
npm test
```

For watch-modus under utvikling:

```sh
npm run test:watch
```

## Deploye kun til dev

Ved å prefikse branch-navn med `dev/`, så vil branchen kun deployes i dev.

```
git checkout -b dev/<navn på branch>
```

For å teste løsningen i dev bruker du [https://arbeidssokerregistrering-for-veileder.intern.dev.nav.no](https://arbeidssokerregistrering-for-veileder.intern.dev.nav.no)

Du vil trenger en veileder-testbruker for å logge inn.
Veilederbruker kan du opprette i IDA [https://ida.intern.nav.no](https://ida.intern.nav.no/)
Du må også opprette eller finne test-identer i Dolly [https://dolly.ekstern.dev.nav.no/](https://dolly.ekstern.dev.nav.no/)

## Hva gjør appen?

Appen gir en veileder mulighet til å administrere en persons arbeidssøkerstatus.

**Dersom personen ikke har en pågående periode, kan veileder:**

- Sjekke om personen kan registreres som arbeidssøker
- Registrere personen som arbeidssøker (fylle inn opplysninger)

**Dersom personen allerede har en pågående periode, kan veileder:**

- Se opplysninger og status for perioden
- Endre opplysninger for personen
- Bekrefte arbeidssøkerperioden på vegne av personen
- Se tidslinje og historikk for personen
- Avslutte perioden
- Slette perioden (kun ved feilregistrering)

---

## Model for datahenting

`Datahenting — Page → Wrapper → Komponent`

Appen kjører innenfor NAVs Modia-internflate. All datahenting baserer seg på et `fnr` (fødselsnummer). Vi bruker en hybrid-modell der vi henter data server-side ved første sidelastning, og refetcher på klienten når veileder bytter person i dekoratøren. Både server side og fra klienten er det [server funksjoner](https://nextjs.org/docs/app/getting-started/updating-data#what-are-server-functions) som blir brukt.

Mønsteret har tre lag:

**1. `page.tsx`** — Server Component. Henter Modia-kontekst og starter datahenting. Sender et _uløst promise_ til Wrapper.

```tsx
// page.tsx
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

**2. `Wrapper.tsx`** — Client Component. Holder promise i state. Lytter på kontekst-endringer og trigger refetch via `startTransition`.

```tsx
// Wrapper.tsx ('use client')
const Wrapper = ({ initialDataPromise }) => {
    const { dataPromise, isPending } = useServerData(initialDataPromise, getData); // getData er server funksjonen

    return (
        <Suspense fallback={<LoaderSkeleton />}>
            {isPending && <Loader title='Henter data' />}
            <EtKomponent dataPromise={dataPromise} />
        </Suspense>
    );
};
```

**3. `Komponent.tsx`** — Client Component. Pakker ut promiset med `use()`. Ren presentasjon.

```tsx
// Komponent.tsx ('use client')
const Komponent = ({ dataPromise }) => {
    const data = use(dataPromise);
    return <div>{/* rendre data */}</div>;
};
```

**4. `useServerData.ts`** — Client hook. Hopper over første render, lytter på `fnr`-endringer fra Modia-kontekst, og setter et nytt server-promise i en `startTransition`. Returnerer `{ dataPromise, isPending }`.

```tsx
// useServerData.ts ('use client')
export function useServerData(initialPromise, fetchFn) {
    const { fnr } = useModiaContext();
    const [dataPromise, setDataPromise] = useState(initialPromise);
    const [isPending, startTransition] = useTransition();
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (!fnr) return;

        startTransition(() => {
            setDataPromise(fetchFn(fnr));
        });
    }, [fnr, fetchFn]);

    return { dataPromise, isPending };
}
```

| Fase | Hva skjer |
| --- | --- |
| **Server-render** | `page.tsx` kaller server action → sender promise til Wrapper |
| **Hydration** | Wrapper hydreres med server-promiset, `use()` resolver umiddelbart |
| **Hook (klient-refetch)** | `useServerData` reagerer på `fnr`-bytte og oppdaterer `dataPromise` i transition |
| **Bruker bytter person** | Kontekst oppdateres → `useEffect` → `startTransition` → nytt promise → `use()` resolver ny data |

### Autentisering

Vi har tre auth-behov som løses på tre ulike måter:

| Behov | Løsning | Fil |
| --- | --- | --- |
| Beskytte sider | `proxy.ts` — validerer Azure-token globalt før noen side rendres | `src/proxy.ts` |
| Server-side API-kall | `authenticatedFetch` — OBO-token, modia-headere, fetch og feilhåndtering i ett | `src/lib/authenticatedFetch.ts` |
| Proxy for klient-komponenter | `lagProxyKall` — route handlers som proxyer kall fra dekoratør/visittkort med OBO-token | `src/app/(decorator-proxy)/` |

### API-er

Alle server-side kall mot backend gjøres via server actions i `src/lib/api/` og autentiseres med `authenticatedFetch`.

**Arbeidssøkerregisteret (team PAW):**

| Tjeneste | Brukes til |
| --- | --- |
| `paw-arbeidssokerregisteret-api-inngang` | Start/stopp/slett periode - sjekke om periode kan startes - registrere/endre opplysninger |
| `paw-arbeidssoekerregisteret-api-oppslag-v2` | Hente perioder og snapshot |
| `paw-arbeidssoekerregisteret-api-bekreftelse` | Hente tilgjengelige bekreftelser |

**Andre NAV-tjenester:**

| Tjeneste | Brukes til |
| --- | --- |
| `modiacontextholder` | Hente aktiv bruker (fnr) og enhet fra Modia-konteksten |
| `aareg-services` | Hente siste arbeidsforhold |
| `pam-ontologi` | Typeahead-søk på stillingstitler og konvertering av styrk-koder |

## Ekstern dokumentasjon

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/)
- [testing-library](https://testing-library.com/)
- [Biome](https://biomejs.dev/)
- [Aksel (NAV Designsystem)](https://aksel.nav.no/)

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles via issues her på github.

# For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#team-paw-dev](https://nav-it.slack.com/archives/CLTFAEW75)
