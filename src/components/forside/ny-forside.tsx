import { useParamsFromContext } from '../../contexts/params-from-context';
import useApiKall from '../../hooks/useApiKall';
import { useConfig } from '../../contexts/config-context';
import { Config } from '../../model/config';
import { SamletInformasjon } from '@navikt/arbeidssokerregisteret-utils';
import IkkeAktivPeriode from './ikke-aktiv-periode';
import AktivPeriode from './aktiv-periode';

interface Props {
    brukerMock: boolean;
    fnr: string;
}

function Innhold(props: Props) {
    const { brukerMock, fnr } = props;

    const hentSamletInformasjonUrl = brukerMock
        ? '/api/mocks/oppslag-samlet-informasjon'
        : '/api/oppslag-samlet-informasjon';

    const { data: samletInformasjon } = useApiKall<SamletInformasjon>(
        hentSamletInformasjonUrl,
        'POST',
        JSON.stringify({ identitetsnummer: fnr }),
    );

    const harAktivPeriode = samletInformasjon?.arbeidssoekerperioder[0]?.avsluttet === null;

    if (harAktivPeriode) {
        return <AktivPeriode samletInformasjon={samletInformasjon} brukerMock={brukerMock} fnr={fnr} />;
    } else {
        return <IkkeAktivPeriode samletInformasjon={samletInformasjon} />;
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
