import { useEffect } from 'react';
import { BodyLong, Heading, Alert } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';

import { lagHentTekstForSprak, Tekster } from '@navikt/arbeidssokerregisteret-utils';
import { withAuthenticatedPage } from '../../auth/withAuthentication';
import { loggStoppsituasjon } from '../../lib/amplitude';

const TEKSTER: Tekster<string> = {
    nb: {
        overskrift: 'Personen kan ikke registreres som arbeidssøker',
        melding: 'For å kunne gjennomføre en registrering må det gjøres endringer i personens status i Arena.',
    },
};

function Sperret() {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());

    useEffect(() => {
        loggStoppsituasjon({ aarsakTilStans: 'Personen står som sperret i Arena' });
    }, []);

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
