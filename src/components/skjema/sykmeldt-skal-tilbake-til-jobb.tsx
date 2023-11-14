import { Alert, BodyLong, Heading } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';
import { useSykmeldtoppfolging } from '../../contexts/sykmeldtoppfolging-context';

import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';
import { TilbakeIArbeid } from '../../model/sporsmal';

const TEKSTER: Tekster<string> = {
    nb: {
        tittel: 'Personen skal tilbake i full jobb innen 52 uker',
        beskrivelse: 'Vurder om det er nødvendig å registrere vedkommende for mer sykmeldtoppfølging.',
    },
};
const SkalTilbakeTilJobb = () => {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());
    const { registrering } = useSykmeldtoppfolging();

    const { tilbakeIArbeid } = registrering;

    if (![TilbakeIArbeid.JA_FULL_STILLING].includes(tilbakeIArbeid as TilbakeIArbeid)) {
        return null;
    }

    return (
        <Alert variant="warning" className="mb-8">
            <Heading level="1" size="small">
                {tekst('tittel')}
            </Heading>
            <BodyLong spacing>{tekst('beskrivelse')}</BodyLong>
        </Alert>
    );
};

export default SkalTilbakeTilJobb;
