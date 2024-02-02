import { ErrorTypes } from '../model/error';
import { OppgaveRegistreringstype } from '../model/feilsituasjonTyper';

export const hentRegistreringFeiletUrl = (feiltype: ErrorTypes, registreringstype: OppgaveRegistreringstype) => {
    if (feiltype === ErrorTypes.BRUKER_ER_DOD_UTVANDRET_ELLER_FORSVUNNET) {
        return `/veiledning/${registreringstype}/utvandret/`;
    } else if (feiltype === ErrorTypes.BRUKER_MANGLER_ARBEIDSTILLATELSE) {
        return `/veiledning/${registreringstype}/mangler-arbeidstillatelse/`;
    } else if (feiltype === ErrorTypes.BRUKER_KAN_IKKE_REAKTIVERES) {
        return `/veiledning/${registreringstype}/kan-ikke-reaktiveres`;
    } else if (feiltype === ErrorTypes.BRUKER_ER_UKJENT) {
        return '/feil/';
    } else {
        return '/feil/';
    }
};
