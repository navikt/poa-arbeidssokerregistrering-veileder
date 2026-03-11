# Migrering fra Pages Router til App Router

## Oppsummering

Appen `poa-arbeidssokerregistrering-veileder` er en intern NAV-applikasjon som lar veiledere administrere arbeidssøkerstatus via Modia-internflaten. Over **84 commits** (februar–mars 2026) ble hele appen migrert fra Next.js Pages Router til App Router. Katalogen `src/pages/` er slettet i sin helhet — den eksisterer ikke lenger i kodebasen.

Migreringen var ikke bare en teknisk re-platforming, men en arkitekturell omskriving som ga konkrete forbedringer i ytelse, sikkerhet, kodekvalitet og utvikleropplevelse.

---

## Nøkkeltall

| Metrikk | Før (Pages Router) | Etter (App Router) | Endring |
|---|---|---|---|
| Kodelinjer (src/) | ~14 935 | ~11 881 | **−20 %** |
| Filer endret totalt | — | 349 filer | 20 787 linjer lagt til, 23 789 slettet |
| API-routes / route handlers | 48 filer | 10 route handlers | **−79 %** |
| React-kontekster (`createContext`) | 8 | 3 | **−63 %** |
| Testfiler | 7 | 18 | **+157 %** |
| Antall tester | ~7 (ren utility-testing) | 227 | **+3 140 %** |
| `getServerSideProps`-bruk | 15 sider | 0 | Eliminert |
| `withAuthenticatedPage`-bruk | 16 filer | 0 | Eliminert |
| `useSWR`-kall (klient-fetch) | 3+ filer | 0 | Eliminert |
| npm dependencies | 19 prod + 27 dev | 15 prod + 24 dev | −7 pakker |

---

## Hva ble gjort?

### 1. Alle sider portet til App Router

Samtlige 15 sider under `src/pages/` ble re-implementert som App Router-ruter under `src/app/`. Pages Router-spesifikke mønstre (`_app.tsx`, `_document.tsx`, `404.tsx`, `getServerSideProps`) er fjernet.

**Før (Pages Router):**
```
src/pages/
├── _app.tsx
├── _document.tsx
├── 404.tsx
├── index.tsx
├── bekreftelse.tsx
├── historikk.tsx
├── tidslinjer.tsx
├── registrering-arbeidssoker.tsx
├── ... (15 sidefiler + 48 API-routes)
```

**Etter (App Router):**
```
src/app/
├── (forside)/page.tsx
├── bekreftelse/page.tsx
├── historikk/page.tsx
├── tidslinjer/page.tsx
├── registrering-arbeidssoker/page.tsx
├── ... (14 ruter + 10 route handlers)
```

### 2. Server-side datahenting erstatter klient-side fetching

I Pages Router-versjonen brukte alle sider `getServerSideProps` kun for autentisering. Selve datahentingen skjedde på klienten via SWR-kall mot interne API-routes. Det ga et synlig «spinner → data»-hopp ved hver sidelastning.

Nå skjer datahenting server-side via **server functions** (`'use server'`). Brukeren får data allerede ved første rendering — ingen spinner, ingen layout shift.

**9 server functions** dekker all datahenting og mutasjon:

| Fil | Ansvar |
|---|---|
| `lib/api/oppslag-perioder.ts` | Hente arbeidssøkerperioder |
| `lib/api/oppslag-snapshot.ts` | Hente opplysninger (snapshot) |
| `lib/api/inngang-start-periode.ts` | Starte ny periode |
| `lib/api/inngang-stopp-periode.ts` | Avslutte periode |
| `lib/api/inngang-slett-periode.ts` | Slette periode |
| `lib/api/inngang-kan-starte-periode.ts` | Sjekke om registrering er mulig |
| `lib/api/inngang-opplysninger.ts` | Registrere/endre opplysninger |
| `lib/api/bekreftelse.ts` | Hente og sende bekreftelser |
| `lib/api/aareg.ts` | Hente siste arbeidsforhold |

### 3. Ny datahentingsmodell: Page → Wrapper → Komponent

Appen kjører i Modia-internflaten der en veileder kan bytte person (fnr) i dekoratøren. Vi innførte en hybrid-modell med tre lag:

1. **`page.tsx`** (Server Component) — henter Modia-kontekst server-side og starter datahenting. Sender et _uløst_ promise videre.
2. **`Wrapper.tsx`** (Client Component) — holder promise i state. Lytter på kontekst-endringer (nytt fnr fra dekoratøren) og trigger refetch via `startTransition`.
3. **`Komponent.tsx`** (Client Component) — pakker ut promiset med `use()`. Ren presentasjon.

