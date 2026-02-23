'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useModiaContext } from '@/app/contexts/modia-context';

export function useServerData<T>(initialPromise: Promise<T>, fetchFn: (fnr: string | null) => Promise<T>) {
    const { fnr } = useModiaContext();
    const [dataPromise, setDataPromise] = useState(initialPromise);
    const [isPending, startTransition] = useTransition();
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        startTransition(() => {
            setDataPromise(fetchFn(fnr));
        });
        // INFO om "fetchFn" i deps-arr
        // Mulig en linter eller andre vil klage på at fetchFn er i deps-arr her
        // Men ved bruken av useServerData VET vi at den skal brukes til å sende
        // en server funksjon (top-level modul eksport), som alltid vil være samme
        // objekt på hver render.
        // Hvis noen sender inn ()=>{doSomething()} istedenfor en server-funksjon
        // så vil det trigge re-render ja. Men det er ikke sånn hooken er tiltenkt å
        // brukes.
    }, [fnr, fetchFn]);

    return { dataPromise, isPending };
}
