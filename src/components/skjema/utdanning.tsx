import { Box, Heading } from '@navikt/ds-react';

import useSprak from '../../hooks/useSprak';
import { useRegistrering } from '../../contexts/registrering-context';

import RadioGruppe from '../radio-gruppe/radio-gruppe';
import { hentTekst } from '../../model/sporsmal';
import { RegistreringState } from '../../model/registrering';
import UtdanningBestatt from './utdanning-bestatt';
import UtdanningGodkjent from './utdanning-godkjent';
import {
    DinSituasjon as JobbSituasjon,
    JaEllerNei,
    SporsmalId,
    UtdanningGodkjentValg,
    Utdanningsnivaa,
} from '@navikt/arbeidssokerregisteret-utils';

function tilRegistreringsState(value: Utdanningsnivaa): Partial<RegistreringState> {
    if (value === Utdanningsnivaa.INGEN_UTDANNING || value === Utdanningsnivaa.GRUNNSKOLE) {
        return {
            [SporsmalId.utdanning]: value,
            [SporsmalId.utdanningGodkjent]: UtdanningGodkjentValg.INGEN_SVAR,
            [SporsmalId.utdanningBestatt]: JaEllerNei.INGEN_SVAR,
        };
    }

    return {
        [SporsmalId.utdanning]: value,
    };
}

const Utdanning = () => {
    const { registrering, doValidate, setRegistrering } = useRegistrering();
    const sprak = useSprak();
    const tekst = (key: string) => hentTekst(sprak, key);
    const visFeilmelding = doValidate ? !Object.keys(registrering).includes('utdanning') : false;

    const valg = [
        { tekst: tekst(Utdanningsnivaa.INGEN_UTDANNING), value: Utdanningsnivaa.INGEN_UTDANNING },
        { tekst: tekst(Utdanningsnivaa.GRUNNSKOLE), value: Utdanningsnivaa.GRUNNSKOLE },
        {
            tekst: tekst(Utdanningsnivaa.VIDEREGAENDE_GRUNNUTDANNING),
            value: Utdanningsnivaa.VIDEREGAENDE_GRUNNUTDANNING,
        },
        {
            tekst: tekst(Utdanningsnivaa.VIDEREGAENDE_FAGBREV_SVENNEBREV),
            value: Utdanningsnivaa.VIDEREGAENDE_FAGBREV_SVENNEBREV,
        },
        { tekst: tekst(Utdanningsnivaa.HOYERE_UTDANNING_1_TIL_4), value: Utdanningsnivaa.HOYERE_UTDANNING_1_TIL_4 },
        {
            tekst: tekst(Utdanningsnivaa.HOYERE_UTDANNING_5_ELLER_MER),
            value: Utdanningsnivaa.HOYERE_UTDANNING_5_ELLER_MER,
        },
    ];
    const valgt = registrering[SporsmalId.utdanning];
    if (registrering[SporsmalId.dinSituasjon] === JobbSituasjon.VIL_FORTSETTE_I_JOBB) {
        return null;
    }

    return (
        <Box className="mb-8" borderWidth="1" padding="4" style={{ backgroundColor: 'var(--ax-neutral-100)' }}>
            <form>
                <Heading size="medium" spacing level="1">
                    Utdanning
                </Heading>
                <RadioGruppe
                    legend={tekst(SporsmalId.utdanning)}
                    valg={valg}
                    valgt={valgt}
                    onSelect={(val) => setRegistrering(tilRegistreringsState(val))}
                    visFeilmelding={visFeilmelding}
                />
            </form>
            <UtdanningGodkjent />
            <UtdanningBestatt />
        </Box>
    );
};

export default Utdanning;
