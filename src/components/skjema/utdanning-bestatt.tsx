import useSprak from '../../hooks/useSprak';
import { useRegistrering } from '../../contexts/registrering-context';

import RadioGruppe from '../radio-gruppe/radio-gruppe';
import {
    DinSituasjon as JobbSituasjon,
    hentTekst,
    JaEllerNei,
    SporsmalId,
    Utdanningsnivaa,
} from '../../model/sporsmal';

const BestattUtdanning = () => {
    const sprak = useSprak();
    const { registrering, doValidate, setRegistrering } = useRegistrering();
    const tekst = (key: string) => hentTekst(sprak, key);
    const lagValg = (valg: JaEllerNei) => ({ tekst: tekst(valg), value: valg });
    const valg = [lagValg(JaEllerNei.JA), lagValg(JaEllerNei.NEI)];
    const visFeilmelding = doValidate ? !Object.keys(registrering).includes('utdanningBestatt') : false;

    if (
        registrering[SporsmalId.utdanning] === Utdanningsnivaa.INGEN_UTDANNING ||
        registrering[SporsmalId.dinSituasjon] === JobbSituasjon.VIL_FORTSETTE_I_JOBB
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

export default BestattUtdanning;
