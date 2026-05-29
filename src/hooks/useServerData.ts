'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useModiaContext } from '@/contexts/modia-context';

export function useServerData<T>(
    initialPromise: Promise<T>,
    fetchFn: (fnr: string | null, enhetId: string | null) => Promise<T>,
) {
    const { fnr, enhetId } = useModiaContext();
    const [dataPromise, setDataPromise] = useState(initialPromise);
    const [isPending, startTransition] = useTransition();
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        startTransition(() => {
            setDataPromise(fetchFn(fnr, enhetId));
        });
    }, [fnr, enhetId, fetchFn]);

    return { dataPromise, isPending };
}
