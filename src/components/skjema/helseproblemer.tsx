import { Box, Heading } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';
import { useRegistrering } from '../../contexts/registrering-context';

import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';
import RadioGruppe from '../radio-gruppe/radio-gruppe';
import { JaEllerNei, SporsmalId } from '../../model/sporsmal';

const TEKSTER: Tekster<string> = {
    nb: {
        tittel: 'Har du helseproblemer som hindrer deg i å søke eller være i jobb?',
        JA: 'Ja',
        NEI: 'Nei',
    },
};

const Helseproblemer = () => {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());
    const { registrering, doValidate, setRegistrering } = useRegistrering();

    const lagValg = (valg: JaEllerNei) => ({ tekst: tekst(valg), value: valg });
    const valg = [lagValg(JaEllerNei.JA), lagValg(JaEllerNei.NEI)];
    const visFeilmelding = doValidate ? !Object.keys(registrering).includes('helseHinder') : false;

    return (
        <Box className="mb-8 bg-gray-100" borderWidth="1" padding="4">
            <form>
                <Heading size="medium" spacing level="1">
                    Helse
                </Heading>
                <RadioGruppe
                    legend={tekst('tittel')}
                    valg={valg}
                    onSelect={(val) => setRegistrering({ [SporsmalId.helseHinder]: val })}
                    visFeilmelding={visFeilmelding}
                />
            </form>
        </Box>
    );
};

export default Helseproblemer;
