# AGENTS.md

This file provides guidance for AI coding agents working on the `poa-arbeidssokerregistrering-veileder` repository.

## Project Overview

This is a **Next.js 16** application (App Router) that lets NAV counselors ("veiledere") manage a person's job-seeker status within NAV's internal tool Modia. The app runs inside NAV's Modia "internflate" (internal surface) and communicates with several backend services via server functions and OBO (On-Behalf-Of) token exchange.

**Key capabilities:**
- Register a person as a job seeker
- View/edit registration details and history
- Confirm, end, or delete job-seeker periods
- View timeline and confirmation history

## Commands

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies (requires GitHub PAT for `@navikt` packages) |
| `npm run build` | Production build |
| `npm test` | Run all tests once (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run Biome linter — check for errors before committing |
| `npm run format:app` | Auto-fix lint/format issues in `src/` |
| `npm run dev` | Start dev server (with pino-pretty logging) |
| `npm run storybook` | Start Storybook on port 6006 |

**Typical workflow:** make changes → `npm run lint` → `npm test`.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 24.13.0 | Runtime (see `.nvmrc`) |
| Next.js | 16 | Framework (App Router, Server Components, Server Functions) |
| React | 19 | UI library (uses `use()` hook for promise unwrapping) |
| TypeScript | 5.9 | Type safety (`strictNullChecks: true`, `noUncheckedIndexedAccess: true`) |
| Tailwind CSS | 4 | Styling (with `@navikt/ds-tailwind` preset) |
| Biome | 2.3 | Linting and formatting (replaces ESLint + Prettier) |
| Vitest | 4 | Unit testing |
| Testing Library | 16 | Component testing |
| MSW | 2 | API mocking (Storybook) |
| Storybook | 10 | Component development |
| Aksel (`@navikt/ds-react`) | 8 | NAV Design System components |
| Unleash | — | Feature toggles |
| Grafana Faro | — | Frontend observability |

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (decorator-proxy)/        # Route handlers proxying calls for Modia decorator
│   ├── (forside)/                # Front page (route group)
│   ├── api/                      # API route handlers (health checks, etc.)
│   ├── registrering-arbeidssoker/  # Registration flow
│   ├── oppdater-opplysninger/    # Update details flow
│   ├── tidslinjer/               # Timeline view
│   ├── bekreftelse/              # Confirmation flow
│   ├── historikk/                # History view
│   ├── avslutt-arbeidssoekerperiode/
│   ├── slett-arbeidssoekerperiode/
│   ├── layout.tsx                # Root layout (providers, decorator, visittkort)
│   ├── error.tsx                 # Global error boundary
│   └── not-found.tsx
├── components/                   # Shared UI components
│   ├── skjema/                   # Form components (registration/update)
│   ├── radio-gruppe/             # Reusable radio group
│   └── navspa/                   # NAV SPA integration
├── contexts/                     # React contexts
│   ├── modia-context.tsx         # Modia fnr/enhetId context
│   ├── filter-hendelse-context.tsx
│   └── hendelse-visning-context.tsx
├── hooks/
│   ├── useServerData.ts          # Core hook for server data fetching with refetch
│   └── useScrollSpy.ts
├── lib/
│   ├── api/                      # Server functions for backend communication
│   ├── auth/                     # Authentication (OBO token, validation)
│   ├── faro/                     # Grafana Faro initialization
│   ├── mocks/                    # JSON mock data for tests/Storybook
│   ├── unleash/                  # Feature flag definitions
│   ├── authenticatedFetch.ts     # Central authenticated fetch utility
│   ├── modia-context-api.ts      # Modia context API client
│   └── modia-headers.ts          # Modia request headers
├── model/                        # TypeScript type definitions and domain models
├── styles/                       # Global CSS (Tailwind)
├── test/                         # Test stubs and utilities
├── types/                        # Additional type declarations
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
Holds the promise in state. Listens for context changes (person switch) and triggers refetch via `startTransition`.

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
Skips initial render, listens for `fnr` changes from Modia context, and sets a new server promise inside a `startTransition`. Returns `{ dataPromise, isPending }`.

**Important:** When adding a new page that fetches data, follow this exact pattern. Do NOT `await` the data promise in `page.tsx` — pass it unresolved.

## Authentication Model

| Concern | Mechanism | Location |
|---|---|---|
| Page protection | `proxy.ts` middleware validates Azure AD token | `src/proxy.ts` |
| Server-side API calls | `authenticatedFetch` with OBO token exchange | `src/lib/authenticatedFetch.ts` |
| Decorator proxy routes | `lagProxyKall` route handlers with OBO token | `src/app/(decorator-proxy)/` |

All server-side calls use `authenticatedFetch` which handles OBO token exchange, Modia headers, structured error handling, and RFC 9457 Problem Details parsing.

## Code Style and Formatting

This project uses **Biome** (not ESLint/Prettier). Configuration is in `biome.json`.

### Pre-commit hook
The Husky pre-commit hook runs `tsc` (type checking) and `lint-staged` (Biome format on staged files in `src/app/`). Ensure your changes pass both before committing.

## Git Workflow
 
- **`main` branch** deploys to both dev and prod. Keep it green.
- **`dev/*` branches** (e.g., `dev/my-feature`) deploy only to dev. Use this prefix for work-in-progress that needs a dev environment.
- **All other branches** are not deployed automatically — CI runs tests and build only.
- **Pull requests** should target `main`. Ensure `npm run lint`, `npm test`, and `npm run build` all pass before requesting review.
- **Commit messages** should be descriptive and in English. Reference issue numbers where applicable.
- **The pre-commit hook** runs `tsc` and `lint-staged` automatically — do not skip it.

## Best Practices

### General

1. **Use the `@/` path alias** for all imports from `src/`. It is configured in both `tsconfig.json` and `vitest.config.ts`.
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
11. **Use NAV Aksel components** (`@navikt/ds-react`) for all UI elements. Do not introduce custom UI where Aksel provides a suitable component.

### Styling

12. **Use Tailwind CSS** with the `@navikt/ds-tailwind` preset. Prefer Tailwind utility classes over custom CSS.
13. **Do not use `!important`** in CSS (enforced by Biome, except in `globals.css` where it is explicitly allowed).

### API Calls & Server Functions

14. **All backend API calls must go through `authenticatedFetch`** in `src/lib/authenticatedFetch.ts`. Never call backend APIs directly with raw `fetch`.
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
24. **Use the test stubs** in `src/test/` — `server-only` and `@navikt/next-logger` are automatically stubbed via Vitest aliases. Do NOT add manual `vi.mock('server-only')` calls.
25. **Use mock data** from `src/lib/mocks/` for consistent test fixtures.
26. **Use MSW** for mocking HTTP requests in integration tests and Storybook stories.

### Feature Toggles

27. **Use Unleash** for feature flags. Flag definitions live in `src/lib/unleash/feature-flags.ts`. Use the `@unleash/nextjs` integration.

### Deployment

28. **Branches prefixed with `dev/`** are deployed only to dev environment. The `main` branch deploys to both dev and prod.
29. **Static assets are uploaded to NAV CDN** (`cdn.nav.no`). The `assetPrefix` in `next.config.js` handles this in production.
30. **The app runs as a standalone Next.js build** in a Docker container on NAIS (GCP).
31. **Knip** is run in CI to detect unused exports/dependencies. Address any findings.

### Security

32. **Never expose secrets or tokens in client-side code.** All token handling happens server-side.
33. **OBO token exchange is mandatory** for all backend calls. The `authenticatedFetch` utility handles this.
34. **The proxy middleware** (`src/proxy.ts`) validates Azure AD tokens on every request (except health checks and static assets).

## External Services

| Service | Purpose |
|---|---|
| `paw-arbeidssokerregisteret-api-inngang` | Start/stop/delete periods, check eligibility, register/update details |
| `paw-arbeidssoekerregisteret-api-oppslag-v2` | Fetch periods and snapshots |
| `paw-arbeidssoekerregisteret-api-bekreftelse` | Fetch available confirmations |
| `modiacontextholder` | Active user (fnr) and unit from Modia context |
| `aareg-services` | Fetch latest employment records |
| `pam-ontologi` | Typeahead search for job titles and STYRK code conversion |

## Boundaries

### ✅ Always do
- Run `npm run lint` and `npm test` before considering work complete.
- Use `authenticatedFetch` for all backend API calls — it handles auth, Modia headers, tracing, and error parsing.
- Follow the **Page → Wrapper → Component** data fetching pattern when creating or modifying pages.
- Use the `@/` path alias for imports from `src/`.
- Use Aksel (`@navikt/ds-react`) components for UI. Use Tailwind for layout and spacing.
- Write user-facing strings in Norwegian.
- Handle `undefined` from indexed access (`noUncheckedIndexedAccess` is enabled).
- Place test files next to the code they test with the `.test.ts` / `.test.tsx` suffix.

### ⚠️ Ask first
- Adding new npm dependencies — check if an existing dependency or Aksel component already covers the need.
- Modifying `authenticatedFetch.ts`, `proxy.ts`, or anything in `src/lib/auth/` — these are security-critical.
- Changing the root layout (`src/app/layout.tsx`) — it wires up providers, the decorator, and visittkort.
- Altering NAIS configuration (`.nais/`) or the CI pipeline (`.github/workflows/deploy.yml`).
- Modifying or removing existing test stubs in `src/test/`.

### 🚫 Never do
- **Do not** Log tokens, headers.
- **Do not `await` the data promise in `page.tsx`** — this breaks streaming/Suspense. Pass the unresolved promise.
- **Do not bypass `authenticatedFetch`** for backend calls with raw `fetch` — you'll skip auth, headers, and error handling.
- **Do not use ESLint or Prettier** — this project uses Biome exclusively.
- **Do not use `console.log`** — Biome will reject it. Use `@navikt/next-logger` on the server or `console.error`/`console.warn` on the client.
- **Do not add `vi.mock('server-only')` in tests** — it's handled globally by the Vitest alias config in `vitest.config.ts`.
- **Do not expose secrets, tokens, or API keys in client-side code** — all token handling is server-side only.
- **Do not commit directly to `main`** without passing lint, tests, and build.
