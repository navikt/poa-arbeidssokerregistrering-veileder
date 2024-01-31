import { Alert, BodyLong, Heading } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';
import { useSykmeldtoppfolging } from '../../contexts/sykmeldtoppfolging-context';

import {
    FremtidigSituasjon,
    lagHentTekstForSprak,
    Tekster,
    TilbakeIArbeid,
} from '@navikt/arbeidssokerregisteret-utils';

const TEKSTER: Tekster<string> = {
    nb: {
        tittel: 'Personen skal tilbake i full jobb innen 52 uker',
        beskrivelse: 'Vurder om det er nødvendig å registrere vedkommende for mer sykmeldtoppfølging.',
    },
};
const SkalTilbakeTilJobb = () => {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());
    const { registrering } = useSykmeldtoppfolging();

    const { tilbakeIArbeid, fremtidigSituasjon } = registrering;

    if (
        !(
            [TilbakeIArbeid.JA_FULL_STILLING].includes(tilbakeIArbeid as TilbakeIArbeid) &&
            [FremtidigSituasjon.SAMME_ARBEIDSGIVER, FremtidigSituasjon.SAMME_ARBEIDSGIVER_NY_STILLING].includes(
                fremtidigSituasjon as FremtidigSituasjon,
            )
        )
    ) {
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
