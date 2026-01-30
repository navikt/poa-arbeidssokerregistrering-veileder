import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Alert, BodyShort, Box, Button, Heading } from '@navikt/ds-react';
import { useEffect, useMemo } from 'react';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import { HendelseFilter } from '../components/historikk/hendelse-filter';
import { Historikk } from '../components/historikk/historikk';
import { HistorikkListeTittel } from '../components/historikk/historikk-liste-tittel';
import { HistorikkInnholdSkeleton } from '../components/historikk/historikk-loading-skeleton';
import { ToggleVisningsType } from '../components/historikk/toggle-visnings-type';
import PrintInfoHeader from '../components/historikk/print-info-header';
import TilbakeTilForside from '../components/tilbake-til-forside';
import { useConfig } from '../contexts/config-context';
import { FilterProvider } from '../contexts/hendelse-context';
import { VisningsTypeProvider } from '../contexts/hendelse-visning-context';
import { useParamsFromContext } from '../contexts/params-from-context';
import { TidslinjeSelectionProvider, useTidslinjeSelection } from '../contexts/tidslinje-selection-context';
import useApiKall from '../hooks/useApiKall';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { Config } from '../model/config';
import { Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';

type HistorikkInnholdProps = {
    tidslinjer: Periode[];
};


const HistorikkInnhold = ({ tidslinjer }: HistorikkInnholdProps) => {
    const { selectedTidslinje, setSelectedTidslinje } = useTidslinjeSelection();
    const sectionIds = useMemo(() => tidslinjer.map((t) => t.periodeId), [tidslinjer]);
    const activeSection = useScrollSpy({ sectionIds });

    // Endre valgt tidslinje basert på inscreenObserver (scrollSpy)
    useEffect(() => {
        if (!activeSection || !(tidslinjer.length > 0)) return;
        const activeTidslinje = tidslinjer.find((t) => t.periodeId === activeSection);
        if (activeTidslinje && activeTidslinje.periodeId !== selectedTidslinje?.periodeId) {
            setSelectedTidslinje(activeTidslinje);
        }
    }, [activeSection, selectedTidslinje, setSelectedTidslinje, tidslinjer]);

    if (tidslinjer.length === 0) {
        return (
            <>
                <TilbakeTilForside sidenavn="Arbeidssøkerhistorikk" />
                <Alert variant="info">Ingen arbeidssøkerhistorikk tilgjengelig</Alert>
            </>
        );
    }

    return (
        <div className="flex-1 ax-md:grid ax-md:grid-cols-[minmax(300px,1fr)_3fr]">
            {/* Mobile menu for tidslinjer */}
            <Box
                as={'nav'}
                aria-label="Velg arbeidsøkerperiode"
                className="md:hidden bg-ax-bg-default mb-4 print:hidden sticky top-0 right-0 left-0 pt-4 pb-1 text-center"
            >
                <ActionMenu>
                    <ActionMenu.Trigger>
                        <Button variant="secondary-neutral" icon={<ChevronDownIcon aria-hidden />} iconPosition="right">
                            {tidslinjer.length === 1 ? 'Arbeidssøkerperiode' : 'Arbeidssøkerperioder'}(
                            {tidslinjer?.length ?? 0})
                        </Button>
                    </ActionMenu.Trigger>
                    <ActionMenu.Content>
                        {tidslinjer.map((el) => (
                            <ActionMenu.Item key={el.periodeId}>
                                <HistorikkListeTittel tidslinje={el} />
                            </ActionMenu.Item>
                        ))}
                    </ActionMenu.Content>
                </ActionMenu>
            </Box>
            {/* Desktop list of tidslinjer */}
            <div className="hidden ax-md:block px-1 print:hidden sticky top-0 max-h-screen overflow-y-scroll">
                {/* Sidebar content */}
                <Heading size="large">Arbeidssøkerperioder</Heading>
                <BodyShort className="mb-4">
                    <b>{tidslinjer.length || 0}</b> {tidslinjer.length === 1 ? 'periode' : 'perioder'} funnet
                </BodyShort>
                {tidslinjer.map((el) => (
                    <HistorikkListeTittel key={el.periodeId} tidslinje={el} />
                ))}
            </div>
            <div className="md:p-4">
                <TilbakeTilForside sidenavn="Arbeidssøkerhistorikk" />
                <div className="py-4 mb-6">
                    <HendelseFilter />
                    <ToggleVisningsType />
                </div>
                {tidslinjer.map((tidslinje) => (
                    <div key={tidslinje.periodeId} className="mb-8 pb-8">
                        <Historikk tidslinje={tidslinje} />
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
        data: perioder,
        isLoading: isLoadingTidslinjer,
        error: errorTidslinjer,
    } = useApiKall<Periode[]>(
        `/api/${brukerMock ? 'mocks/' : ''}tidslinjer`,
        'POST',
        fnr ? JSON.stringify({ identitetsnummer: fnr }) : null,
    );
    console.log('tidslinjerResponse', perioder);

    if (errorTidslinjer) {
        return <Alert variant={'error'}>Noe gikk dessverre galt. Prøv igjen senere</Alert>;
    }

    if (isLoadingTidslinjer) return <HistorikkInnholdSkeleton />;

    return (
        <TidslinjeSelectionProvider initSelected={perioder[0] ?? null}>
            <FilterProvider>
                <VisningsTypeProvider>
                    <PrintInfoHeader fnr={fnr} />
                    <HistorikkInnhold tidslinjer={perioder} />
                </VisningsTypeProvider>
            </FilterProvider>
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
