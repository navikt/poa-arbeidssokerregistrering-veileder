import React from 'react';
import useApiKall from '../hooks/useApiKall';
import { TidslinjerResponse } from '../model/tidslinjer';
import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';
import { AggregertePerioder } from '@navikt/arbeidssokerregisteret-utils';
import { useParamsFromContext } from '../contexts/params-from-context';
import { TidslinjeSelectionProvider, useTidslinjeSelection } from '../contexts/tidslinje-selection-context';
import { Historikk } from '../components/historikk-v2/historikk';
import { BodyShort, Heading } from '@navikt/ds-react';
import { HistorikkListeTittel } from '../components/historikk-v2/historikk-liste-tittel';

const HistorikkInnhold = ({ tidslinjer }: { tidslinjer: TidslinjerResponse | undefined }) => {
    const { selectedTidslinje } = useTidslinjeSelection();

    return (
        <div className="flex-1 grid grid-cols-[minmax(300px,1fr)_3fr] overflow-hidden">
            <div className="overflow-y-scroll relative">
                <div className="sticky top-0 z-50 bg-white">
                    <Heading size="large">Arbeidssøkerperioder</Heading>
                    <BodyShort className="mb-4">
                        <b>{tidslinjer?.tidslinjer.length || 0}</b> perioder funnet
                    </BodyShort>
                </div>
                {tidslinjer?.tidslinjer.map((el, i) => (
                    <HistorikkListeTittel key={i} tidslinje={el} />
                ))}
            </div>
            <div className="p-4 overflow-y-scroll">
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
