import useSprak from '../../../hooks/useSprak';
import { useRegistrering } from '../../../contexts/registrering-context';

import RadioGruppe from '../../radio-gruppe/radio-gruppe';
import { hentTekst, SisteStillingValg, SporsmalId } from '../../../model/sporsmal';

const SisteStilling = () => {
    const { registrering, doValidate, setRegistrering } = useRegistrering();
    const visFeilmelding = doValidate ? !Object.keys(registrering).includes('sisteStilling') : false;
    let sprak = useSprak();

    const valg = [
        { tekst: hentTekst(sprak, SisteStillingValg.HAR_HATT_JOBB), value: SisteStillingValg.HAR_HATT_JOBB },
        { tekst: hentTekst(sprak, SisteStillingValg.HAR_IKKE_HATT_JOBB), value: SisteStillingValg.HAR_IKKE_HATT_JOBB },
    ];

    return (
        <div className="mb-2">
            <RadioGruppe
                valg={valg}
                onSelect={(val) => setRegistrering({ [SporsmalId.sisteStilling]: val })}
                visFeilmelding={visFeilmelding}
            />
        </div>
    );
};

export default SisteStilling;
