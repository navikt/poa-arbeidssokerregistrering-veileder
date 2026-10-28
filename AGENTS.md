# AGENTS.md

This file provides guidance for AI coding agents working on the `poa-arbeidssokerregistrering-veileder` repository.

## Project Overview

This is a **Next.js 16** application (App Router) that lets Nav counselors ("veiledere") manage a person's job-seeker status within Nav's internal tool Modia. The app runs inside Nav's Modia "internflate" (internal surface) and communicates with several backend services via server functions and OBO (On-Behalf-Of) token exchange.

**Key capabilities:**
- Register a person as a job seeker
- View/edit registration details and history
- Confirm, end, or delete job-seeker periods
- View timeline and confirmation history
- View an office-level job-seeker overview when no person is selected, and individual kartlegging data when a person is selected

## Commands

| Command | Purpose |
|---|---|
| `pnpm install` | Install dependencies (requires GitHub PAT for `@navikt` packages) |
| `pnpm run build` | Production build |
| `pnpm test` | Run all tests once (Vitest) |
| `pnpm run test:watch` | Run tests in watch mode |
| `pnpm run lint` | Run Biome linter — check for errors before committing |
| `pnpm run lint:fix` | Auto-fix lint/format issues in `src/` (`biome check --write src`) |
| `pnpm run typecheck` | Run TypeScript type checking (`tsc`) |
| `pnpm run dev` | Start dev server (with pino-pretty logging) |
| `pnpm run storybook` | Start Storybook on port 6006 |

**Typical workflow:** make changes → `pnpm run lint` → `pnpm test`.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 24.22.1 | Runtime (see `.nvmrc`) |
| Next.js | 16 | Framework (App Router, Server Components, Server Functions) |
| React | 19 | UI library (uses `use()` hook for promise unwrapping) |
| TypeScript | 7.0.2 | Type safety (`strictNullChecks: true`, `noUncheckedIndexedAccess: true`) |
| Tailwind CSS | 4 | Styling (with `@navikt/ds-tailwind` preset) |
| Biome | 2.5 | Linting and formatting (replaces ESLint + Prettier) |
| Vitest | 5 | Unit testing |
| Testing Library | 16 | Component testing |
| MSW | 3 | API mocking (Storybook) |
| Storybook | 10 | Component development |
| Aksel (`@navikt/ds-react`) | 8 | Nav Design System components |
| Unleash | — | Feature toggles |
| Grafana Faro | — | Frontend observability |

## Project Structure

```
src/
├── app/                          # Next.js App Router pages (forenklet tre)
│   ├── (decorator-proxy)/        # Route handlers proxying calls for Modia decorator
│   ├── (forside)/                # Person view or office kartlegging overview (route group)
│   ├── api/                      # API route handlers (health checks, stillingssøk)
│   ├── registrering-arbeidssoker/  # Registration flow
│   ├── registrering-arbeidssoeker-sjekk/  # Eligibility check before registration
│   ├── oppdater-opplysninger/    # Update details flow
│   ├── tidslinjer/               # Timeline view
│   ├── bekreftelse/              # Confirmation flow
│   ├── historikk/                # History view
│   ├── avslutt-arbeidssoekerperiode/
│   ├── slett-arbeidssoekerperiode/
│   ├── arbeidssoekerperiode-er-avsluttet/
│   ├── arbeidssoekerperiode-er-slettet/
│   ├── kvittering-arbeidssoker/
│   ├── kvittering-oppdatert-opplysninger/
│   ├── veiledning/               # Guidance pages (e.g. missing Aa-register access)
│   ├── layout.tsx                # Root layout (providers, decorator, visittkort)
│   ├── error.tsx                 # Global error boundary
│   └── not-found.tsx
├── components/                   # Shared UI components
│   ├── skjema/                   # Form components (registration/update)
│   ├── radio-gruppe/             # Reusable radio group
│   ├── visittkort.tsx            # Person visittkort
│   ├── decorator-intern.tsx      # Modia decorator integration
│   ├── tilbake-til-forside.tsx
│   ├── ManglerTilganger.tsx      # Missing-access UI
│   └── TrackPageView.tsx         # Faro/analytics tracking
├── contexts/                     # React contexts
│   ├── modia-context.tsx         # Modia fnr/enhetId context
│   ├── filter-hendelse-context.tsx
│   └── hendelse-visning-context.tsx
├── hooks/
│   ├── useServerData.ts          # Core hook for server data fetching with refetch
│   └── useScrollSpy.ts
├── lib/
│   ├── api/                      # Server functions, including kartlegging and kartlegging-enkeltperson
│   ├── auth/                     # Authentication (OBO token, validation)
│   ├── faro/                     # Grafana Faro initialization
│   ├── mocks/                    # JSON mock data for tests/Storybook
│   ├── unleash/                  # Feature flag definitions
│   ├── alle-hendelser.ts         # Event aggregation for timeline/history
│   ├── bygg-opplysninger-payload.ts
│   ├── dager-langtidsledig.ts
│   ├── oversett-sluttaarsak.ts
│   ├── tilgang.ts                # Access checks
│   ├── tracking.ts               # Analytics tracking
│   ├── authenticatedFetch.ts     # Central authenticated fetch utility
│   ├── modia-context-api.ts      # Modia context API client
│   └── modia-headers.ts          # Modia request headers
├── model/                        # TypeScript type definitions and domain models
├── styles/                       # Global CSS (Tailwind)
├── test/                         # Test stubs and utilities
├── types/                        # Additional type declarations
├── instrumentation.ts            # Rejects server mock mode in production clusters
├── proxy.ts                      # Middleware: Azure token validation
└── proxy.test.ts
```

