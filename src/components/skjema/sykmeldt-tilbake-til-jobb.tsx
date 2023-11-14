import { Heading, Panel } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';
import { useSykmeldtoppfolging } from '../../contexts/sykmeldtoppfolging-context';

import RadioGruppe from '../radio-gruppe/radio-gruppe';
import { hentTekst, SporsmalId, TilbakeIArbeid } from '../../model/sporsmal';

import styles from '../../styles/skjema.module.css';

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

    return (
        <Panel className={styles.panel} border={true}>
            <form>
                <Heading size="medium" spacing level="1">
                    Arbeidssituasjon
                </Heading>
                <RadioGruppe
                    legend={tekst(SporsmalId.tilbakeIArbeid)}
                    valg={valg}
                    onSelect={(val) => setRegistrering({ [SporsmalId.tilbakeIArbeid]: val })}
                    visFeilmelding={visFeilmelding}
                />
            </form>
        </Panel>
    );
};

export default TilbakeTilJobb;
