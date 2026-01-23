import { Box, Heading } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';
import { useRegistrering } from '../../contexts/registrering-context';

import RadioGruppe from '../radio-gruppe/radio-gruppe';
import { hentTekst } from '../../model/sporsmal';
import {
    DinSituasjon as Jobbsituasjon,
    JaEllerNei,
    SporsmalId,
    UtdanningGodkjentValg,
    Utdanningsnivaa,
    SisteStillingValg,
} from '@navikt/arbeidssokerregisteret-utils';
import { RegistreringState } from '../../model/registrering';

const DinSituasjon = () => {
    const sprak = useSprak();
    const { registrering, doValidate, setRegistrering } = useRegistrering();
    const tekst = (key: string) => hentTekst(sprak, key);
    const visFeilmelding = doValidate ? !Object.keys(registrering).includes('dinSituasjon') : false;

    function tilRegistreringsState(value: Jobbsituasjon): Partial<RegistreringState> {
        if (value === Jobbsituasjon.VIL_FORTSETTE_I_JOBB) {
            return {
                [SporsmalId.dinSituasjon]: value,
                [SporsmalId.utdanning]: Utdanningsnivaa.INGEN_SVAR,
                [SporsmalId.utdanningGodkjent]: UtdanningGodkjentValg.INGEN_SVAR,
                [SporsmalId.utdanningBestatt]: JaEllerNei.INGEN_SVAR,
            };
        }

        if (
            ![
                Jobbsituasjon.AKKURAT_FULLFORT_UTDANNING,
                Jobbsituasjon.JOBB_OVER_2_AAR,
                Jobbsituasjon.USIKKER_JOBBSITUASJON,
            ].includes(value)
        ) {
            return {
                [SporsmalId.dinSituasjon]: value,
                [SporsmalId.sisteStilling]: SisteStillingValg.INGEN_SVAR,
            };
        }

        return {
            [SporsmalId.dinSituasjon]: value,
        };
    }

    const valg = [
        { tekst: tekst(Jobbsituasjon.MISTET_JOBBEN), value: Jobbsituasjon.MISTET_JOBBEN },
        { tekst: tekst(Jobbsituasjon.HAR_SAGT_OPP), value: Jobbsituasjon.HAR_SAGT_OPP },
        { tekst: tekst(Jobbsituasjon.DELTIDSJOBB_VIL_MER), value: Jobbsituasjon.DELTIDSJOBB_VIL_MER },
        { tekst: tekst(Jobbsituasjon.ALDRI_HATT_JOBB), value: Jobbsituasjon.ALDRI_HATT_JOBB },
        { tekst: tekst(Jobbsituasjon.VIL_BYTTE_JOBB), value: Jobbsituasjon.VIL_BYTTE_JOBB },
        { tekst: tekst(Jobbsituasjon.JOBB_OVER_2_AAR), value: Jobbsituasjon.JOBB_OVER_2_AAR },
        { tekst: tekst(Jobbsituasjon.ER_PERMITTERT), value: Jobbsituasjon.ER_PERMITTERT },
        {
            tekst: tekst(Jobbsituasjon.USIKKER_JOBBSITUASJON),
            value: Jobbsituasjon.USIKKER_JOBBSITUASJON,
        },
        {
            tekst: tekst(Jobbsituasjon.AKKURAT_FULLFORT_UTDANNING),
            value: Jobbsituasjon.AKKURAT_FULLFORT_UTDANNING,
        },
        { tekst: tekst(Jobbsituasjon.VIL_FORTSETTE_I_JOBB), value: Jobbsituasjon.VIL_FORTSETTE_I_JOBB },
    ];
    const valgt = registrering.dinSituasjon;

    return (
        <Box className="mb-8" borderWidth="1" padding="space-16" style={{ backgroundColor: 'var(--ax-neutral-100)' }}>
            <form>
                <Heading size="medium" spacing level="1">
                    Din arbeidssøkersituasjon
                </Heading>
                <RadioGruppe
                    legend={tekst(SporsmalId.dinSituasjon)}
                    valg={valg}
                    valgt={valgt}
                    onSelect={(val) => setRegistrering(tilRegistreringsState(val))}
                    visFeilmelding={visFeilmelding}
                />
            </form>
        </Box>
    );
};

export default DinSituasjon;
