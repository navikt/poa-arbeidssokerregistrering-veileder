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
    const brukNyInngang = toggles['arbeidssokerregistrering.bruk-ny-inngang'];

    const skalViseKomponent = brukSperrUnder18 && erUnder18aar && !brukNyInngang;

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
            <Heading level="1" size="small" className="mb-4">
                Denne personen er under 18 år og trenger samtykke fra begge foresatte for å kunne registrere seg som
                arbeidssøker.
            </Heading>
            <BodyLong className="mb-4">
                Det du må gjøre videre er beskrevet i{' '}
                <Link
                    href="https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Servicerutine-for-innhenting-av-samtykke-fra-foresatte-for-unge-under-18-%C3%A5r-ved-registrering-som-arbeidss%C3%B8ker,.aspx"
                    onClick={gaarTilServicerutine}
                >
                    Samtykke fra foresatte til unge under 18 år - registrering som arbeidssøker, øvrige tiltak og
                    tjenester.
                </Link>
            </BodyLong>
            <BodyLong>Du kan bare gå videre med registrering av denne personen hvis samtykke er innhentet.</BodyLong>
        </Alert>
    );
}

export default PersonUnder18;