En gjenbrukbar hook, `useServerData`, kapsler inn logikken for å oppdage fnr-endringer og trigge nye server-kall:

| Fase | Hva skjer |
|---|---|
| **Server-render** | `page.tsx` kaller server function → sender promise til Wrapper |
| **Hydration** | Wrapper hydreres med server-promiset, `use()` resolver umiddelbart |
| **Bruker bytter person** | `useServerData` oppdager nytt fnr → `startTransition` → nytt promise → `use()` resolver ny data |

### 4. Autentisering — fra per-side HOF til global proxy

I Pages Router måtte hver side pakkes inn i `withAuthenticatedPage` (brukt i 16 filer). Glemte man det på én side, var den ubeskyttet.

Nå løses dette på tre nivåer:

| Behov | Før | Etter |
|---|---|---|
| Sidebeskyttelse | `withAuthenticatedPage` HOF per side | `proxy.ts` — validerer Azure-token globalt via matcher-config |
| Server-side API-kall | API-routes med manuell auth | `authenticatedFetch` — OBO-token, headere, fetch og feilhåndtering i ett |
| Klient-komponenter (dekoratør/visittkort) | API-routes i `pages/api/` | `lagProxyKall` factory → route handlers i `(decorator-proxy)/` |

### 5. API-routes redusert med 79 %

I Pages Router hadde vi **48 filer** under `src/pages/api/` — en blanding av ekte API-proxyer, mock-filer og hjelpere. Datatrafikken gikk fra klienten, via API-routes, til backend.

Nå går det meste av datatrafikken **direkte fra server til backend** via server functions. De gjenværende **10 route handlers** er utelukkende:
- **Proxy-ruter** for klient-komponenter vi ikke kontrollerer (dekoratør, visittkort) — 7 stk under `(decorator-proxy)/`
- **Stillingssøk** — 1 stk (`api/stillingssok/`)
- **Helsesjekker** — 2 stk (`api/isalive/`, `api/isready/`)

### 6. React-kontekster redusert fra 8 til 3

Før migreringen brukte appen 8 React-kontekster for å dele state mellom komponenter:

- `config-context` — **fjernet** (config hentes server-side)
- `error-context` — **fjernet** (feilhåndtering i server functions)
- `featuretoggle-context` — **fjernet** (feature flags evalueres server-side)
- `hendelse-context` — **fjernet/refaktorert**
- `params-from-context` — **fjernet** (erstattet av server-side Modia-kontekst)
- `registrering-context` — **fjernet** (skjema-state håndteres lokalt)
- `hendelse-visning-context` — **beholdt**
- `tidslinje-selection-context` → `filter-hendelse-context` — **beholdt (omdøpt)**

Lagt til:
- `modia-context` — **ny** (erstatter flere av de gamle kontekstene med én kilde for fnr)

### 7. Feature flags evalueres server-side

I Pages Router ble feature toggles hentet via en klient-side API-route som returnerte rå definisjoner. Klienten evaluerte flaggene selv. Nå evalueres flaggene **server-side** i `lib/unleash/feature-flags.ts`, noe som fjerner unødvendig eksponering av flagg-definisjoner til klienten.

### 8. Verktøykjeden modernisert

| Verktøy | Før | Etter |
|---|---|---|
| Testframework | Jest | **Vitest** |
| Linting | ESLint + eslint-config-next | **Biome** |
| Formatering | Prettier | **Biome** |
| Klient-fetching | SWR | **Fjernet** (server functions) |
| Utilities | Lodash | **Fjernet** (native JS) |
| Typeahead | react-autosuggest | **Fjernet** (egen implementasjon) |

Biome gir oss både linting og formatering i ett verktøy, med vesentlig bedre ytelse enn ESLint + Prettier.

### 9. Testdekning dramatisk forbedret

Testene gikk fra **7 filer med ren utility-testing** til **18 filer med 227 tester** som dekker:

| Kategori | Testfiler |
|---|---|
| Auth-logikk | `validateToken.test.ts`, `oboToken.test.ts` |
| Authenticated fetch | `authenticatedFetch.test.ts` |
| Proxy/middleware | `proxy.test.ts`, `proxy-handler.test.ts` |
| Modia-headere | `modia-headers.test.ts` |
| Komponentrendering | `forside.test.tsx`, `Bekreftelse.test.tsx`, `HistorikkPeriode.test.tsx`, `RegistreringSjekk.test.tsx`, `RegistrerArbeidssoeker.test.tsx` |
| Skjemavalidering | `OpplysningerSkjema.test.tsx`, `mapSnapshotOpplysningerTilRegistrering.test.ts`, `TilbyOpplysningerFraGammelPeriode.test.tsx` |
| Utilities | `oversett-sluttaarsak.test.ts`, `sorter-bekreftelser.test.ts`, `tidslinje-varsel-utils.test.ts` |
| UI-komponent | `ManglerPersonEllerEnhet.test.tsx` |

