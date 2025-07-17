import { useParamsFromContext } from '../../contexts/params-from-context';
import useApiKall from '../../hooks/useApiKall';
import { useConfig } from '../../contexts/config-context';
import { Config } from '../../model/config';
import IkkeAktivPeriode from './ikke-aktiv-periode';
import AktivPeriode from './aktiv-periode';
import { Alert, Loader } from '@navikt/ds-react';
import { AggregertePerioder } from '@navikt/arbeidssokerregisteret-utils';

interface Props {
    brukerMock: boolean;
    fnr: string;
}

function Innhold(props: Props) {
    const { brukerMock, fnr } = props;

    const hentSamletInformasjonUrl = brukerMock
        ? '/api/mocks/oppslag-arbeidssoekerperioder-aggregert?siste=true'
        : '/api/oppslag-arbeidssoekerperioder-aggregert?siste=true';

    const {
        data: aggregertePerioder,
        isLoading,
        error,
    } = useApiKall<AggregertePerioder>(hentSamletInformasjonUrl, 'POST', JSON.stringify({ identitetsnummer: fnr }));

    const sistePeriode = aggregertePerioder && aggregertePerioder[0];
    const harAktivPeriode = sistePeriode?.startet && sistePeriode?.avsluttet === null;

    if (isLoading) {
        return (
            <div className={'flex place-content-center'}>
                <Loader size={'2xlarge'} />
            </div>
        );
    }

    if (error) {
        return <Alert variant={'error'}>Noe gikk dessverre galt. Prøv igjen senere</Alert>;
    }

    if (harAktivPeriode) {
        return <AktivPeriode aggregertPeriode={sistePeriode} brukerMock={brukerMock} fnr={fnr} />;
    } else {
        return <IkkeAktivPeriode aggregertPeriode={sistePeriode} />;
    }
}

function NyForside() {
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const brukerMock = enableMock === 'enabled';
    const { fnr } = params;
    if (!fnr) {
        return null;
    }

    return <Innhold brukerMock={brukerMock} fnr={fnr} />;
}

export default NyForside;
