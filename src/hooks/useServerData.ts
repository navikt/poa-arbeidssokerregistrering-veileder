'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useModiaContext } from '@/contexts/modia-context';

export function useServerData<T>(
    initialPromise: Promise<T>,
    fetchFn: (fnr: string | null, enhetId: string | null) => Promise<T>,
    initialContext?: { fnr: string | null; enhetId: string | null },
    refreshOnMount = false,
) {
    const { fnr, enhetId } = useModiaContext();
    const [data, setData] = useState(() => ({
        promise: initialPromise,
        fnr: refreshOnMount ? undefined : initialContext ? initialContext.fnr : fnr,
        enhetId: refreshOnMount ? undefined : initialContext ? initialContext.enhetId : enhetId,
    }));
    const [isPending, startTransition] = useTransition();
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            if (!refreshOnMount && data.fnr === fnr && data.enhetId === enhetId) return;
        }

        startTransition(() => {
            setData({ promise: fetchFn(fnr, enhetId), fnr, enhetId });
        });
    }, [fnr, enhetId, fetchFn]);

    return { dataPromise: data.promise, dataContext: { fnr: data.fnr, enhetId: data.enhetId }, isPending };
}
