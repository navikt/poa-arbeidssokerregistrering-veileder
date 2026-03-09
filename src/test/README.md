# Test-stubs

Denne mappen inneholder stubs som brukes av Vitest under testing.

## `server-only-stub.ts`

Next.js-pakken `server-only` kaster en feil hvis den importeres utenfor en server-kontekst.
Flere av modulene våre (f.eks. `src/lib/auth/oboToken.ts`) har `import 'server-only'` øverst i filen,
noe som gjør at Vitest feiler når den forsøker å laste disse modulene.

I `vitest.config.ts` er `server-only` aliasert til denne tom-stubben slik at importen blir en no-op i testmiljøet.
Dette gjøres globalt via Vite sin `resolve.alias`, så man slipper å legge til `vi.mock('server-only', () => ({}))` i hver enkelt testfil.