## Architecture: Data Fetching Pattern

The app uses a three-layer pattern for data fetching. Understanding this is critical before making changes.

### Layer 1: `page.tsx` — Server Component
Fetches Modia context and starts data loading. Passes an **unresolved promise** to the Wrapper.

```tsx
export default async function SomePage() {
    const ctx = await hentModiaContext();
    const dataPromise = getData(ctx.fnr); // DO NOT await
    return (
        <Suspense fallback={<Loading />}>
            <Wrapper initialDataPromise={dataPromise} />
        </Suspense>
    );
}
```

### Layer 2: `Wrapper.tsx` — Client Component (`'use client'`)
Holds the promise in state. Listens for person and unit changes in Modia context and triggers refetch via `startTransition`.

```tsx
const Wrapper = ({ initialDataPromise }) => {
    const { dataPromise, isPending } = useServerData(initialDataPromise, getData);
    return (
        <Suspense fallback={<LoaderSkeleton />}>
            {isPending && <Loader title="Henter data" />}
            <Component dataPromise={dataPromise} />
        </Suspense>
    );
};
```

### Layer 3: `Component.tsx` — Client Component (`'use client'`)
Unwraps the promise with React 19's `use()` hook. Pure presentation.

```tsx
const Component = ({ dataPromise }) => {
    const data = use(dataPromise);
    return <div>{/* render data */}</div>;
};
```

### `useServerData` hook
Listens for both `fnr` and `enhetId` changes from Modia context and sets a new server promise inside a `startTransition`. The fetch callback receives `(fnr, enhetId)`. Returns `{ dataPromise, dataContext, isPending }`, where `dataContext` identifies the person and unit associated with the promise.

- The optional third argument, `initialContext`, records the server context associated with the initial promise.
- The optional fourth argument, `refreshOnMount`, defaults to `false`. Initial refetch is skipped only when this is false and the stored context matches the active context. Without `initialContext`, the hook assumes the initial promise belongs to the active client context.
- Use a stable fetch callback, such as a module-level function or `useCallback`, because changes to it also trigger refetch.

The examples above show the basic pattern. The front page additionally passes `initialContext`, compares `dataContext` with the active context, and renders a loader while they differ. `ForsideWrapper` remounts its person or office content on context changes and requests fresh data with `refreshOnMount`. Preserve these checks so data for the previous person or unit is not shown under the new context. See `src/app/(forside)/components/ForsideWrapper.tsx`.

**Important:** When adding a new page that fetches data, follow this exact pattern. Do NOT `await` the data promise in `page.tsx` — pass it unresolved.

## Authentication Model

| Concern | Mechanism | Location |
|---|---|---|
| Page protection | `proxy.ts` middleware validates Azure AD token | `src/proxy.ts` |
| Protected domain API calls | `authenticatedFetch` with OBO token exchange | `src/lib/authenticatedFetch.ts` |
| Modia context | Direct `fetch` with OBO token exchange | `src/lib/modia-context-api.ts` |
| Decorator proxy routes | `lagProxyKall` route handlers with OBO token | `src/app/(decorator-proxy)/` |
| PAM Ontologi | Direct `fetch` without OBO | `src/lib/api/aareg.ts`, `src/app/api/stillingssok/route.ts` |

Use `authenticatedFetch` for new protected domain API calls. It handles OBO token exchange, Modia headers, tracing, and structured error handling for both RFC 9457 Problem Details and the inngang API's `FeilV2` format. Existing Modia context and decorator proxy calls handle OBO themselves. PAM Ontologi calls and public CDN asset lookups use direct `fetch` without OBO; these are not templates for protected API integrations.

