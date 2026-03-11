# Test-stubs

Denne mappen inneholder stubs som brukes av Vitest under testing.

## `server-only-stub.ts`

Next.js-pakken `server-only` kaster en feil hvis den importeres utenfor en server-kontekst.
Flere av modulene våre (f.eks. `src/lib/auth/oboToken.ts`) har `import 'server-only'` øverst i filen,
noe som gjør at Vitest feiler når den forsøker å laste disse modulene.

I `vitest.config.ts` er `server-only` aliasert til denne tom-stubben slik at importen blir en no-op i testmiljøet.
Dette gjøres globalt via Vite sin `resolve.alias`, så man slipper å legge til `vi.mock('server-only', () => ({}))` i hver enkelt testfil.

## `next-logger-stub.ts`

`@navikt/next-logger` brukes til strukturert logging på serversiden. I testmiljøet ønsker vi verken
at loggmeldinger skrives til stdout eller at tester feiler fordi loggeren ikke er tilgjengelig.

Stubben eksporterer et `logger`-objekt der alle metoder (`info`, `warn`, `error`, `debug`, `trace`)
er `vi.fn()`-spier. Det betyr at:

- Logger-kall er stille under test (ingen output).
- Tester fortsatt kan gjøre assertions på logger-kall, f.eks. `expect(logger.error).toHaveBeenCalledWith(...)`.

I `vitest.config.ts` er `@navikt/next-logger` aliasert til denne stubben, så det **ikke** er nødvendig
å legge til `vi.mock('@navikt/next-logger', ...)` i testfilene.