import { Heading, Panel } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';
import { useSykmeldtoppfolging } from '../../contexts/sykmeldtoppfolging-context';

import RadioGruppe from '../radio-gruppe/radio-gruppe';
import { hentTekst, JaEllerNei, SporsmalId, FremtidigSituasjon } from '../../model/sporsmal';

import styles from '../../styles/skjema.module.css';

const UtdanningBestatt = () => {
    const sprak = useSprak();
    const { registrering, doValidate, setRegistrering } = useSykmeldtoppfolging();
    const tekst = (key: string) => hentTekst(sprak, key);
    const lagValg = (valg: JaEllerNei) => ({ tekst: tekst(valg), value: valg });
    const valg = [lagValg(JaEllerNei.JA), lagValg(JaEllerNei.NEI)];
    const visFeilmelding = doValidate ? !Object.keys(registrering).includes('utdanningBestatt') : false;
    const { fremtidigSituasjon } = registrering;

    if (
        ![FremtidigSituasjon.NY_ARBEIDSGIVER, FremtidigSituasjon.USIKKER].includes(
            fremtidigSituasjon as FremtidigSituasjon,
        )
    ) {
        return null;
    }

    return (
        <Panel className={styles.panel} border={true}>
            <form>
                <Heading size="medium" spacing level="1">
                    Utdanning
                </Heading>
                <RadioGruppe
                    legend={tekst(SporsmalId.utdanningBestatt)}
                    valg={valg}
                    onSelect={(val) => setRegistrering({ [SporsmalId.utdanningBestatt]: val })}
                    visFeilmelding={visFeilmelding}
                />
            </form>
        </Panel>
    );
};

export default UtdanningBestatt;
