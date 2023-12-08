import { useEffect } from 'react';
import { Alert, BodyLong, Heading, Link } from '@navikt/ds-react';

import { useParamsFromContext } from '../../contexts/params-from-context';
import { useFeatureToggles } from '../../contexts/featuretoggle-context';
import { useConfig } from '../../contexts/config-context';

import { Config } from '../../model/config';
import { loggAktivitet, loggVisning } from '../../lib/amplitude';
import { personidentTilAlder } from '../../lib/personident-til-alder';

function PersonUnder18() {
    const { toggles } = useFeatureToggles();
    const { aarsTall } = useConfig() as Config;
    const { params } = useParamsFromContext();
    const { fnr } = params;

    const alder = personidentTilAlder(fnr);
    const erUnder18aar = alder < 18;
    const brukSperrUnder18 = toggles['arbeidssokerregistrering.bruk-under-18-sperre'] && aarsTall > 2023;

    const skalViseKomponent = brukSperrUnder18 && erUnder18aar;

    const gaarTilServicerutine = () => {
        loggAktivitet({ aktivitet: 'Går til servicerutine for samtykke for personer under 18' });
    };

    useEffect(() => {
        if (skalViseKomponent) {
            loggVisning({ viser: 'advarsel for registrering av person under 18' });
        }
    }, [skalViseKomponent]);

    if (!skalViseKomponent) return null;

    return (
        <Alert variant="warning" className="mb-8">
            <Heading level="1" size="small">
                Du er i ferd med å registrere en person under 18 år
            </Heading>
            <BodyLong spacing>
                Personer under 18 år må ha samtykke fra foresatte for å kunne bli registrert som arbeidssøker.
            </BodyLong>
            <BodyLong spacing>
                Les mer om hvordan du går frem omkring samtykke i{' '}
                <Link href="https://www.vg.no" onClick={gaarTilServicerutine}>
                    servicerutine for samtykke ved arbeidsrettet oppfølging
                </Link>
            </BodyLong>
            <BodyLong spacing>Dersom samtykke allerede er på plass kan du bare gå videre i registreringen.</BodyLong>
        </Alert>
    );
}

export default PersonUnder18;
