import { useParamsFromContext } from '../../contexts/params-from-context';
import useApiKall from '../../hooks/useApiKall';
import { useConfig } from '../../contexts/config-context';
import { Config } from '../../model/config';
import { SamletInformasjon } from '@navikt/arbeidssokerregisteret-utils';
import ArbeidssoekerstatusOversiktV2 from './../arbeidssoekerstatus-oversikt-v2';
import { useRouter } from 'next/router';
import IkkeAktivPeriode from './ikke-aktiv-periode';

function NyForside() {
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const router = useRouter();
    const brukerMock = enableMock === 'enabled';

    const hentSamletInformasjonUrl = brukerMock
        ? '/api/mocks/oppslag-samlet-informasjon'
        : '/api/oppslag-samlet-informasjon';

    const { fnr } = params;
    const { data: samletInformasjon } = useApiKall<SamletInformasjon>(
        hentSamletInformasjonUrl,
        'POST',
        JSON.stringify({ foedselsnummer: fnr }),
    );

    const harAktivPeriode = samletInformasjon?.arbeidssoekerperioder[0]?.avsluttet === null;

    if (!harAktivPeriode) {
        return <IkkeAktivPeriode samletInformasjon={samletInformasjon} />;
    } else {
        return <ArbeidssoekerstatusOversiktV2 />;
    }
}

export default NyForside;
