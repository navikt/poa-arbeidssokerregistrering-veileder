import { Heading, Panel } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';
import { useSykmeldtoppfolging } from '../../contexts/sykmeldtoppfolging-context';

import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';
import RadioGruppe from '../radio-gruppe/radio-gruppe';
import { JaEllerNei, SporsmalId, FremtidigSituasjon } from '../../model/sporsmal';

import styles from '../../styles/skjema.module.css';

const TEKSTER: Tekster<string> = {
    nb: {
        tittel: 'Har du andre problemer med å søke eller være i jobb?',
        ingress: 'For eksempel språk, lesing og skriving eller familiesituasjon.',
        JA: 'Ja',
        NEI: 'Nei',
    },
};

const AndreProblemer = () => {
    const { registrering, doValidate, setRegistrering } = useSykmeldtoppfolging();
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());

    const lagValg = (valg: JaEllerNei) => ({ tekst: tekst(valg), value: valg });
    const valg = [lagValg(JaEllerNei.JA), lagValg(JaEllerNei.NEI)];

    const visFeilmelding = doValidate ? !Object.keys(registrering).includes('andreForhold') : false;

    const { fremtidigSituasjon } = registrering;

    if (
        ![FremtidigSituasjon.NY_ARBEIDSGIVER, FremtidigSituasjon.USIKKER].includes(
            fremtidigSituasjon as FremtidigSituasjon,
        )
    ) {
        return null;
    }

    return (
        <>
            <Panel className={`${styles.panel} mbm`} border={true}>
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
            </Panel>
        </>
    );
};

export default AndreProblemer;
