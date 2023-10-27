import {
    DinSituasjon,
    hentTekst,
    JaEllerNei,
    SisteStillingValg,
    SporsmalId,
    Svar,
    UtdanningGodkjentValg,
    Utdanningsnivaa,
} from '../model/sporsmal';
import { Side, SisteJobb, SkjemaState } from '../model/skjema';

export const aldriJobbet: SisteJobb = {
    label: 'X',
    konseptId: -1,
    styrk08: 'X',
};

type TeksterForBesvarelse = { sporsmalId: SporsmalId; sporsmal: string; svar: string }[];

type Payload = {
    besvarelse: Record<keyof SkjemaState, Svar | undefined>;
    sisteStilling: SisteJobb;
    teksterForBesvarelse: TeksterForBesvarelse;
};

function byggFullforRegistreringPayload(skjemaState: SkjemaState, side: Side = 'standard') {
    const initialStandardState: SkjemaState = {
        dinSituasjon: undefined,
        utdanning: Utdanningsnivaa.INGEN_SVAR,
        utdanningGodkjent: UtdanningGodkjentValg.INGEN_SVAR,
        utdanningBestatt: JaEllerNei.INGEN_SVAR,
        andreForhold: JaEllerNei.INGEN_SVAR,
        sisteStilling: SisteStillingValg.INGEN_SVAR,
        helseHinder: JaEllerNei.INGEN_SVAR,
    };

    const initialSykmeldtState = {
        utdanning: Utdanningsnivaa.INGEN_SVAR,
        utdanningGodkjent: UtdanningGodkjentValg.INGEN_SVAR,
        utdanningBestatt: JaEllerNei.INGEN_SVAR,
        andreForhold: JaEllerNei.INGEN_SVAR,
        sisteStilling: SisteStillingValg.INGEN_SVAR,
        fremtidigSituasjon: undefined,
        tilbakeIArbeid: undefined,
    };

    const initialState = side === 'standard' ? initialStandardState : initialSykmeldtState;

    const harAldriJobbet =
        skjemaState.dinSituasjon === DinSituasjon.ALDRI_HATT_JOBB ||
        skjemaState.sisteStilling === SisteStillingValg.HAR_IKKE_HATT_JOBB;

    const hentTekstForSisteStilling = () => {
        return harAldriJobbet ? 'Ingen yrkeserfaring' : skjemaState.sisteJobb?.label || 'Ikke oppgitt';
    };

    let payload = (Object.keys(initialState) as Array<keyof Omit<SkjemaState, 'startTid'>>).reduce(
        (resultat: Payload, key) => {
            const svar = skjemaState[key] || initialStandardState[key];

            resultat.besvarelse[key] = svar;
            if (svar) {
                resultat.teksterForBesvarelse.push({
                    sporsmalId: key,
                    sporsmal: hentTekst('nb', key),
                    svar:
                        key === SporsmalId.sisteStilling
                            ? hentTekstForSisteStilling()
                            : hentTekst('nb', svar.toString()),
                });
            }
            return resultat;
        },
        { besvarelse: {}, teksterForBesvarelse: [] as TeksterForBesvarelse } as Payload
    );

    const sisteStilling = harAldriJobbet ? aldriJobbet : skjemaState.sisteJobb;

    if (side === 'standard' && sisteStilling) {
        payload = {
            ...payload,
            sisteStilling: sisteStilling,
        };
    }
    return payload;
}

export default byggFullforRegistreringPayload;
