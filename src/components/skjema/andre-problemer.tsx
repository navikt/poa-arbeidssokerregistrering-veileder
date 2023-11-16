import { Box, Heading } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';
import { useRegistrering } from '../../contexts/registrering-context';

import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';
import RadioGruppe from '../radio-gruppe/radio-gruppe';
import { JaEllerNei, SporsmalId } from '../../model/sporsmal';

const TEKSTER: Tekster<string> = {
    nb: {
        tittel: 'Har du andre problemer med å søke eller være i jobb?',
        ingress: 'For eksempel språk, lesing og skriving eller familiesituasjon.',
        JA: 'Ja',
        NEI: 'Nei',
    },
};

const AndreProblemer = () => {
    const { registrering, doValidate, setRegistrering } = useRegistrering();
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());

    const lagValg = (valg: JaEllerNei) => ({ tekst: tekst(valg), value: valg });
    const valg = [lagValg(JaEllerNei.JA), lagValg(JaEllerNei.NEI)];

    const visFeilmelding = doValidate ? !Object.keys(registrering).includes('andreForhold') : false;

    return (
        <Box className="mb-8 bg-gray-100" borderWidth="1" padding="4">
            <form>
                <Heading size="medium" spacing level="1">
                    Andre utfordringer knyttet til arbeid
                </Heading>
                <RadioGruppe
                    legend={tekst('tittel')}
                    beskrivelse={tekst('ingress')}
                    valg={valg}
                    onSelect={(val) => setRegistrering({ [SporsmalId.andreForhold]: val })}
                    visFeilmelding={visFeilmelding}
                />
            </form>
        </Box>
    );
};

export default AndreProblemer;
