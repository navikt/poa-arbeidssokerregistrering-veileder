import useApiKall from '../hooks/useApiKall';
import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';
import { AggregertePerioder } from '@navikt/arbeidssokerregisteret-utils';
import { useParamsFromContext } from '../contexts/params-from-context';
import { TidslinjeSelectionProvider, useTidslinjeSelection } from '../contexts/tidslinje-selection-context';
import { Historikk } from '../components/historikk-v2/historikk';
import { ActionMenu, BodyShort, Box, Button, Heading } from '@navikt/ds-react';
import { HistorikkListeTittel } from '../components/historikk-v2/historikk-liste-tittel';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ApiTidslinjeResponse, Tidslinje } from '../model/schema-api.types';

const HistorikkInnhold = ({ tidslinjeResponse }: { tidslinjeResponse: ApiTidslinjeResponse | undefined }) => {
    const { selectedTidslinje } = useTidslinjeSelection();
    if (!tidslinjeResponse) {
        return <div>Ingen data tilgjengelig</div>;
    }
    const tidslinjeList: Tidslinje[] = tidslinjeResponse?.['tidslinjer'] ?? [];

    if (!tidslinjeList || tidslinjeList.length === 0) {
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
                {selectedTidslinje ? <Historikk tidslinje={selectedTidslinje} /> : 'Content of selected tidslinje'}
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
    == API-tidslinjer
    == Denne krever periodeId'er som input, men trenger vi egentlig dette? 
    == Hør med NM om det er mulig å endre til å bruke fnr direkte.
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

    // TODO: Litt mer innhold her
    if (errorAggregertePerioder || errorTidslinjer) {
        return <div>Det oppstod en feil ved henting av data.</div>;
    }

    return (
        <TidslinjeSelectionProvider>
            <HistorikkInnhold tidslinjeResponse={tidslinjerResponse} />
        </TidslinjeSelectionProvider>
    );
};

export default HistorikkTidslinjer;
