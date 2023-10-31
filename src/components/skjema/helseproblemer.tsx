import { Heading, Panel } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';
import { useRegistrering } from '../../contexts/registrering-context';

import lagHentTekstForSprak, { Tekster } from '../../lib/lag-hent-tekst-for-sprak';
import RadioGruppe from '../radio-gruppe/radio-gruppe';
import { JaEllerNei } from '../../model/sporsmal';

import styles from '../../styles/skjema.module.css';

const TEKSTER: Tekster<string> = {
    nb: {
        tittel: 'Har du helseproblemer som hindrer deg i å søke eller være i jobb?',
        JA: 'Ja',
        NEI: 'Nei'
    },
};

const Helseproblemer = () => {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());
    const { registrering, setRegistrering } = useRegistrering()

    const lagValg = (valg: JaEllerNei) => ({ tekst: tekst(valg), value: valg });
    const valg = [lagValg(JaEllerNei.JA), lagValg(JaEllerNei.NEI)];
    const visFeilmelding = !Object.keys(registrering).includes('helseHinder')

    return (
        <>
            <Panel className={`${styles.panel} mbm`} border={true}>
                <form>
                    <Heading size="medium" spacing level="1">
                        Helse
                    </Heading>
                    <RadioGruppe
                        legend={tekst('tittel')}
                        valg={valg}
                        onSelect={(val) => setRegistrering({helseHinder: val})}
                        visFeilmelding={visFeilmelding}
                    />
                </form>
            </Panel>
        </>
    );
};

export default Helseproblemer;
