import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';
import useApiKall from '../hooks/useApiKall';
import { TilgjengeligeBekreftelser } from '../types/bekreftelse';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import { Alert, Heading, Loader } from '@navikt/ds-react';
import { HistorikkWrapper } from '../components/historikk/historikk-wrapper';
import { AggregertePerioder, AggregertPeriode } from '../types/aggregerte-perioder';

export default function Historikk() {
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const { fnr } = params;
    const brukerMock = enableMock === 'enabled';
    const {
        data: aggregertePerioder,
        isLoading,
        error,
    } = useApiKall<AggregertePerioder>(
        `/api/${brukerMock ? 'mocks/' : ''}oppslag-arbeidssoekerperioder-aggregert`,
        'POST',
        fnr ? JSON.stringify({ identitetsnummer: fnr }) : null,
    );

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
            <Heading size={'large'}>Arbeidssøkerhistorikk</Heading>
            <div className={'flex flex-col max-w-3xl'}>
                {aggregertePerioder &&
                    aggregertePerioder.map((periode, index) => (
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
