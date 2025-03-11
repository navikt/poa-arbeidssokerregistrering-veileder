import { Link } from '@navikt/ds-react';

import { useFeatureToggles } from '../contexts/featuretoggle-context';

import { loggAktivitet } from '../lib/amplitude';

function LenkeTilStoppknapp() {
    const { toggles } = useFeatureToggles();
    const brukStoppknapp = toggles['arbeidssokerregistrering-for-veileder.bruk-stoppknapp'];

    if (!brukStoppknapp) {
        return null;
    }

    return (
        <Link
            href="/avslutt-arbeidssoekerperiode"
            onClick={() => loggAktivitet({ aktivitet: 'Går til avslutt arbeidssøkerperiode' })}
        >
            Avslutt arbeidssøkerperioden
        </Link>
    );
}

export default LenkeTilStoppknapp;
