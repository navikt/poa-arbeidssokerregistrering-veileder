import useSprak from '../../hooks/useSprak';
import { useSykmeldtoppfolging } from '../../contexts/sykmeldtoppfolging-context';

import RadioGruppe from '../radio-gruppe/radio-gruppe';
import { FremtidigSituasjon, hentTekst, SporsmalId, UtdanningGodkjentValg } from '../../model/sporsmal';

const UtdanningGodkjent = () => {
    const { registrering, doValidate, setRegistrering } = useSykmeldtoppfolging();
    const sprak = useSprak();
    const tekst = (key: string) => hentTekst(sprak, key);
    const visFeilmelding = doValidate ? !Object.keys(registrering).includes('utdanningGodkjent') : false;

    const lagValg = (valg: UtdanningGodkjentValg) => ({ tekst: tekst(valg), value: valg });
    const valg = [
        lagValg(UtdanningGodkjentValg.JA),
        lagValg(UtdanningGodkjentValg.NEI),
        lagValg(UtdanningGodkjentValg.VET_IKKE),
    ];

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
                legend={tekst(SporsmalId.utdanningGodkjent)}
                valg={valg}
                onSelect={(val) => setRegistrering({ [SporsmalId.utdanningGodkjent]: val })}
                visFeilmelding={visFeilmelding}
            />
        </form>
    );
};

export default UtdanningGodkjent;
