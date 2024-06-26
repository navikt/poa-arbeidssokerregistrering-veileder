import useSprak from '../../hooks/useSprak';
import { useRegistrering } from '../../contexts/registrering-context';

import RadioGruppe from '../radio-gruppe/radio-gruppe';
import { hentTekst } from '../../model/sporsmal';
import {
    DinSituasjon as JobbSituasjon,
    JaEllerNei,
    SporsmalId,
    Utdanningsnivaa,
} from '@navikt/arbeidssokerregisteret-utils';

const BestattUtdanning = () => {
    const sprak = useSprak();
    const { registrering, doValidate, setRegistrering } = useRegistrering();
    const tekst = (key: string) => hentTekst(sprak, key);
    const lagValg = (valg: JaEllerNei) => ({ tekst: tekst(valg), value: valg });
    const valg = [lagValg(JaEllerNei.JA), lagValg(JaEllerNei.NEI)];
    const valgt = registrering[SporsmalId.utdanningBestatt];
    const visFeilmelding = doValidate
        ? !registrering[SporsmalId.utdanningBestatt] ||
          registrering[SporsmalId.utdanningBestatt] === JaEllerNei.INGEN_SVAR
        : false;

    if (
        registrering[SporsmalId.utdanning] === Utdanningsnivaa.INGEN_UTDANNING ||
        registrering[SporsmalId.utdanning] === Utdanningsnivaa.GRUNNSKOLE ||
        registrering[SporsmalId.dinSituasjon] === JobbSituasjon.VIL_FORTSETTE_I_JOBB
    ) {
        return null;
    }

    return (
        <form className={'mt-8'}>
            <RadioGruppe
                legend={tekst(SporsmalId.utdanningBestatt)}
                valg={valg}
                valgt={valgt}
                onSelect={(val) => setRegistrering({ [SporsmalId.utdanningBestatt]: val })}
                visFeilmelding={visFeilmelding}
            />
        </form>
    );
};

export default BestattUtdanning;
