import StartPeriodeKnapp from './start-periode-knapp';
import StartPeriodeKnappMedOverstyring from './start-periode-knapp-med-overstyring';

function sjekkOverstyring(feilmelding?: any) {
    return false;
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
