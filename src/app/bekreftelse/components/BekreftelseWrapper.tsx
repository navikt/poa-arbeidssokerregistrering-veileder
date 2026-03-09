'use client';

import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { Bekreftelse } from '@/app/bekreftelse/components/Bekreftelse';
import { useServerData } from '@/hooks/useServerData';
import { type BekreftelseApiResult, getBekreftelser } from '@/lib/api/bekreftelse';

type BekreftelseWrapperProps = {
    initialBekreftelserPromise: Promise<BekreftelseApiResult>;
};

function BekreftelseWrapper({ initialBekreftelserPromise }: BekreftelseWrapperProps) {
    const { dataPromise: bekreftelsePromise, isPending: bekreftelseIsPending } = useServerData(
        initialBekreftelserPromise,
        getBekreftelser,
    );

    return (
        <Suspense fallback={<Loader />}>
            {bekreftelseIsPending && <Loader size='medium' title='Henter informasjon' />}
            <Bekreftelse bekreftelserPromise={bekreftelsePromise} />
        </Suspense>
    );
}

export { BekreftelseWrapper };
