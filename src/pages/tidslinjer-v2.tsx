import React from 'react';
import useApiKall from '../hooks/useApiKall';
import { TidslinjerResponse } from '../model/tidslinjer';
import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';
import { AggregertePerioder } from '@navikt/arbeidssokerregisteret-utils';
import { useParamsFromContext } from '../contexts/params-from-context';
import { TidslinjeTittelV2 } from '../components/tidslinjer/tidslinje-tittel-v2';
import { TidslinjeSelectionProvider, useTidslinjeSelection } from '../contexts/tidslinje-selection-context';
import { Tidslinje } from '../components/tidslinjer/tidslinje';
import { BodyShort, Heading } from '@navikt/ds-react';

const TidslinjerContent = ({ tidslinjer }: { tidslinjer: TidslinjerResponse | undefined }) => {
    const { selectedTidslinje } = useTidslinjeSelection();

    return (
        <div className='flex-1 grid grid-cols-[minmax(300px,1fr)_3fr]'>
            <div>
                <Heading size='large'>
                    Tidslinjer
                </Heading>
                <BodyShort className='mb-4'>
                    {tidslinjer.tidslinjer.length} tidslinjer funnet
                </BodyShort>
                {tidslinjer?.tidslinjer.map((el, i) => (
                    <TidslinjeTittelV2 key={i} tidslinje={el} />
                ))}
            </div>
            <div className='p-4'>
                {selectedTidslinje ? (
                    <Tidslinje tidslinje={selectedTidslinje} />
                ) : (
                    'Content of selected tidslinje'
                )}
            </div>
        </div>
    );
};

const Tidslinjer = () => {
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
            <TidslinjerContent tidslinjer={tidslinjer} />
        </TidslinjeSelectionProvider>
    );
};

export default Tidslinjer;