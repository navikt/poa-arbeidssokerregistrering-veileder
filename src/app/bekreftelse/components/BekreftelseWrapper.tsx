'use client';

import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { Bekreftelse } from '@/app/bekreftelse/components/Bekreftelse';
import { ManglerPersonEllerEnhet } from '@/components/ManglerPersonEllerEnhet';
import { useModiaContext } from '@/contexts/modia-context';
import { useServerData } from '@/hooks/useServerData';
import { type BekreftelseApiResult, getBekreftelser } from '@/lib/api/bekreftelse';

type BekreftelseWrapperProps = {
    initialBekreftelserPromise: Promise<BekreftelseApiResult>;
};

function BekreftelseWrapper({ initialBekreftelserPromise }: BekreftelseWrapperProps) {
    const { fnr } = useModiaContext();
    const { dataPromise: bekreftelsePromise, isPending: bekreftelseIsPending } = useServerData(
        initialBekreftelserPromise,
        getBekreftelser,
    );

    if (!fnr) {
        return <ManglerPersonEllerEnhet />;
    }

    return (
        <Suspense fallback={<Loader />}>
            {bekreftelseIsPending && <Loader size='medium' title='Henter bekreftelser' />}
            <Bekreftelse bekreftelserPromise={bekreftelsePromise} />
        </Suspense>
    );
}

export { BekreftelseWrapper };
