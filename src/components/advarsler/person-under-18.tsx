import { Alert, BodyLong, Heading } from '@navikt/ds-react';

import { useFeatureToggles } from '../../contexts/featuretoggle-context';
import { useConfig } from '../../contexts/config-context';

import { Config } from '../../model/config';

function PersonUnder18() {
    const { toggles } = useFeatureToggles();
    const { aarsTall } = useConfig() as Config;

    const brukSperrUnder18 = toggles['arbeidssokerregistrering.bruk-under-18-sperre'] && aarsTall > 2023;

    const skalViseKomponent = brukSperrUnder18;

    if (!skalViseKomponent) return null;

    return (
        <Alert variant="warning" className="mb-8">
            <Heading level="1" size="small">
                Du er i ferd med å registrere en person under 18 år
            </Heading>
            <BodyLong>
                Personer under 18 år må ha samtykke fra foresatte for å kunne bli registrert som arbeidssøker.
            </BodyLong>
        </Alert>
    );
}

export default PersonUnder18;
