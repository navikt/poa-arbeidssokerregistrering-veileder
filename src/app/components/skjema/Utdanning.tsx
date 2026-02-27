'use client';

import {
    JaEllerNei,
    DinSituasjon as Jobbsituasjon,
    lagHentTekstForSprak,
    SPORSMAL_TEKSTER,
    SporsmalId,
    UtdanningGodkjentValg,
    Utdanningsnivaa,
} from '@navikt/arbeidssokerregisteret-utils';
import { Box, Heading } from '@navikt/ds-react';
import RadioGruppe from '@/components/radio-gruppe/radio-gruppe';
import type { RegistreringState } from '@/model/registrering';

type UtdanningProps = {
    registrering: RegistreringState;
    setRegistrering: (data: Partial<RegistreringState>) => void;
    doValidate: boolean;
};

const UTDANNINGSNIVAAER = [
    Utdanningsnivaa.INGEN_UTDANNING,
    Utdanningsnivaa.GRUNNSKOLE,
    Utdanningsnivaa.VIDEREGAENDE_GRUNNUTDANNING,
    Utdanningsnivaa.VIDEREGAENDE_FAGBREV_SVENNEBREV,
    Utdanningsnivaa.HOYERE_UTDANNING_1_TIL_4,
    Utdanningsnivaa.HOYERE_UTDANNING_5_ELLER_MER,
] as const;

const NIVAAER_UTEN_GODKJENT_OG_BESTATT: Utdanningsnivaa[] = [
    Utdanningsnivaa.INGEN_UTDANNING,
    Utdanningsnivaa.GRUNNSKOLE,
];

function tilRegistreringsState(value: Utdanningsnivaa): Partial<RegistreringState> {
    if (NIVAAER_UTEN_GODKJENT_OG_BESTATT.includes(value)) {
        return {
            [SporsmalId.utdanning]: value,
            [SporsmalId.utdanningGodkjent]: UtdanningGodkjentValg.INGEN_SVAR,
            [SporsmalId.utdanningBestatt]: JaEllerNei.INGEN_SVAR,
        };
    }

    return {
        [SporsmalId.utdanning]: value,
    };
}

function UtdanningGodkjent({ registrering, setRegistrering, doValidate }: UtdanningProps) {
    const tekst = lagHentTekstForSprak(SPORSMAL_TEKSTER, 'nb');

    const utdanningsnivaa = registrering[SporsmalId.utdanning];
    const skjulGodkjent =
        utdanningsnivaa === undefined ||
        NIVAAER_UTEN_GODKJENT_OG_BESTATT.includes(utdanningsnivaa) ||
        registrering[SporsmalId.dinSituasjon] === Jobbsituasjon.VIL_FORTSETTE_I_JOBB;

    if (skjulGodkjent) {
        return null;
    }

    const visFeilmelding = doValidate
        ? !registrering[SporsmalId.utdanningGodkjent] ||
          registrering[SporsmalId.utdanningGodkjent] === UtdanningGodkjentValg.INGEN_SVAR
        : false;

    const valg = [
        { tekst: tekst(UtdanningGodkjentValg.JA), value: UtdanningGodkjentValg.JA },
        { tekst: tekst(UtdanningGodkjentValg.NEI), value: UtdanningGodkjentValg.NEI },
        { tekst: tekst(UtdanningGodkjentValg.VET_IKKE), value: UtdanningGodkjentValg.VET_IKKE },
    ];

    return (
        <form className='mt-8'>
            <RadioGruppe
                legend={tekst(SporsmalId.utdanningGodkjent)}
                valg={valg}
                valgt={registrering[SporsmalId.utdanningGodkjent]}
                onSelect={(val: UtdanningGodkjentValg) => setRegistrering({ [SporsmalId.utdanningGodkjent]: val })}
                visFeilmelding={visFeilmelding}
            />
        </form>
    );
}

function UtdanningBestatt({ registrering, setRegistrering, doValidate }: UtdanningProps) {
    const tekst = lagHentTekstForSprak(SPORSMAL_TEKSTER, 'nb');

    const utdanningsnivaa = registrering[SporsmalId.utdanning];
    const skjulBestatt =
        utdanningsnivaa === undefined ||
        NIVAAER_UTEN_GODKJENT_OG_BESTATT.includes(utdanningsnivaa) ||
        registrering[SporsmalId.dinSituasjon] === Jobbsituasjon.VIL_FORTSETTE_I_JOBB;

    if (skjulBestatt) {
        return null;
    }

    const visFeilmelding = doValidate
        ? !registrering[SporsmalId.utdanningBestatt] ||
          registrering[SporsmalId.utdanningBestatt] === JaEllerNei.INGEN_SVAR
        : false;

    const valg = [
        { tekst: tekst(JaEllerNei.JA), value: JaEllerNei.JA },
        { tekst: tekst(JaEllerNei.NEI), value: JaEllerNei.NEI },
    ];

    return (
        <form className='mt-8'>
            <RadioGruppe
                legend={tekst(SporsmalId.utdanningBestatt)}
                valg={valg}
                valgt={registrering[SporsmalId.utdanningBestatt]}
                onSelect={(val: JaEllerNei) => setRegistrering({ [SporsmalId.utdanningBestatt]: val })}
                visFeilmelding={visFeilmelding}
            />
        </form>
    );
}

function Utdanning({ registrering, setRegistrering, doValidate }: UtdanningProps) {
    const tekst = lagHentTekstForSprak(SPORSMAL_TEKSTER, 'nb');

    if (registrering[SporsmalId.dinSituasjon] === Jobbsituasjon.VIL_FORTSETTE_I_JOBB) {
        return null;
    }

    const visFeilmelding = doValidate && !Object.keys(registrering).includes(SporsmalId.utdanning);

    const valg = UTDANNINGSNIVAAER.map((nivaa) => ({
        tekst: tekst(nivaa),
        value: nivaa,
    }));

    return (
        <Box className='mb-8' borderWidth='1' padding='space-16' style={{ backgroundColor: 'var(--ax-neutral-100)' }}>
            <form>
                <Heading size='medium' spacing level='1'>
                    Utdanning
                </Heading>
                <RadioGruppe
                    legend={tekst(SporsmalId.utdanning)}
                    valg={valg}
                    valgt={registrering[SporsmalId.utdanning]}
                    onSelect={(val: Utdanningsnivaa) => setRegistrering(tilRegistreringsState(val))}
                    visFeilmelding={visFeilmelding}
                />
            </form>
            <UtdanningGodkjent registrering={registrering} setRegistrering={setRegistrering} doValidate={doValidate} />
            <UtdanningBestatt registrering={registrering} setRegistrering={setRegistrering} doValidate={doValidate} />
        </Box>
    );
}

export { Utdanning };
