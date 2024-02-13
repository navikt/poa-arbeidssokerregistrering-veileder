import { Box, Heading } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';
import { useSykmeldtoppfolging } from '../../contexts/sykmeldtoppfolging-context';

import RadioGruppe from '../radio-gruppe/radio-gruppe';
import { hentTekst } from '../../model/sporsmal';
import { FremtidigSituasjon, SykmeldtSporsmalId } from '@navikt/arbeidssokerregisteret-utils';

const SykmeldtFremtidigSituasjon = () => {
    const sprak = useSprak();
    const tekst = (key: string) => hentTekst(sprak, key);
    const { registrering, doValidate, setRegistrering } = useSykmeldtoppfolging();
    const visFeilmelding = doValidate ? !Object.keys(registrering).includes('fremtidigSituasjon') : false;

    const lagValg = (valg: FremtidigSituasjon) => ({ tekst: tekst(valg), value: valg });

    const valg = [
        lagValg(FremtidigSituasjon.SAMME_ARBEIDSGIVER),
        lagValg(FremtidigSituasjon.SAMME_ARBEIDSGIVER_NY_STILLING),
        lagValg(FremtidigSituasjon.NY_ARBEIDSGIVER),
        lagValg(FremtidigSituasjon.USIKKER),
        lagValg(FremtidigSituasjon.INGEN_PASSER),
    ];

    return (
        <Box className="mb-8 bg-gray-100" borderWidth="1" padding="4">
            <form>
                <Heading size="medium" spacing level="1">
                    Arbeidssituasjon
                </Heading>
                <RadioGruppe
                    legend={tekst(SykmeldtSporsmalId.fremtidigSituasjon)}
                    valg={valg}
                    onSelect={(val) => setRegistrering({ [SykmeldtSporsmalId.fremtidigSituasjon]: val })}
                    visFeilmelding={visFeilmelding}
                />
            </form>
        </Box>
    );
};

export default SykmeldtFremtidigSituasjon;
