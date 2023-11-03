import { useEffect } from 'react';
import { Alert, BodyLong, GuidePanel, Heading } from '@navikt/ds-react';

import { loggStoppsituasjon } from '../lib/amplitude';
import lagHentTekstForSprak, { Tekster } from '../lib/lag-hent-tekst-for-sprak';
import useSprak from '../hooks/useSprak';

const TEKSTER: Tekster<string> = {
    nb: {
        heading: 'Vedlikehold pågår',
        vedlikehold: 'Arbeidssøkerregistreringen er ikke tilgjengelig på grunn av vedlikehold.',
        provIgjen: 'Vennligst prøv igjen litt senere.',
        dagpenger:
            'Hvis du skal søke om dagpenger kan du sende inn søknaden nå, og registrere deg som arbeidssøker etterpå.',
    },
    en: {
        heading: 'Maintenance',
        vedlikehold: 'Due to maintenance you can not register as a jobseeker at the moment.',
        provIgjen: 'Please try again later.',
        dagpenger:
            'If you are applying for unemployment benefits, you can submit the application now, and register as a jobseeker afterwards.',
    },
};

function Vedlikehold() {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());

    useEffect(() => {
        loggStoppsituasjon({
            situasjon: 'Arbeidssøkeren får ikke registrert seg pga nedetid',
        });
    }, []);

    return (
        <>
            <Heading level="1" size="large" spacing>
                {tekst('heading')}
            </Heading>
            <GuidePanel poster>
                <BodyLong>{tekst('vedlikehold')}</BodyLong>
                <BodyLong spacing>{tekst('provIgjen')}</BodyLong>
                <Alert variant="info">{tekst('dagpenger')}</Alert>
            </GuidePanel>
        </>
    );
}

export default Vedlikehold;
