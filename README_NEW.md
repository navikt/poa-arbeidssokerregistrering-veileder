# poa-arbeidssokerregistrering-veileder

Intern frontend for veiledere i NAV (Modia). Lar en veileder administrere arbeidssøkerperioder og opplysninger for en person via Arbeidssøkerregisteret.

## Hva gjør appen?

Appen gir en veileder mulighet til å administrere en persons arbeidssøkerstatus.

**Dersom personen ikke har en pågående periode, kan veileder:**
- Registrere personen som arbeidssøker (fylle inn opplysninger)

**Dersom personen allerede har en pågående periode, kan veileder:**
- Se opplysninger og status for perioden
- Endre opplysninger for personen
- Avslutte en periode for personen
- Slette en periode for personen (kun ved feilregistrering)

## Backend-API-er

Appen snakker med flere backend-tjenester server-side. Alle kall autentiseres med OBO-token (on-behalf-of) via `authenticatedFetch`.

### Arbeidssøkerregisteret (team PAW)

| Tjeneste | Env-variabel | Hva den brukes til |
| --- | --- | --- |
| `paw-arbeidssokerregisteret-api-inngang` | `INNGANG_API_URL` | Starte, stoppe og slette arbeidssøkerperioder (`PUT /api/v2/arbeidssoker/periode`), sjekke om en periode kan startes (`PUT /api/v2/arbeidssoker/kanStartePeriode`) |
| `paw-arbeidssokerregisteret-api-inngang` | `OPPLYSNINGER_API_URL` | Registrere/oppdatere opplysninger (`POST /api/v1/arbeidssoker/opplysninger`) |
| `paw-arbeidssoekerregisteret-api-oppslag-v2` | `OPPSLAG_API_V2_URL` | Hente perioder (`POST /api/v3/perioder`) og snapshot med opplysninger (`POST /api/v3/snapshot`) |
| `paw-arbeidssoekerregisteret-api-bekreftelse` | `BEKREFTELSE_API_URL` | Hente tilgjengelige bekreftelser (`POST /api/v1/tilgjengelige-bekreftelser`) |

### Andre NAV-tjenester

| Tjeneste | Env-variabel | Hva den brukes til |
| --- | --- | --- |
| `modiacontextholder` | `MODIACONTEXTHOLDER_URL` | Hente aktiv bruker (fnr) og enhet fra Modia-konteksten (`GET /api/context/`) |
| `aareg-services` | `AAREG_REST_API` | Hente siste arbeidsforhold for en person (`POST /v2/arbeidstaker/arbeidsforholdoversikt`) |
| `pam-ontologi` | `PAM_ONTOLOGI_URL` | Konvertere styrk98-kode til styrk08 (`GET /ontologi/styrk98/konverter/{kode}`) og typeahead-søk på stillingstitler (`GET /typeahead/stilling`) |

### Proxy-routes for klient-komponenter (dekoratør/visittkort)

Dekoratøren og visittkortet er klient-komponenter som gjør fetch fra nettleseren, men ikke kan snakke direkte med interne backend-API-er. Derfor har vi route handlers under `src/app/(decorator-proxy)/` som proxyer disse kallene med OBO-token:

| Route handler | Backend |
| --- | --- |
| `/modiacontextholder/[...slug]` | `modiacontextholder` |
| `/veilarboppfolging/[...slug]` | `veilarboppfolging` |
| `/veilarbdialog/[...slug]` | `veilarbdialog` |
| `/veilarbperson/[...slug]` | `veilarbperson` |
| `/veilarbveileder/[...slug]` | `veilarbveileder` |
| `/veilarbvedtaksstotte/[...slug]` | `veilarbvedtaksstotte` |
| `/obo-unleash/[...slug]` | `obo-unleash` |

## Routes

| Route | Beskrivelse |
| --- | --- |
| `/` | **Forside.** Viser status for valgt person — enten aktiv periode med opplysninger og handlingsvalg, eller melding om at personen ikke er registrert med mulighet for å starte registrering. |
| `/registrering-arbeidssoeker-sjekk` | **Sjekk før registrering.** Kontrollerer om personen kan registreres som arbeidssøker (kall mot inngangs-API). |
| `/registrering-arbeidssoker` | **Registreringsskjema.** Skjema der veileder fyller inn opplysninger for å registrere personen som arbeidssøker. |
| `/kvittering-arbeidssoker` | **Kvittering etter registrering.** Bekreftelse på at personen er registrert som arbeidssøker. |
| `/oppdater-opplysninger` | **Endre opplysninger.** Skjema for å oppdatere opplysninger for en aktiv arbeidssøkerperiode. |
| `/kvittering-oppdatert-opplysninger` | **Kvittering etter oppdatering.** Bekreftelse på at opplysningene er oppdatert. |
| `/avslutt-arbeidssoekerperiode` | **Avslutt periode.** Side for å avslutte en aktiv arbeidssøkerperiode. |
| `/arbeidssoekerperiode-er-avsluttet` | **Kvittering etter avslutting.** Bekreftelse på at perioden er avsluttet. |
| `/slett-arbeidssoekerperiode` | **Slett periode.** Side for å slette en arbeidssøkerperiode (kun ved feilregistrering). |
| `/arbeidssoekerperiode-er-slettet` | **Kvittering etter sletting.** Bekreftelse på at perioden er slettet. |
| `/tidslinjer` | **Tidslinjer.** Visuell tidslinje over personens arbeidssøkerperioder. |
| `/historikk` | **Historikk.** Detaljert historikk over personens arbeidssøkerperioder. |
| `/veiledning/mangler-tilgang-til-aa-registeret` | **Feilside.** Vises når veileder mangler lesetilgang til AA-registeret. |
| `/api/stillingssok` | **API-route.** Typeahead-søk mot PAM ontologi for stillingsstitler. |

