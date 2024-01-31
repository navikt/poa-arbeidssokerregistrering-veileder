import {
    JaEllerNei,
    SporsmalId,
    Svar,
    UtdanningGodkjentValg,
    Utdanningsnivaa,
} from '@navikt/arbeidssokerregisteret-utils';
import { hentTekst } from '../model/sporsmal';
import { SkjemaState } from '../model/skjema';
import { MerSykmeldtoppfolgingState } from '../model/mer-sykmeldtoppfolging';

type TeksterForBesvarelse = { sporsmalId: SporsmalId; sporsmal: string; svar: string }[];

type Payload = {
    besvarelse: Record<keyof MerSykmeldtoppfolgingState, Svar | undefined>;
    teksterForBesvarelse: TeksterForBesvarelse;
};

function byggFullforRegistreringForMerSykmeldtoppfolgingPayload(registreringState: MerSykmeldtoppfolgingState) {
    const initialState: MerSykmeldtoppfolgingState = {
        utdanning: Utdanningsnivaa.INGEN_SVAR,
        utdanningGodkjent: UtdanningGodkjentValg.INGEN_SVAR,
        utdanningBestatt: JaEllerNei.INGEN_SVAR,
        andreForhold: JaEllerNei.INGEN_SVAR,
        fremtidigSituasjon: undefined,
        tilbakeIArbeid: undefined,
    };

    let payload = (Object.keys(initialState) as Array<keyof Omit<SkjemaState, 'startTid'>>).reduce(
        (resultat: Payload, key) => {
            const svar = registreringState[key] || initialState[key];

            resultat.besvarelse[key] = svar;
            if (svar) {
                resultat.teksterForBesvarelse.push({
                    sporsmalId: key,
                    sporsmal: hentTekst('nb', key),
                    svar: hentTekst('nb', svar.toString()),
                });
            }
            return resultat;
        },
        { besvarelse: {}, teksterForBesvarelse: [] as TeksterForBesvarelse } as Payload,
    );

    return payload;
}

export default byggFullforRegistreringForMerSykmeldtoppfolgingPayload;
