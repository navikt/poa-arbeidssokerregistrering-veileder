import useSprak from '../../hooks/useSprak';
import { useRegistrering } from '../../contexts/registrering-context';

import RadioGruppe from '../radio-gruppe/radio-gruppe';
import {
    DinSituasjon as JobbSituasjon,
    hentTekst,
    SporsmalId,
    UtdanningGodkjentValg,
    Utdanningsnivaa,
} from '../../model/sporsmal';

const UtdanningGodkjent = () => {
    const { registrering, doValidate, setRegistrering } = useRegistrering();
    const sprak = useSprak();
    const tekst = (key: string) => hentTekst(sprak, key);
    const visFeilmelding = doValidate ? !Object.keys(registrering).includes('utdanningGodkjent') : false;

    const lagValg = (valg: UtdanningGodkjentValg) => ({ tekst: tekst(valg), value: valg });
    const valg = [
        lagValg(UtdanningGodkjentValg.JA),
        lagValg(UtdanningGodkjentValg.NEI),
        lagValg(UtdanningGodkjentValg.VET_IKKE),
    ];

    if (
        registrering[SporsmalId.utdanning] === Utdanningsnivaa.INGEN_UTDANNING ||
        registrering[SporsmalId.dinSituasjon] === JobbSituasjon.VIL_FORTSETTE_I_JOBB
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
