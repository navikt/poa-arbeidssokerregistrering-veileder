import { Alert, Heading, Loader } from '@navikt/ds-react';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';
import useApiKall from '../hooks/useApiKall';
import { Config } from '../model/config';
import TilbakeTilForside from '../components/tilbake-til-forside';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import { TidslinjerWrapper } from '../components/tidslinjer/tidslinjer-wrapper';
import { TidslinjerResponse } from '../model/tidslinjer';
import { AggregertePerioder } from '@navikt/arbeidssokerregisteret-utils';

export default function Tidslinje() {
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const { fnr } = params;
    const brukerMock = enableMock === 'enabled';

    const {
        data: aggregertePerioder,
        isLoading: isLoadingAggregertePerioder,
        error: errorAggregertePerioder,
    } = useApiKall<AggregertePerioder>(
        `/api/${brukerMock ? 'mocks/' : ''}oppslag-arbeidssoekerperioder-aggregert`,
        'POST',
        fnr ? JSON.stringify({ identitetsnummer: fnr }) : null,
    );

    const periodeIds = aggregertePerioder ? aggregertePerioder.map((periode) => periode.periodeId) : null;

    const {
        data: tidslinjer,
        isLoading: isLoadingTidslinjer,
        error: errorTidslinjer,
    } = useApiKall<TidslinjerResponse>(
        `/api/${brukerMock ? 'mocks/' : ''}tidslinjer`,
        'POST',
        fnr && periodeIds ? JSON.stringify({ perioder: periodeIds }) : null,
    );

    const isLoading = isLoadingAggregertePerioder || isLoadingTidslinjer;
    const error = errorAggregertePerioder || errorTidslinjer;

    if (isLoading) {
        return (
            <div className="flex justify-center">
                <Loader size="3xlarge" title="Henter data..." />
            </div>
        );
    }

    if (error) {
        return <Alert variant={'error'}>Noe gikk dessverre galt ved henting av tidslinjer</Alert>;
    }

    return (
        <>
            <TilbakeTilForside sidenavn="Arbeidssøkerhistorikk" />
            <Heading size={'large'}>Tidslinjer for arbeidssøker</Heading>
            <div className={'flex flex-col max-w-3xl'}>
                <TidslinjerWrapper {...tidslinjer} sprak={'nb'} />
            </div>
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
