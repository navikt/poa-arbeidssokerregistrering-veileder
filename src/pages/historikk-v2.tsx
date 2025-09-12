import useApiKall from '../hooks/useApiKall';
import { TidslinjerResponse } from '../model/tidslinjer';
import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';
import { AggregertePerioder } from '@navikt/arbeidssokerregisteret-utils';
import { useParamsFromContext } from '../contexts/params-from-context';
import { TidslinjeSelectionProvider, useTidslinjeSelection } from '../contexts/tidslinje-selection-context';
import { Historikk } from '../components/historikk-v2/historikk';
import { ActionMenu, BodyShort, Box, Button, Heading } from '@navikt/ds-react';
import { HistorikkListeTittel } from '../components/historikk-v2/historikk-liste-tittel';
import { ChevronDownIcon } from '@navikt/aksel-icons';

const HistorikkInnhold = ({ tidslinjer }: { tidslinjer: TidslinjerResponse | undefined }) => {
    const { selectedTidslinje } = useTidslinjeSelection();

    return (
        <div className="flex-1 md:grid md:grid-cols-[minmax(300px,1fr)_3fr] md:overflow-hidden">
            {/* Mobile menu for tidslinjer */}
            <Box as={'nav'} className="md:hidden bg-bg-default mb-4">
                <ActionMenu>
                    <ActionMenu.Trigger>
                        <Button variant="secondary-neutral" icon={<ChevronDownIcon aria-hidden />} iconPosition="right">
                            Arbeidssøkerperioder ({tidslinjer?.tidslinjer.length || 0})
                        </Button>
                    </ActionMenu.Trigger>
                    <ActionMenu.Content>
                        {tidslinjer?.tidslinjer.map((el, i) => (
                            <ActionMenu.Item key={i}>
                                {/* @ts-ignore */}
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
                        <b>{tidslinjer?.tidslinjer.length || 0}</b> perioder funnet
                    </BodyShort>
                </div>
                {tidslinjer?.tidslinjer.map((el, i) => (
                    // @ts-ignore
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
    == TODO: TIL MANDAG 15.09
    ===============================
    == Hent data-definisjonen fra openapi-spec.yaml og bruk denne til å 
    == generere en typescript-fil med datamodeller. (chatGPT or something)
    == LINK: https://github.com/navikt/paw-arbeidssoekerregisteret-monorepo-ekstern/blob/main/apps/oppslag-api-v2/src/main/resources/openapi/openapi-spec.yaml

    == Bruk denne i alt som har med historikk å gjøre. Brude kanskje erstatte typer
    == i hele repoet på sikt og. EN fil, én definisjon av data.

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
        data: tidslinjer,
        isLoading: isLoadingTidslinjer,
        error: errorTidslinjer,
    } = useApiKall<TidslinjerResponse>(
        `/api/${brukerMock ? 'mocks/' : ''}tidslinjer`,
        'POST',
        fnr && periodeIds ? JSON.stringify({ perioder: periodeIds }) : null,
    );

    return (
        <TidslinjeSelectionProvider>
            <HistorikkInnhold tidslinjer={tidslinjer} />
        </TidslinjeSelectionProvider>
    );
};

export default HistorikkTidslinjer;
