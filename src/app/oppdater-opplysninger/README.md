page.tsx (Server Component)
  └─ hentModiaContext() → gets fnr
  └─ getSnapshot(fnr)   → gets existing opplysninger (already in snapshot.opplysning!)
  └─ passes promise to ↓

OppdaterOpplysningerWrapper.tsx (Client Component, 'use client')
  └─ useServerData(initialSnapshotPromise, getSnapshot)
  └─ resolves snapshot → extracts initialFormState from snapshot.opplysning
  └─ renders ↓

OppdaterOpplysningerSkjema.tsx (Client Component, 'use client')
  └─ owns form state via useReducer or useState (NO global context needed)
  └─ renders DinSituasjon, SisteJobb, Utdanning, Hindringer (new app-router versions)
  └─ submit button calls a server action to POST opplysninger

Summary: what goes where

| Concern | Old (pages) | New (app router) |
|---|---|---|
| Get `fnr` | `useParamsFromContext()` | `hentModiaContext()` on server, `useModiaContext()` for refetch |
| Fetch opplysninger | `RegistreringProvider` → client-side `fetch` | `getSnapshot()` in `page.tsx` — already contains `opplysning` |
| Form state | `RegistreringProvider` context | Local `useState` in skjema component |
| Validation | `useEffect` in context | Pure function + `useMemo` |
| Submit | Client-side `fetch('/api/opplysninger')` | Server action `oppdaterOpplysninger()` |
| Aa-registeret lookup | Client-side `useSWR` | Server action or fetched in `page.tsx` |
| Mock routing | `enableMock ? '/api/mocks/...' : '/api/...'` | `process.env.ENABLE_MOCK` check in server action |
| `useRouter` (pages) | `next/router` | `next/navigation` |

### The key simplifications

1. **No `RegistreringProvider` needed** — just local state in one component
2. **No `useParamsFromContext` needed** — server gets `fnr` from `hentModiaContext()`, client gets it from `useModiaContext()`
3. **No `useConfig` / mock URL switching** — server actions handle this internally via `process.env`
4. **Validation is a pure function**, not a side effect
5. **The snapshot you already fetch contains the opplysninger** — no separate API call

This aligns perfectly with your instinct to "keep things very simplistic, isolated, and if possible, keep it on the server." The form is inherently client-side (user input), but everything around it — data fetching, auth, submission — lives on the server.


## APIs
- Ved innlast henter vi status på bruker --> oppslag-api/v3/snapshot
- Data mappes om til å passe skjema, og bruker kan evt gjøre endringer
- Når bruker trykker "oppdater" valideres skjema
- Endringer sendes til api-inngang/opplysninger 
Det er viss forskjell på data-strukturen fra snapshot til innsending til api-inngang/opplysninger
