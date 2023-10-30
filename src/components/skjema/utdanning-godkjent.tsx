import { Heading, Panel } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';

import RadioGruppe from '../radio-gruppe/radio-gruppe';
import { hentTekst, SporsmalId, UtdanningGodkjentValg } from '../../model/sporsmal';

import styles from '../../styles/skjema.module.css';

const UtdanningGodkjent = () => {
    const sprak = useSprak();
    const tekst = (key: string) => hentTekst(sprak, key);

    const lagValg = (valg: UtdanningGodkjentValg) => ({ tekst: tekst(valg), value: valg });
    const valg = [
        lagValg(UtdanningGodkjentValg.JA),
        lagValg(UtdanningGodkjentValg.NEI),
        lagValg(UtdanningGodkjentValg.VET_IKKE),
    ];

    return (
        <Panel className={styles.panel} border={true}>
            <form>
                <Heading size="medium" spacing level="1">
                    Utdanning
                </Heading>
                <RadioGruppe
                    legend={tekst(SporsmalId.utdanningGodkjent)}
                    valg={valg}
                />
            </form>
        </Panel>
    );
};

export default UtdanningGodkjent;
