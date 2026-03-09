# Migrering av `/bekreftelse` fra Pages Router til App Router

## Oversikt
FRA MEG: lag type basert på bekreftelse-apiet (mangler på hent også tror jeg..)
Siste gjenværende side i pages routeren. Lar veileder bekrefte arbeidssøkerperioder på vegne av en bruker.
Følger det etablerte **Page → Wrapper → Komponent**-mønsteret fra resten av app routeren.

## Hva som allerede finnes (ingen ny kode nødvendig)

| Komponent | Plassering | Status |
|---|---|---|
| `getBekreftelser` (hent tilgjengelige) | `app/lib/api/bekreftelse.ts` | ✅ Brukes av forsiden |
| Mock-data | `app/mocks/bekreftelser.json` | ✅ Finnes |
| `authenticatedFetch` | `app/lib/authenticatedFetch.ts` | ✅ Ferdig |
| `useServerData` hook | `app/hooks/useServerData.ts` | ✅ Ferdig |
| `useModiaContext` | `app/contexts/modia-context.tsx` | ✅ Ferdig |
| `TilbakeTilForside` | `components/tilbake-til-forside.tsx` | ✅ Delt, brukes av app router |
| Tracking (`loggAktivitet`) | `lib/tracking.ts` | ✅ Delt |
| `formaterDato` | `lib/date-utils.ts` | ✅ Delt |

## Hva som må bygges

### 1. Server action: `sendBekreftelse` (~30 linjer)

Legg til i eksisterende `app/lib/api/bekreftelse.ts`. Følger nøyaktig samme mønster som `stoppPeriode`:

- Tar inn: `identitetsnummer`, `harJobbetIDennePerioden`, `vilFortsetteSomArbeidssoeker`, `bekreftelseId`
- Bruker `authenticatedFetch` til å POSTe mot `BEKREFTELSE_API_URL/api/v1/bekreftelse`
- Returnerer `{ ok: true }` | `{ ok: false; error: string }`
- Mock-modus: returnerer `{ ok: true }` etter kort delay
- Scope: bruk eksisterende `BEKREFTELSE_API_SCOPE` som allerede er definert i filen

### 2. `page.tsx` — Server Component (~20 linjer)

Standard mønster:

```tsx
// app/bekreftelse/page.tsx
export default async function BekreftelsePage() {
    const modiaContext = await hentModiaContext();
    const bekreftelserPromise = getBekreftelser(modiaContext.fnr);

    return (
        <>
            <TilbakeTilForside sidenavn="Bekreftelse" />
            <Heading size="large">Bekreftelse</Heading>
            <Suspense fallback={<Loader />}>
                <ManglerPersonEllerEnhet />
                <BekreftelseWrapper initialBekreftelserPromise={bekreftelserPromise} />
            </Suspense>
        </>
    );
}
```

### 3. `BekreftelseWrapper.tsx` — Client Component (~20 linjer)

Følger `ForsideWrapper` nøyaktig:

```tsx
// app/bekreftelse/components/BekreftelseWrapper.tsx
function BekreftelseWrapper({ initialBekreftelserPromise }) {
    const { dataPromise, isPending } = useServerData(initialBekreftelserPromise, getBekreftelser);

    return (
        <Suspense fallback={<Loader />}>
            {isPending && <Loader />}
            <BekreftelseSkjema bekreftelserPromise={dataPromise} />
        </Suspense>
    );
}
```

### 4. `BekreftelseSkjema.tsx` — Client Component (~150 linjer)

Hovedarbeidet. En tilnærmet direkte omskriving av eksisterende `pages/bekreftelse.tsx`, med disse endringene:

| Gammel (pages) | Ny (app router) |
|---|---|
| `useApiKall` for å hente bekreftelser | `use(bekreftelserPromise)` — data kommer via prop |
| `useParamsFromContext()` for `fnr` | `useModiaContext()` |
| `fetch('/api/bekreftelse')` for submit | `sendBekreftelse()` server action |
| `useRouter` fra `next/router` | `useRouter` fra `next/navigation` |
| `enableMock`-sjekk + mock-URL | Håndtert i server action (`process.env.ENABLE_MOCK`) |
| Sortering av bekreftelser på klient | Flytt til `getBekreftelser` server-side |

