import { BodyLong, Heading, Alert } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';

import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';
import { withAuthenticatedPage } from '../../auth/withAuthentication';

const TEKSTER: Tekster<string> = {
    nb: {
        overskrift: 'Personen kan ikke registreres som arbeidssøker',
        melding: 'For å kunne gjennomføre en registrering må det gjøres endringer i personens status i Arena.',
    },
};

function Sperret() {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());

    return (
        <Alert variant="warning">
            <Heading spacing size="small" level="1">
                {tekst('overskrift')}
            </Heading>
            <BodyLong>{tekst('melding')}</BodyLong>
        </Alert>
    );
}

export const getServerSideProps = withAuthenticatedPage();
export default Sperret;