Alle 227 tester kjøres på ~3 sekunder med Vitest.

---

## Arkitekturoversikt etter migrering

```
src/
├── app/                              # App Router — alle sider og route handlers
│   ├── (forside)/                    # Forsiden
│   ├── bekreftelse/                  # Bekreftelse av arbeidssøkerperiode
│   ├── registrering-arbeidssoker/    # Registreringsskjema
│   ├── registrering-arbeidssoeker-sjekk/ # Sjekk om registrering er mulig
│   ├── oppdater-opplysninger/        # Endre opplysninger
│   ├── historikk/                    # Historikk-visning
│   ├── tidslinjer/                   # Tidslinjevisning
│   ├── avslutt-arbeidssoekerperiode/ # Avslutt periode
│   ├── slett-arbeidssoekerperiode/   # Slett periode
│   ├── (decorator-proxy)/            # Route handlers for dekoratør/visittkort
│   ├── api/                          # Stillingssøk + helsesjekker
│   ├── layout.tsx                    # Root layout
│   └── error.tsx                     # Global feilside
├── proxy.ts                          # Global auth-beskyttelse (Next.js 16 proxy)
├── lib/
│   ├── api/                          # Server functions for all backend-kommunikasjon
│   ├── auth/                         # Token-validering og OBO-utveksling
│   ├── authenticatedFetch.ts         # Auth + fetch + feilhåndtering i ett
│   ├── modia-headers.ts              # NAV-headere med OBO-token + trace-id
│   └── unleash/                      # Server-side feature flag evaluering
├── contexts/                         # 3 gjenværende React-kontekster
├── components/                       # Delte UI-komponenter
├── hooks/                            # Custom hooks (inkl. useServerData)
└── mocks/                            # Test-mocks
```

---

## Konkrete gevinster

### For brukeren (veileder)
- **Raskere opplevd ytelse**: Data er tilgjengelig ved første sidelastning — ingen «spinner → data»-hopp.
- **Sømløs personbytte**: Når veileder bytter person i dekoratøren, oppdateres data via `startTransition` uten full sidelastning.

### For utviklere
- **~20 % mindre kode** å vedlikeholde (14 935 → 11 881 linjer).
- **Færre konsepter**: 3 kontekster i stedet for 8. 10 route handlers i stedet for 48 API-filer.
- **Tryggere endringer**: 227 tester som kjøres på 3 sekunder, mot 7 rene utility-tester før.
- **Enklere auth**: Sidebeskyttelse er global — ingen risiko for å glemme auth-wrapper på en ny side.
- **Moderne verktøykjede**: Vitest + Biome er raskere og enklere å konfigurere enn Jest + ESLint + Prettier.
- **Færre avhengigheter**: 7 færre npm-pakker (SWR, Lodash, react-autosuggest, Jest, ESLint, eslint-config-next, Prettier).

### For sikkerhet
- **Mindre angrepsflate**: Datahenting skjer server-til-server. Ingen API-routes eksponerer backend-endepunkter til nettleseren unødvendig.
- **Feature flags skjult**: Unleash-evalueringen skjer server-side — klienten ser bare resultatet, ikke flagg-definisjonene.

---

## Løst teknisk gjeld

### `strictNullChecks` aktivert globalt
Før migreringen hadde rot-`tsconfig.json` `strict: false` uten eksplisitt `strictNullChecks`, som betød at TypeScript ikke klarte å narrowe discriminated unions (f.eks. `FetchResult<T>`). Underveis i migreringen ble det brukt en lokal `src/app/tsconfig.json` med `strictNullChecks: true` som workaround. Nå er `strictNullChecks: true` satt i rot-`tsconfig.json`, den lokale overriden er fjernet, og IDE og CI er i sync. Discriminated unions fungerer uten type assertions.

---

## Tekniske detaljer

- **Next.js-versjon**: 16.1.6 (uendret)
- **Antall commits i migreringen**: 84
- **Tidsperiode**: Februar–mars 2026
- **Strategi**: Gradvis migrering, én rute om gangen (tidslinjer først, deretter historikk, forside, og resten)