## Mock mode

- `ENABLE_MOCK=enabled` activates server-side mock branches in API functions and Modia context, bypasses token validation in `proxy.ts`, and disables outgoing decorator proxy calls. It is for local development and demos, not production.
- `NEXT_PUBLIC_ENABLE_MOCK=enabled` controls mock presentation in the root layout, including decorator visibility and the visittkort mock flag. Keep both flags aligned when running locally.
- Mock fixtures live in `src/lib/mocks/`; `DemoLabel` and `DemoPanel` provide demo UI when server mock mode is enabled.
- `src/instrumentation.ts` rejects `ENABLE_MOCK=enabled` when `NAIS_CLUSTER_NAME` starts with `prod-`. Do not remove or bypass this guard.

## Code Style and Formatting

This project uses **Biome** (not ESLint/Prettier). Configuration is in `biome.json`.

### Git hooks
The Husky pre-commit hook runs `tsc` (type checking) and `lint-staged` (Biome format on staged files in `src/app/`). The pre-push hook additionally runs `tsc` and `pnpm run test:ci`. Ensure your changes pass both before pushing.

## Git Workflow
 
- **`main` branch** deploys to both dev and prod. Keep it green.
- **`dev/*` branches** (e.g., `dev/my-feature`) deploy only to dev. Use this prefix for work-in-progress that needs a dev environment.
- **CI triggers** are push events to `main` and `dev/*` only. Other branches and pull request events do not trigger the current workflow. Run checks locally before review; do not assume a pull request has been tested by CI.
- **Pull requests** should target `main`. Ensure `pnpm run lint`, `pnpm test`, and `pnpm run build` all pass before requesting review.
- **Commit messages** should be descriptive and in English. Reference issue numbers where applicable.
- **The pre-commit hook** runs `tsc` and `lint-staged` automatically, and the pre-push hook runs `tsc` and `pnpm run test:ci` — do not skip them.

## Best Practices

### General

1. **Use the `@/` path alias** for all imports from `src/`. It is configured in both `tsconfig.json` and `vitest.config.mts`.
2. **Never use `console.log`** — it's a Biome error. Use structured logging via `@navikt/next-logger` on the server side. On the client, use `console.error` or `console.warn` when necessary.
3. **Respect `strictNullChecks` and `noUncheckedIndexedAccess`.** Always handle `undefined` when accessing array/object indices.
4. **Write in Norwegian** for user-facing strings and comments related to domain logic. Technical comments can be in English.

### React & Next.js

5. **Mark client components explicitly** with `'use client'` at the top of the file. Server Components are the default.
6. **Use `server-only`** import in modules that must never be bundled for the client (auth, OBO tokens, etc.).
7. **Follow the Page → Wrapper → Component pattern** for pages that fetch data. Do not break this pattern.
8. **Use React 19's `use()` hook** to unwrap promises in client components — do not use `useEffect` + `useState` for data fetching.
9. **Wrap data-dependent components in `<Suspense>`** with appropriate fallback skeletons.
10. **Use `startTransition`** when updating data promises on the client (handled by `useServerData`).
11. **Use Nav Aksel components** (`@navikt/ds-react`) for all UI elements. Do not introduce custom UI where Aksel provides a suitable component.

### Styling

12. **Use Tailwind CSS** with the `@navikt/ds-tailwind` preset. Prefer Tailwind utility classes over custom CSS.
13. **Do not use `!important`** in CSS (enforced by Biome, except in `globals.css` where it is explicitly allowed).

### API Calls & Server Functions

14. **New protected domain API calls must go through `authenticatedFetch`** in `src/lib/authenticatedFetch.ts`. Existing direct-fetch integrations are documented under Authentication Model; do not copy them to bypass OBO for a protected API.
15. **Handle the `FetchResult` discriminated union** (`ok: true | false`) — never assume success.
16. **Server functions** (used for data fetching) live in `src/lib/api/`. Add new API integrations there.
17. **Use the `'use server'` directive** on functions that need to be callable from the client as server functions.

### Error Handling

18. **Use RFC 9457 Problem Details** format for structured error responses. The `authenticatedFetch` utility parses these automatically.
19. **Let errors bubble to the nearest error boundary** (`error.tsx`) for unexpected failures. Use explicit error UI for expected/domain errors.
20. **Log errors with context** using `@navikt/next-logger`'s structured logging (event name, HTTP status, etc.).

### Testing

