'use client';

import { JaEllerNei, lagHentTekstForSprak, SporsmalId, type Tekster } from '@navikt/arbeidssokerregisteret-utils';
import { Box, Heading } from '@navikt/ds-react';
import RadioGruppe from '@/components/radio-gruppe/radio-gruppe';
import type { RegistreringState } from '@/model/registrering';

type HindringerProps = {
    registrering: RegistreringState;
    setRegistrering: (data: Partial<RegistreringState>) => void;
    doValidate: boolean;
};

const HELSE_TEKSTER: Tekster<string> = {
    nb: {
        tittel: 'Har du helseproblemer som hindrer deg i å søke eller være i jobb?',
        JA: 'Ja',
        NEI: 'Nei',
    },
};

const ANDRE_TEKSTER: Tekster<string> = {
    nb: {
        tittel: 'Har du andre problemer med å søke eller være i jobb?',
        ingress: 'For eksempel språk, lesing og skriving eller familiesituasjon.',
        JA: 'Ja',
        NEI: 'Nei',
    },
};

function Helseproblemer({ registrering, setRegistrering, doValidate }: HindringerProps) {
    const tekst = lagHentTekstForSprak(HELSE_TEKSTER, 'nb');

    const valg = [
        { tekst: tekst(JaEllerNei.JA), value: JaEllerNei.JA },
        { tekst: tekst(JaEllerNei.NEI), value: JaEllerNei.NEI },
    ];

    const visFeilmelding = doValidate && !Object.keys(registrering).includes(SporsmalId.helseHinder);

    return (
        <form>
            <RadioGruppe
                legend={tekst('tittel')}
                valg={valg}
                valgt={registrering[SporsmalId.helseHinder]}
                onSelect={(val: JaEllerNei) => setRegistrering({ [SporsmalId.helseHinder]: val })}
                visFeilmelding={visFeilmelding}
            />
        </form>
    );
}

function AndreProblemer({ registrering, setRegistrering, doValidate }: HindringerProps) {
    const tekst = lagHentTekstForSprak(ANDRE_TEKSTER, 'nb');

    const valg = [
        { tekst: tekst(JaEllerNei.JA), value: JaEllerNei.JA },
        { tekst: tekst(JaEllerNei.NEI), value: JaEllerNei.NEI },
    ];

    const visFeilmelding = doValidate && !Object.keys(registrering).includes(SporsmalId.andreForhold);

    return (
        <form className='mt-8'>
            <RadioGruppe
                legend={tekst('tittel')}
                beskrivelse={tekst('ingress')}
                valg={valg}
                valgt={registrering[SporsmalId.andreForhold]}
                onSelect={(val: JaEllerNei) => setRegistrering({ [SporsmalId.andreForhold]: val })}
                visFeilmelding={visFeilmelding}
            />
        </form>
    );
}

function Hindringer({ registrering, setRegistrering, doValidate }: HindringerProps) {
    return (
        <Box className='mb-8' borderWidth='1' padding='space-16' style={{ backgroundColor: 'var(--ax-neutral-100)' }}>
            <Heading size='medium' spacing level='1'>
                Hindringer
            </Heading>
            <Helseproblemer registrering={registrering} setRegistrering={setRegistrering} doValidate={doValidate} />
            <AndreProblemer registrering={registrering} setRegistrering={setRegistrering} doValidate={doValidate} />
        </Box>
    );
}

export { Hindringer };
