import { Alert, BodyLong, Heading } from '@navikt/ds-react';

import lagHentTekstForSprak, { Tekster } from '../lib/lag-hent-tekst-for-sprak';
import useSprak from '../hooks/useSprak';

const TEKSTER: Tekster<string> = {
    nb: {
        heading: 'Registreringen er ikke tilgjengelig grunnet vedlikehold',
        vedlikehold:
            'Hvis en person skal registrere seg for å søke om dagpenger anbefaler vi at dagpengesøknaden fylles inn nå slik at personen ikke risikerer å miste dager med dagpenger. En kan tidligst få dagpenger fra den dagen man søker fra.',
        provIgjen: 'Vennligst prøv igjen litt senere.',
        dagpenger:
            'Hvis en person skal registrere seg for å søke om dagpenger anbefaler vi at dagpengesøknaden fylles inn nå slik at personen ikke risikerer å miste dager med dagpenger. En kan tidligst få dagpenger fra den dagen man søker fra.',
    },
};

function Vedlikehold() {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());

    return (
        <Alert variant="error">
            <Heading level="1" size="small" spacing>
                {tekst('heading')}
            </Heading>
            <BodyLong spacing>{tekst('provIgjen')}</BodyLong>
            <BodyLong spacing>{tekst('dagpenger')}</BodyLong>
        </Alert>
    );
}

export default Vedlikehold;