21. **Place test files next to the code they test** using the `.test.ts` / `.test.tsx` suffix (e.g., `authenticatedFetch.test.ts`).
22. **Test environment is `node`** (not `jsdom`) by default. If a specific test needs a browser environment, configure it per-file with `// @vitest-environment jsdom`.
23. **Vitest globals are enabled** — no need to import `describe`, `it`, `expect`, etc.
24. **Use the test stubs** in `src/test/` — `server-only` and `@navikt/next-logger` are automatically stubbed via aliases in `vitest.config.mts`. Do NOT add manual `vi.mock('server-only')` calls.
25. **Use mock data** from `src/lib/mocks/` for consistent test fixtures.
26. **Use MSW** for mocking HTTP requests in integration tests and Storybook stories.

### Feature Toggles

27. **Use Unleash** for feature flags. Flag definitions live in `src/lib/unleash/feature-flags.ts`. Use the `@unleash/nextjs` integration.

### Deployment

28. **Branches prefixed with `dev/`** are deployed only to dev environment. The `main` branch deploys to both dev and prod.
29. **Static assets are uploaded to Nav CDN** (`cdn.nav.no`). The `assetPrefix` in `next.config.js` handles this in production.
30. **The app runs as a standalone Next.js build** in a Docker container on NAIS (GCP).
31. **Knip** is run in CI to detect unused exports/dependencies. Address any findings.

### Security

32. **Never expose secrets or tokens in client-side code.** All token handling happens server-side.
33. **OBO token exchange is mandatory** for protected backend calls. The `authenticatedFetch` utility handles this for domain APIs; Modia context and decorator proxy calls handle it separately. PAM Ontologi and public CDN lookups do not use OBO.
34. **The proxy middleware** (`src/proxy.ts`) validates Azure AD tokens on matched requests unless server mock mode is enabled. Its matcher excludes `api/isalive`, `api/isready`, `_next/static`, `_next/image`, and `favicon.ico`.

## External Services

| Service | Purpose |
|---|---|
| `paw-arbeidssokerregisteret-api-inngang` | Start/stop/delete periods, check eligibility, register/update details |
| `paw-arbeidssoekerregisteret-api-oppslag-v2` | Fetch periods and snapshots |
| `paw-arbeidssoekerregisteret-api-bekreftelse` | Fetch available confirmations |
| `paw-arbeidssoekerregisteret-api-kartlegging` | Office-level job-seeker overview and individual kartlegging data |
| `modiacontextholder` | Active user (fnr) and unit from Modia context |
| `aareg-services` | Fetch latest employment records |
| `pam-ontologi` | Typeahead search for job titles and STYRK code conversion |

## Boundaries

### ✅ Always do
- Run `pnpm run lint` and `pnpm test` before considering work complete.
- Use `authenticatedFetch` for new protected domain API calls. Preserve the existing integration-specific handling documented under Authentication Model.
- Follow the **Page → Wrapper → Component** data fetching pattern when creating or modifying pages.
- Use the `@/` path alias for imports from `src/`.
- Use Aksel (`@navikt/ds-react`) components for UI. Use Tailwind for layout and spacing.
- Write user-facing strings in Norwegian.
- Handle `undefined` from indexed access (`noUncheckedIndexedAccess` is enabled).
- Place test files next to the code they test with the `.test.ts` / `.test.tsx` suffix.

### ⚠️ Ask first
- Adding new pnpm dependencies — check if an existing dependency or Aksel component already covers the need.
- Modifying `authenticatedFetch.ts`, `proxy.ts`, or anything in `src/lib/auth/` — these are security-critical.
- Changing the root layout (`src/app/layout.tsx`) — it wires up providers, the decorator, and visittkort.
- Altering NAIS configuration (`.nais/`) or the CI pipeline (`.github/workflows/deploy.yml`).
- Modifying or removing existing test stubs in `src/test/`.

### 🚫 Never do
- **Do not** Log tokens, headers.
- **Do not `await` the data promise in `page.tsx`** — this breaks streaming/Suspense. Pass the unresolved promise.
- **Do not bypass `authenticatedFetch`** for protected domain API calls with raw `fetch`. Existing direct-fetch exceptions are documented under Authentication Model.
- **Do not use ESLint or Prettier** — this project uses Biome exclusively.
- **Do not use `console.log`** — Biome will reject it. Use `@navikt/next-logger` on the server or `console.error`/`console.warn` on the client.
- **Do not add `vi.mock('server-only')` in tests** — it's handled globally by the Vitest alias config in `vitest.config.mts`.
- **Do not expose secrets, tokens, or API keys in client-side code** — all token handling is server-side only.
- **Do not commit directly to `main`** without passing lint, tests, and build.
