import { Alert, Heading, Loader } from '@navikt/ds-react';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';
import useApiKall from '../hooks/useApiKall';
import { Config } from '../model/config';
import TilbakeTilForside from '../components/tilbake-til-forside';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import { HistorikkWrapper } from '../components/historikk/historikk-wrapper';
import { AggregertePerioder, AggregertPeriode } from '../types/aggregerte-perioder';
import { AggregerteBekreftelser } from '../model/bekreftelse';
import { mergeGyldigeBekreftelser } from '../lib/merge-gyldige-bekreftelser';

export default function Historikk() {
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
        data: gyldigeBekreftelser,
        isLoading: isLoadingGyldigeBekreftelser,
        error: errorGyldigeBekreftelser,
    } = useApiKall<AggregerteBekreftelser>(
        `/api/${brukerMock ? 'mocks/' : ''}gyldige-bekreftelser`,
        'POST',
        fnr && periodeIds ? JSON.stringify({ perioder: periodeIds }) : null,
    );

    const isLoading = isLoadingAggregertePerioder || isLoadingGyldigeBekreftelser;
    const error = errorAggregertePerioder || errorGyldigeBekreftelser;

    const aggregertePerioderMedGyldigeBekreftelser =
        aggregertePerioder && gyldigeBekreftelser
            ? mergeGyldigeBekreftelser(aggregertePerioder, gyldigeBekreftelser)
            : null;

    if (isLoading) {
        return (
            <div className="flex justify-center">
                <Loader size="3xlarge" title="Henter data..." />
            </div>
        );
    }

    if (error) {
        return <Alert variant={'error'}>Noe gikk dessverre galt ved henting av historikk</Alert>;
    }

    return (
        <>
            <TilbakeTilForside sidenavn="Arbeidssøkerhistorikk" />
            <Heading size={'large'}>Arbeidssøkerhistorikk</Heading>
            <div className={'flex flex-col max-w-3xl'}>
                {aggregertePerioderMedGyldigeBekreftelser &&
                    aggregertePerioderMedGyldigeBekreftelser.map((periode, index) => (
                        <div
                            className={'p-4'}
                            key={periode.periodeId}
                            style={{ background: index % 2 !== 0 ? 'var(--a-surface-subtle)' : undefined }}
                        >
                            <HistorikkWrapper {...periode} sprak={'nb'} />
                        </div>
                    ))}
            </div>
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
