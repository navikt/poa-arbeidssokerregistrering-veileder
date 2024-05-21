import useSprak from '../../hooks/useSprak';
import { useRegistrering } from '../../contexts/registrering-context';

import RadioGruppe from '../radio-gruppe/radio-gruppe';
import { hentTekst } from '../../model/sporsmal';
import {
    DinSituasjon as JobbSituasjon,
    SporsmalId,
    UtdanningGodkjentValg,
    Utdanningsnivaa,
} from '@navikt/arbeidssokerregisteret-utils';
import { useFeatureToggles } from '../../contexts/featuretoggle-context';

const UtdanningGodkjent = () => {
    const { registrering, doValidate, setRegistrering } = useRegistrering();
    const sprak = useSprak();
    const { toggles } = useFeatureToggles();
    const brukNyInngang = toggles['arbeidssokerregistrering.bruk-ny-inngang'];
    const tekst = (key: string) => hentTekst(sprak, key);
    const visFeilmelding = doValidate
        ? !registrering[SporsmalId.utdanningGodkjent] ||
          registrering[SporsmalId.utdanningGodkjent] === UtdanningGodkjentValg.INGEN_SVAR
        : false;

    const lagValg = (valg: UtdanningGodkjentValg) => ({ tekst: tekst(valg), value: valg });
    const valg = [
        lagValg(UtdanningGodkjentValg.JA),
        lagValg(UtdanningGodkjentValg.NEI),
        lagValg(UtdanningGodkjentValg.VET_IKKE),
    ];
    const valgt = registrering[SporsmalId.utdanningGodkjent];

    if (
        registrering[SporsmalId.utdanning] === Utdanningsnivaa.INGEN_UTDANNING ||
        (brukNyInngang && registrering[SporsmalId.utdanning] === Utdanningsnivaa.GRUNNSKOLE) ||
        registrering[SporsmalId.dinSituasjon] === JobbSituasjon.VIL_FORTSETTE_I_JOBB
    ) {
        return null;
    }

    return (
        <form className={'mt-8'}>
            <RadioGruppe
                legend={tekst(SporsmalId.utdanningGodkjent)}
                valg={valg}
                valgt={valgt}
                onSelect={(val) => setRegistrering({ [SporsmalId.utdanningGodkjent]: val })}
                visFeilmelding={visFeilmelding}
            />
        </form>
    );
};

export default UtdanningGodkjent;
