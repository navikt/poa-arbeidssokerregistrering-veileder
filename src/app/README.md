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

## Se `tidslinjer/` for komplett eksempel.
