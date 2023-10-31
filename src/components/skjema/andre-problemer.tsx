import { Heading, Panel } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';
import { useRegistrering } from '../../contexts/registrering-context';

import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';
import RadioGruppe from '../radio-gruppe/radio-gruppe';
import { JaEllerNei } from '../../model/sporsmal';

import styles from '../../styles/skjema.module.css';

const TEKSTER: Tekster<string> = {
    nb: {
        tittel: 'Har du andre problemer med å søke eller være i jobb?',
        ingress: 'For eksempel språk, lesing og skriving eller familiesituasjon.',
        JA: 'Ja',
        NEI: 'Nei'
    },
};

const AndreProblemer = () => {
    const { registrering, setRegistrering } = useRegistrering()
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());

    const lagValg = (valg: JaEllerNei) => ({ tekst: tekst(valg), value: valg });
    const valg = [lagValg(JaEllerNei.JA), lagValg(JaEllerNei.NEI)];

    const visFeilmelding = !Object.keys(registrering).includes('andreForhold')

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
                        onSelect={(val) => setRegistrering({andreForhold: val})}
                        visFeilmelding={visFeilmelding}
                    />
                </form>
            </Panel>
        </>
    );
};

export default AndreProblemer;
