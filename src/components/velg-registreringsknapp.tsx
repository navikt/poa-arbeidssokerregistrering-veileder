import StartPeriodeKnapp from './start-periode-knapp';
import StartPeriodeKnappMedOverstyring from './start-periode-knapp-med-overstyring';
import { REGLER_SOM_KAN_OVERSTYRES } from '../model/regler-for-avvisning';

function sjekkOverstyring(feilmelding?: any) {
    const { aarsakTilAvvisning } = feilmelding || {};
    const { regel } = aarsakTilAvvisning || {};

    return regel && REGLER_SOM_KAN_OVERSTYRES.includes(regel);
}

interface RegistreringsknappProps {
    feilmelding?: any;
    kanStarteArbeidssoekerperiode: boolean;
}

function VelgRegistreringsKnapp(props: RegistreringsknappProps) {
    const { feilmelding, kanStarteArbeidssoekerperiode } = props;
    const kanOverstyres = sjekkOverstyring(feilmelding);

    if (kanStarteArbeidssoekerperiode) {
        return <StartPeriodeKnapp />;
    }

    if (kanOverstyres) {
        return <StartPeriodeKnappMedOverstyring />;
    }

    return null;
}

export default VelgRegistreringsKnapp;
