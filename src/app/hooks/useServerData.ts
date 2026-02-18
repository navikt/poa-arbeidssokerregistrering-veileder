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
    }, [fnr, fetchFn]);

    return { dataPromise, isPending };
}
