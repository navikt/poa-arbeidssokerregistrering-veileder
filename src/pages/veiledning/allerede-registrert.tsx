import { useEffect } from 'react';
import { BodyLong, Heading, Alert } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';

import { lagHentTekstForSprak, Tekster } from '@navikt/arbeidssokerregisteret-utils';
import { withAuthenticatedPage } from '../../auth/withAuthentication';
import { loggStoppsituasjon } from '../../lib/amplitude';

const TEKSTER: Tekster<string> = {
    nb: {
        overskrift: 'Personen er allerede registrert',
        melding: 'Personen er allerede registrert som arbeidssøker i Arena',
    },
};

function AlleredeRegistrert() {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());

    useEffect(() => {
        loggStoppsituasjon({ aarsakTilStans: 'Personen er allerede registrert i Arena' });
    }, []);

    return (
        <Alert variant="warning">
            <Heading spacing size="small" level="1">
                {tekst('overskrift')}
            </Heading>
            <BodyLong>{tekst('melding')}.</BodyLong>
        </Alert>
    );
}

export const getServerSideProps = withAuthenticatedPage();
export default AlleredeRegistrert;
