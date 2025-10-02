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
import { useEffect, useMemo, useRef } from 'react';
import { Tidslinje, TidslinjerResponse } from '@navikt/arbeidssokerregisteret-utils';
import { HistorikkInnholdSkeleton } from '../components/historikk-v2/historikk-loading-skeleton';
import { useScrollSpy } from '../hooks/useScrollSpy';

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
    const sectionIds = useMemo(() => tidslinjeList.map((t) => t.periodeId), [tidslinjeList]);
    const activeSection = useScrollSpy({ sectionIds });

    useEffect(() => {
        if (!isLoading && hasData) {
            if (activeSection) {
                const activeTidslinje = tidslinjeList.find((t) => t.periodeId === activeSection);
                if (activeTidslinje && activeTidslinje.periodeId !== selectedTidslinje?.periodeId) {
                    setSelectedTidslinje(activeTidslinje);
                }
            }
            // Dersom scrollSpy ikke har satt en aktiv tidslinje, sett første som default
            else if (!selectedTidslinje && tidslinjeList.length > 0) {
                setSelectedTidslinje(tidslinjeList[0]);
            }
        }
    }, [activeSection, hasData, isLoading, selectedTidslinje, setSelectedTidslinje, tidslinjeList]);

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
            <Box
                as={'nav'}
                className="md:hidden bg-bg-default mb-4 print:hidden sticky top-0 right-0 left-0 pt-4 pb-1 text-center"
            >
                <ActionMenu>
                    <ActionMenu.Trigger>
                        <Button variant="secondary-neutral" icon={<ChevronDownIcon aria-hidden />} iconPosition="right">
                            {tidslinjeList.length === 1 ? 'Arbeidssøkerperiode' : 'Arbeidssøkerperioder'}(
                            {tidslinjeList?.length ?? 0})
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
            <div className="hidden md:block px-1 print:hidden sticky top-0 max-h-screen overflow-y-scroll">
                {/* Sidebar content */}
                <Heading size="large">Arbeidssøkerperioder</Heading>
                <BodyShort className="mb-4">
                    <b>{tidslinjeList.length || 0}</b> {tidslinjeList.length === 1 ? 'periode' : 'perioder'} funnet
                </BodyShort>
                {tidslinjeList.map((el, i) => (
                    <HistorikkListeTittel key={i} tidslinje={el} />
                ))}
            </div>
            <div className="md:p-4">
                <TilbakeTilForside sidenavn="Arbeidssøkerhistorikk" />
                {tidslinjeList.map((tidslinje, i) => (
                    <div key={i} className="mb-8 pb-8">
                        <Historikk key={i} tidslinje={tidslinje} />
                    </div>
                ))}
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
