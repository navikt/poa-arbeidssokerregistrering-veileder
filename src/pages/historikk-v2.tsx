import useApiKall from '../hooks/useApiKall';
import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';
import { AggregertePerioder } from '@navikt/arbeidssokerregisteret-utils';
import { useParamsFromContext } from '../contexts/params-from-context';
import { TidslinjeSelectionProvider, useTidslinjeSelection } from '../contexts/tidslinje-selection-context';
import { Historikk } from '../components/historikk-v2/historikk';
import { ActionMenu, Alert, BodyShort, Box, Button, Heading, Skeleton } from '@navikt/ds-react';
import { HistorikkListeTittel } from '../components/historikk-v2/historikk-liste-tittel';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ApiTidslinjeResponse, Tidslinje } from '../model/schema-api.types';

const HistorikkInnholdSkeleton = () => {
    return (
        <div className="flex-1 gap-4 md:grid md:grid-cols-[minmax(300px,1fr)_3fr]">
            <Box className="hidden md:block">
                <Heading size="large">Arbeidssøkerperioder</Heading>
                <Skeleton variant="rectangle" height={30} className="mb-4" />
                {Array(5)
                    .fill(0)
                    .map((_, i) => (
                        <Box key={i}>
                            <Skeleton variant="rectangle" height={60} className="mb-2" />
                        </Box>
                    ))}
            </Box>
            <Box>
                <Skeleton variant="rounded" height={250} className="mb-8" />
                {Array(5)
                    .fill(0)
                    .map((_, i) => (
                        <Box key={i}>
                            <Skeleton variant="rounded" height={60} className="mb-2" />
                        </Box>
                    ))}
            </Box>
        </div>
    );
};

type HistorikkInnholdProps = {
    tidslinjeResponse: ApiTidslinjeResponse | undefined;
    isLoading: boolean;
};

const HistorikkInnhold = ({ tidslinjeResponse, isLoading }: HistorikkInnholdProps) => {
    const { selectedTidslinje } = useTidslinjeSelection();
    const tidslinjeList: Tidslinje[] =
        tidslinjeResponse && tidslinjeResponse['tidslinjer'] ? tidslinjeResponse['tidslinjer'] : [];
    const hasData = tidslinjeList && tidslinjeList.length > 0;

    if (isLoading) {
        return <HistorikkInnholdSkeleton />;
    }

    if (!hasData) {
        return <div>Ingen data tilgjengelig</div>;
    }

    return (
        <div className="flex-1 md:grid md:grid-cols-[minmax(300px,1fr)_3fr] md:overflow-hidden">
            {/* Mobile menu for tidslinjer */}
            <Box as={'nav'} className="md:hidden bg-bg-default mb-4">
                <ActionMenu>
                    <ActionMenu.Trigger>
                        <Button variant="secondary-neutral" icon={<ChevronDownIcon aria-hidden />} iconPosition="right">
                            Arbeidssøkerperioder ({tidslinjeList?.length ?? 0})
                        </Button>
                    </ActionMenu.Trigger>
                    <ActionMenu.Content>
                        {tidslinjeList.map((el, i) => (
                            <ActionMenu.Item key={i}>
                                <HistorikkListeTittel key={i} tidslinje={el} />
                            </ActionMenu.Item>
                        ))}
                    </ActionMenu.Content>
                </ActionMenu>
            </Box>
            {/* Desktop list of tidslinjer */}
            <div className="hidden md:block md:overflow-y-scroll relative">
                <div className="sticky top-0 z-50 bg-white">
                    <Heading size="large">Arbeidssøkerperioder</Heading>
                    <BodyShort className="mb-4">
                        <b>{tidslinjeList.length || 0}</b> perioder funnet
                    </BodyShort>
                </div>
                {tidslinjeList.map((el, i) => (
                    <HistorikkListeTittel key={i} tidslinje={el} />
                ))}
            </div>
            <div className="md:p-4 md:overflow-y-scroll">
                {selectedTidslinje ? <Historikk tidslinje={selectedTidslinje} /> : 'Ingen arbeidsøkerperiode er valgt'}
            </div>
        </div>
    );
};

const HistorikkTidslinjer = () => {
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const { fnr } = params;
    const brukerMock = enableMock === 'enabled';
    /*
    == TODO: API-tidslinjer
    == trenger ikke periodeID når vi skal hente alle tidslinjer. 
    == Sendte tom body - Men sjekke at dette funker 
    */

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
        data: tidslinjerResponse,
        isLoading: isLoadingTidslinjer,
        error: errorTidslinjer,
    } = useApiKall<ApiTidslinjeResponse>(
        `/api/${brukerMock ? 'mocks/' : ''}tidslinjer`,
        'POST',
        fnr && periodeIds ? JSON.stringify({ perioder: periodeIds }) : null,
    );

    if (errorAggregertePerioder || errorTidslinjer) {
        return <Alert variant={'error'}>Noe gikk dessverre galt. Prøv igjen senere</Alert>;
    }

    return (
        <TidslinjeSelectionProvider>
            <HistorikkInnhold tidslinjeResponse={tidslinjerResponse} isLoading={isLoadingTidslinjer} />
        </TidslinjeSelectionProvider>
    );
};

export default HistorikkTidslinjer;