## Lokal utvikling

### Forutsetninger

- Node.js 24 (`nvm use`)
- GitHub PAT med `read:packages` scope og SSO mot NAVIKT (for å hente pakker fra GitHub Package Registry)
  ```sh
  npm login --registry https://npm.pkg.github.com
  ```
- [naisdevice](https://doc.nais.io/device/) (for å nå backend-endepunkter, ikke nødvendig i mock-modus)

### Kjøre appen

```sh
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000).

### Scripts

| Script | Beskrivelse |
| --- | --- |
| `npm run dev` | Start utviklingsserver |
| `npm run build` | Bygg for produksjon |
| `npm run start` | Kjør produksjonsbygg |
| `npm run test:app` | Kjør Vitest (app router-kode) |
| `npm run test:app:watch` | Vitest i watch-modus |
| `npm run test:ci` | Lint + Jest + Vitest (brukes i CI) |
| `npm run lint` | Kjør ESLint |
| `npm run format:app` | Formater `src/app/` med Biome |
| `npm run format:legacy` | Formater resten med Prettier |
| `npm run storybook` | Start Storybook |

## Arkitektur

### Modia-kontekst og datahenting

Appen kjører innenfor NAVs Modia-internflate. Alt av datahenting baserer seg på et `fnr` (fødselsnummer) fra Modia-konteksten. Vi bruker en hybrid-modell:

1. **Server-side:** `page.tsx` henter Modia-kontekst via `hentModiaContext()` og starter datahenting med riktig `fnr` allerede på serveren.
2. **Klient-side:** Når veileder bytter person i dekoratøren, oppdateres `fnr` via `useModiaContext()` og data refetches via `useServerData`-hooken.

Mønsteret er **Page → Wrapper → Komponent**:
- **Page** (Server Component): Henter initial data som uløste promises.
- **Wrapper** (Client Component): Holder promise i state, lytter på kontekst-endringer, trigrer refetch via `startTransition`.
- **Komponent** (Client Component): Pakker ut promise med `use()`, ren presentasjon.

Se `src/app/README.md` for detaljert dokumentasjon av dette mønsteret, samt auth-oppsett og andre tekniske valg.

### Autentisering

| Behov | Løsning | Hvor |
| --- | --- | --- |
| Beskytte sider | `proxy.ts` (global) | `src/proxy.ts` |
| Server-side API-kall med OBO | `authenticatedFetch` | `src/app/lib/authenticatedFetch.ts` |
| Proxy for klient-komponenter (dekoratør, visittkort) | Route handlers via `lagProxyKall` | `src/app/(decorator-proxy)/` |

### Mappestruktur

```
src/
├── proxy.ts                        # Sidebeskyttelse (Next.js proxy/middleware)
├── app/
│   ├── layout.tsx                  # Root layout — Modia-dekoratør, visittkort, providers
│   ├── (forside)/                  # Forsiden (/)
│   ├── registrering-arbeidssoker/  # Registreringsskjema
│   ├── oppdater-opplysninger/      # Endre opplysninger
│   ├── avslutt-arbeidssoekerperiode/
│   ├── slett-arbeidssoekerperiode/
│   ├── tidslinjer/                 # Visuell tidslinje
│   ├── historikk/                  # Detaljert historikk
│   ├── kvittering-arbeidssoker/    # Kvitteringssider
│   ├── kvittering-oppdatert-opplysninger/
│   ├── arbeidssoekerperiode-er-avsluttet/
│   ├── arbeidssoekerperiode-er-slettet/
│   ├── veiledning/                 # Feil-/veiledningssider
│   ├── (decorator-proxy)/          # Route handlers for dekoratør/visittkort
│   ├── api/                        # API-routes (stillingssøk typeahead)
│   ├── components/                 # Delte app-komponenter
│   ├── contexts/                   # React contexts (Modia)
│   ├── hooks/                      # Delte hooks (useServerData, etc.)
│   ├── lib/                        # Auth, API-kall, utils
│   │   ├── auth/                   # Token-validering, OBO
│   │   ├── api/                    # Server-side API-funksjoner
│   │   ├── unleash/                # Feature flags
│   │   └── authenticatedFetch.ts   # Auth + fetch + feilhåndtering
│   └── mocks/                      # Mock-data for lokal utvikling
├── pages/                          # Legacy pages router (under migrering)
├── components/                     # Legacy delte komponenter
└── styles/                         # Globale stiler
```

## Deploy

Appen deployes automatisk via GitHub Actions:

- **Push til `main`** → deploy til dev + prod
- **Push til `dev/*`-branch** → deploy kun til dev

### Miljøer

| Miljø | URL |
| --- | --- |
| Dev | https://arbeidssokerregistrering-for-veileder.intern.dev.nav.no |
| Prod | https://arbeidssokerregistrering-for-veileder.intern.nav.no |

Du trenger en veileder-testbruker for å logge inn i dev. Opprett bruker i [IDA](https://ida.intern.nav.no) og test-identer i [Dolly](https://dolly.ekstern.dev.nav.no/).

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles via issues her på GitHub.

**For NAV-ansatte:** Interne henvendelser kan sendes via Slack i kanalen [#team-paw-dev](https://nav-it.slack.com/archives/CLTFAEW75).
