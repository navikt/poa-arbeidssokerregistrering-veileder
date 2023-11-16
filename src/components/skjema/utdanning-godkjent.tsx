import { Box, Heading } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';
import { useRegistrering } from '../../contexts/registrering-context';

import RadioGruppe from '../radio-gruppe/radio-gruppe';
import { hentTekst, SporsmalId, UtdanningGodkjentValg } from '../../model/sporsmal';

const UtdanningGodkjent = () => {
    const { registrering, doValidate, setRegistrering } = useRegistrering();
    const sprak = useSprak();
    const tekst = (key: string) => hentTekst(sprak, key);
    const visFeilmelding = doValidate ? !Object.keys(registrering).includes('utdanningGodkjent') : false;

    const lagValg = (valg: UtdanningGodkjentValg) => ({ tekst: tekst(valg), value: valg });
    const valg = [
        lagValg(UtdanningGodkjentValg.JA),
        lagValg(UtdanningGodkjentValg.NEI),
        lagValg(UtdanningGodkjentValg.VET_IKKE),
    ];

    return (
        <Box className="mb-8 bg-gray-100" borderWidth="1" padding="4">
            <form>
                <Heading size="medium" spacing level="1">
                    Utdanning
                </Heading>
                <RadioGruppe
                    legend={tekst(SporsmalId.utdanningGodkjent)}
                    valg={valg}
                    onSelect={(val) => setRegistrering({ [SporsmalId.utdanningGodkjent]: val })}
                    visFeilmelding={visFeilmelding}
                />
            </form>
        </Box>
    );
};

export default UtdanningGodkjent;
