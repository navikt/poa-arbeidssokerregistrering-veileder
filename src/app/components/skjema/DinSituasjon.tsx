'use client';

import {
    JaEllerNei,
    DinSituasjon as Jobbsituasjon,
    lagHentTekstForSprak,
    SisteStillingValg,
    SPORSMAL_TEKSTER,
    SporsmalId,
    UtdanningGodkjentValg,
    Utdanningsnivaa,
} from '@navikt/arbeidssokerregisteret-utils';
import { Box, Heading } from '@navikt/ds-react';
import RadioGruppe from '@/components/radio-gruppe/radio-gruppe';
import type { RegistreringState } from '@/model/registrering';

type DinSituasjonProps = {
    registrering: RegistreringState;
    setRegistrering: (data: Partial<RegistreringState>) => void;
    doValidate: boolean;
};

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

const VALG = [
    Jobbsituasjon.MISTET_JOBBEN,
    Jobbsituasjon.HAR_SAGT_OPP,
    Jobbsituasjon.DELTIDSJOBB_VIL_MER,
    Jobbsituasjon.ALDRI_HATT_JOBB,
    Jobbsituasjon.VIL_BYTTE_JOBB,
    Jobbsituasjon.JOBB_OVER_2_AAR,
    Jobbsituasjon.ER_PERMITTERT,
    Jobbsituasjon.USIKKER_JOBBSITUASJON,
    Jobbsituasjon.AKKURAT_FULLFORT_UTDANNING,
    Jobbsituasjon.VIL_FORTSETTE_I_JOBB,
] as const;

function DinSituasjon({ registrering, setRegistrering, doValidate }: DinSituasjonProps) {
    const tekst = lagHentTekstForSprak(SPORSMAL_TEKSTER, 'nb');
    const visFeilmelding = doValidate && !Object.keys(registrering).includes(SporsmalId.dinSituasjon);

    const valg = VALG.map((situasjon) => ({
        tekst: tekst(situasjon),
        value: situasjon,
    }));

    return (
        <Box className='mb-8' borderWidth='1' padding='space-16' style={{ backgroundColor: 'var(--ax-neutral-100)' }}>
            <form>
                <Heading size='medium' spacing level='1'>
                    Din arbeidssøkersituasjon
                </Heading>
                <RadioGruppe
                    legend={tekst(SporsmalId.dinSituasjon)}
                    valg={valg}
                    valgt={registrering.dinSituasjon}
                    onSelect={(val: Jobbsituasjon) => setRegistrering(tilRegistreringsState(val))}
                    visFeilmelding={visFeilmelding}
                />
            </form>
        </Box>
    );
}

export { DinSituasjon };
