import StartPeriodeKnapp from './start-periode-knapp-v2';
import StartPeriodeKnappMedOverstyring from './start-periode-knapp-med-overstyring-v2';
import { REGLER_SOM_KAN_OVERSTYRES } from '../model/regler-for-avvisning';

function sjekkOmAlleReglerKanOverstyres(feilmelding?: any) {
    const { aarsakTilAvvisning } = feilmelding || {};
    const regler = aarsakTilAvvisning ? aarsakTilAvvisning.regler.map((regel) => regel.id) : [];
    const reglerSomIkkeKanOverstyres = regler.filter((regel) => !REGLER_SOM_KAN_OVERSTYRES.includes(regel));

    return reglerSomIkkeKanOverstyres.length === 0;
}

interface RegistreringsknappProps {
    feilmelding?: any;
    kanStarteArbeidssoekerperiode: boolean;
}

function VelgRegistreringsKnapp(props: RegistreringsknappProps) {
    const { feilmelding, kanStarteArbeidssoekerperiode } = props;
    const { aarsakTilAvvisning, feilKode } = feilmelding || {};
    const aarsaker = aarsakTilAvvisning?.regler ? aarsakTilAvvisning.regler.map((regel) => regel.id) : [];
    const ansattHarIkkeTilgang =
        aarsaker.includes('ANSATT_IKKE_TILGANG_TIL_BRUKER', 'IKKE_TILGANG') || feilKode === 'IKKE_TILGANG';
    const kanOverstyres = sjekkOmAlleReglerKanOverstyres(feilmelding);

    if (ansattHarIkkeTilgang) {
        return null;
    }

    if (kanStarteArbeidssoekerperiode) {
        return <StartPeriodeKnapp />;
    }

    if (kanOverstyres) {
        return <StartPeriodeKnappMedOverstyring />;
    }

    return null;
}

export default VelgRegistreringsKnapp;
