import useSprak from '../../hooks/useSprak';
import { useSykmeldtoppfolging } from '../../contexts/sykmeldtoppfolging-context';

import RadioGruppe from '../radio-gruppe/radio-gruppe';
import { hentTekst } from '../../model/sporsmal';
import { FremtidigSituasjon, JaEllerNei, SporsmalId } from '@navikt/arbeidssokerregisteret-utils';

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
        <form className={'mt-8'}>
            <RadioGruppe
                legend={tekst(SporsmalId.utdanningBestatt)}
                valg={valg}
                onSelect={(val) => setRegistrering({ [SporsmalId.utdanningBestatt]: val })}
                visFeilmelding={visFeilmelding}
            />
        </form>
    );
};

export default UtdanningBestatt;
