import { useEffect } from 'react';
import { BodyLong, Heading, Alert } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';

import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';
import { withAuthenticatedPage } from '../../auth/withAuthentication';
import { loggVisning } from '../../lib/amplitude';

const TEKSTER: Tekster<string> = {
    nb: {
        overskrift: 'Du har ikke tilgang til personens arbeidsforhold',
        melding: 'Årsak til feilen kan være manglende lesetilgang til AA registret.',
        kontakt: 'Ta kontakt med din lokale identansvarlige.',
    },
};

function Sperret() {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());

    useEffect(() => {
        loggVisning({ viser: 'mangler tilgang til aa-registeret' });
    }, []);

    return (
        <Alert variant="warning">
            <Heading spacing size="small" level="1">
                {tekst('overskrift')}
            </Heading>
            <BodyLong>{tekst('melding')}</BodyLong>
            <BodyLong>{tekst('kontakt')}</BodyLong>
        </Alert>
    );
}

export const getServerSideProps = withAuthenticatedPage();
export default Sperret;