Selve skjema-UI-en (RadioGroups, submit-knapp, tilstandsmaskin for `harSendtSkjema` / `tilgjengeligeBekreftelser` / `aktivBekreftelse`) forblir i praksis den samme.

### 5. Sorter bekreftelser server-side (~2 linjer)

Legg til `.sort()` i `getBekreftelser` i `app/lib/api/bekreftelse.ts` slik at klienten slipper å sortere.
Fjerner TODO-kommentaren fra den gamle koden.

### 6. Oppdater lenke fra forsiden

`app/(forside)/components/Bekreftelse.tsx` peker allerede på `/bekreftelse` — dette fungerer uten endringer.

## Filstruktur

```
src/app/bekreftelse/
├── PLAN.md                           # Denne filen (kan slettes etterpå)
├── page.tsx                          # Server Component
└── components/
    ├── BekreftelseWrapper.tsx        # Client wrapper (useServerData)
    └── BekreftelseSkjema.tsx         # Client skjema (hovedomskrivingen)
```

## Estimat

| Oppgave | Størrelse | Merknad |
|---|---|---|
| `sendBekreftelse` server action | ~30 linjer | Kopier mønster fra `stoppPeriode` |
| `page.tsx` | ~20 linjer | Boilerplate, kopier fra eksisterende side |
| `BekreftelseWrapper.tsx` | ~20 linjer | Boilerplate, kopier fra `ForsideWrapper` |
| `BekreftelseSkjema.tsx` | ~150 linjer | Hovedarbeid — omskriving av eksisterende skjema |
| Sortering server-side | ~2 linjer | I eksisterende `getBekreftelser` |
| **Totalt** | **~220 linjer** | **~1–2 timer** |

## Hva som kan slettes etter migrering

Når den nye bekreftelse-siden er verifisert og fungerer, kan hele pages-routeren fjernes:

### Pages-filer
- `src/pages/bekreftelse.tsx`
- `src/pages/_app.tsx`
- `src/pages/_document.tsx`
- `src/pages/404.tsx`
- `src/pages/feil.tsx`

### Pages API-routes
- `src/pages/api/bekreftelse.ts`
- `src/pages/api/tilgjengelige-bekreftelser.ts`
- `src/pages/api/config.ts`
- `src/pages/api/features.ts`
- `src/pages/api/hent-modia-context.ts`
- `src/pages/api/mocks/` (hele mappen)

### Legacy contexts
- `src/contexts/config-context.tsx`
- `src/contexts/featuretoggle-context.js`
- `src/contexts/params-from-context.tsx`
- `src/contexts/error-context.tsx`
- `src/contexts/registrering-context.tsx`

### Legacy hooks
- `src/hooks/useApiKall.tsx`
- `src/hooks/useSprak.tsx`

### Legacy auth
- `src/auth/` (hele mappen)

### Legacy lib (kun brukt av pages router)
- `src/lib/api-utils.ts`
- `src/lib/next-api-handler.ts`
- `src/lib/proxy-api-kall.ts`
- `src/lib/resolve-dynamic-url.ts`
- `src/lib/resolve–dynamic-url.test.ts`
- `src/lib/query-to-string.ts`
- `src/lib/query-to-string.test.ts`

### Legacy components (kun brukt av `_app.tsx`)
- `src/components/InternflateDecorator.tsx`
- `src/components/visittkort-script.tsx`
- `src/components/visittkort-webcomponent.tsx`
- `src/components/init-umami.tsx`
- `src/components/feilmeldinger/feilmeldinger.tsx`

### OBS: `featureMocks`

`app/lib/unleash/feature-flags.ts` importerer `featureMocks` fra `pages/api/mocks/features.ts`.
Flytt denne konstanten til `app/mocks/feature-mocks.ts` **før** du sletter mock-filen.
