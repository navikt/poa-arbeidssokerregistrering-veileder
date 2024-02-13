import { Box, Heading } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';
import { useSykmeldtoppfolging } from '../../contexts/sykmeldtoppfolging-context';

import RadioGruppe from '../radio-gruppe/radio-gruppe';
import { hentTekst } from '../../model/sporsmal';
import { FremtidigSituasjon, SykmeldtSporsmalId, TilbakeIArbeid } from '@navikt/arbeidssokerregisteret-utils';

const TilbakeTilJobb = () => {
    const sprak = useSprak();
    const tekst = (key: string) => hentTekst(sprak, key);
    const { registrering, doValidate, setRegistrering } = useSykmeldtoppfolging();
    const visFeilmelding = doValidate ? !Object.keys(registrering).includes('tilbakeIArbeid') : false;

    const lagValg = (valg: TilbakeIArbeid) => ({ tekst: tekst(valg), value: valg });

    const valg = [
        lagValg(TilbakeIArbeid.JA_FULL_STILLING),
        lagValg(TilbakeIArbeid.JA_REDUSERT_STILLING),
        lagValg(TilbakeIArbeid.USIKKER),
        lagValg(TilbakeIArbeid.NEI),
    ];

    const { fremtidigSituasjon } = registrering;

    if (
        ![FremtidigSituasjon.SAMME_ARBEIDSGIVER, FremtidigSituasjon.SAMME_ARBEIDSGIVER_NY_STILLING].includes(
            fremtidigSituasjon as FremtidigSituasjon,
        )
    ) {
        return null;
    }

    return (
        <Box className="mb-8 bg-gray-100" borderWidth="1" padding="4">
            <form>
                <Heading size="medium" spacing level="1">
                    Arbeidssituasjon
                </Heading>
                <RadioGruppe
                    legend={tekst(SykmeldtSporsmalId.tilbakeIArbeid)}
                    valg={valg}
                    onSelect={(val) => setRegistrering({ [SykmeldtSporsmalId.tilbakeIArbeid]: val })}
                    visFeilmelding={visFeilmelding}
                />
            </form>
        </Box>
    );
};

export default TilbakeTilJobb;
