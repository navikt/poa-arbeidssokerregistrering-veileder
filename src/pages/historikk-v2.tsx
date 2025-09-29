import useApiKall from '../hooks/useApiKall';
import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';
import { useParamsFromContext } from '../contexts/params-from-context';
import { TidslinjeSelectionProvider, useTidslinjeSelection } from '../contexts/tidslinje-selection-context';
import { Historikk } from '../components/historikk-v2/historikk';
import { ActionMenu, Alert, BodyShort, Box, Button, Heading, Skeleton } from '@navikt/ds-react';
import { HistorikkListeTittel } from '../components/historikk-v2/historikk-liste-tittel';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import TilbakeTilForside from '../components/tilbake-til-forside';
import PrintInfoHeader from '../components/historikk/print-info-header';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import { useEffect, useMemo } from 'react';
import { Tidslinje, TidslinjerResponse } from '@navikt/arbeidssokerregisteret-utils';
import { HistorikkInnholdSkeleton } from '../components/historikk-v2/historikk-loading-skeleton';

type HistorikkInnholdProps = {
    tidslinjeResponse: TidslinjerResponse | undefined;
    isLoading: boolean;
};

const HistorikkInnhold = ({ tidslinjeResponse, isLoading }: HistorikkInnholdProps) => {
    const { selectedTidslinje, setSelectedTidslinje } = useTidslinjeSelection();
    const tidslinjeList: Tidslinje[] = useMemo(
        () => (tidslinjeResponse && tidslinjeResponse['tidslinjer'] ? tidslinjeResponse['tidslinjer'] : []),
        [tidslinjeResponse],
    );
    const hasData = tidslinjeList && tidslinjeList.length > 0;

    useEffect(() => {
        if (!isLoading && hasData && !selectedTidslinje) {
            setSelectedTidslinje(tidslinjeList[0]);
        }
    }, [isLoading, hasData, tidslinjeList, selectedTidslinje, setSelectedTidslinje]);

    if (isLoading) {
        return <HistorikkInnholdSkeleton />;
    }

    if (!hasData) {
        return (
            <>
                <TilbakeTilForside sidenavn="Arbeidssøkerhistorikk" />
                <Alert variant="info">Ingen arbeidssøkerhistorikk tilgjengelig</Alert>
            </>
        );
    }

    return (
        <div className="flex-1 md:grid md:grid-cols-[minmax(300px,1fr)_3fr]">
            {/* Mobile menu for tidslinjer */}
            <Box as={'nav'} className="md:hidden bg-bg-default mb-4 print:hidden">
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
            <div className="hidden md:block px-1 print:hidden">
                <Heading size="large">Arbeidssøkerperioder</Heading>
                <BodyShort className="mb-4">
                    <b>{tidslinjeList.length || 0}</b> perioder funnet
                </BodyShort>
                {tidslinjeList.map((el, i) => (
                    <HistorikkListeTittel key={i} tidslinje={el} />
                ))}
            </div>
            <div className="md:p-4">
                <TilbakeTilForside sidenavn="Arbeidssøkerhistorikk" />
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

    const {
        data: tidslinjerResponse,
        isLoading: isLoadingTidslinjer,
        error: errorTidslinjer,
    } = useApiKall<TidslinjerResponse>(
        `/api/${brukerMock ? 'mocks/' : ''}tidslinjer`,
        'POST',
        fnr ? JSON.stringify({ identitetsnummer: fnr }) : null,
    );

    if (errorTidslinjer) {
        return <Alert variant={'error'}>Noe gikk dessverre galt. Prøv igjen senere</Alert>;
    }

    return (
        <TidslinjeSelectionProvider>
            <PrintInfoHeader fnr={fnr} />
            <HistorikkInnhold tidslinjeResponse={tidslinjerResponse} isLoading={isLoadingTidslinjer} />
        </TidslinjeSelectionProvider>
    );
};

export const getServerSideProps = withAuthenticatedPage(async () => {
    return {
        props: {
            skjulDekoratorVedPrint: true,
        },
    };
});

export default HistorikkTidslinjer;
