import {
    DinSituasjon,
    type JaEllerNei,
    type JobbsituasjonBeskrivelse,
    type JobbsituasjonDetaljer,
    mapUtdanningsnivaaTilNusKode,
    NUS,
    SisteStillingValg,
    SporsmalId,
    type UtdanningGodkjentValg,
} from '@navikt/arbeidssokerregisteret-utils';
import type { RegistreringState } from '@/model/registrering';

type Payload = {
    utdanning: {
        nus: NUS;
        bestaatt?: JaEllerNei;
        godkjent?: UtdanningGodkjentValg;
    };
    helse: {
        helsetilstandHindrerArbeid: JaEllerNei;
    };
    jobbsituasjon: {
        beskrivelser: [{ beskrivelse: JobbsituasjonBeskrivelse; detaljer?: JobbsituasjonDetaljer }];
    };
    annet: {
        andreForholdHindrerArbeid: JaEllerNei;
    };
};

function mapUtdanning(skjema: RegistreringState): Payload['utdanning'] {
    const nus = mapUtdanningsnivaaTilNusKode(skjema[SporsmalId.utdanning]);
    if ([NUS.INGEN_SVAR, NUS.INGEN_UTDANNING, NUS.GRUNNSKOLE].includes(nus)) {
        return {
            nus,
        };
    }

    return {
        nus,
        bestaatt: skjema[SporsmalId.utdanningBestatt],
        godkjent: skjema[SporsmalId.utdanningGodkjent],
    };
}

function mapDinSituasjonTilBeskrivelse(situasjon?: DinSituasjon): JobbsituasjonBeskrivelse {
    switch (situasjon) {
        case DinSituasjon.MISTET_JOBBEN:
            return 'HAR_BLITT_SAGT_OPP';
        case DinSituasjon.JOBB_OVER_2_AAR:
            return 'IKKE_VAERT_I_JOBB_SISTE_2_AAR';
        case DinSituasjon.VIL_FORTSETTE_I_JOBB:
            return 'ANNET';
        case DinSituasjon.INGEN_SVAR:
        case DinSituasjon.INGEN_VERDI:
            return 'UDEFINERT';
        case undefined:
            return 'UDEFINERT';
        default:
            return situasjon;
    }
}

// For å støtte kompatibilitet med veilarbregistrering bytter vi i en periode styrk08 -1 til 00 (uoppgitt)
function mapJobbsituasjon(skjema: RegistreringState): Payload['jobbsituasjon'] {
    const harAldriJobbet =
        skjema.dinSituasjon === DinSituasjon.ALDRI_HATT_JOBB ||
        skjema.sisteStilling === SisteStillingValg.HAR_IKKE_HATT_JOBB;

    return {
        beskrivelser: [
            {
                beskrivelse: mapDinSituasjonTilBeskrivelse(skjema[SporsmalId.dinSituasjon]),
                detaljer: harAldriJobbet
                    ? undefined
                    : {
                          stilling: skjema[SporsmalId.sisteJobb]?.label,
                          stilling_styrk08: skjema[SporsmalId.sisteJobb]?.styrk08.replace('-1', '00'),
                      },
            },
        ],
    };
}
function byggOpplysningerPayload(skjemaState: RegistreringState) {
    return {
        opplysningerOmArbeidssoeker: {
            utdanning: mapUtdanning(skjemaState),
            helse: skjemaState.helseHinder
                ? {
                      helsetilstandHindrerArbeid: skjemaState.helseHinder,
                  }
                : undefined,
            jobbsituasjon: mapJobbsituasjon(skjemaState),
            annet: skjemaState.andreForhold
                ? {
                      andreForholdHindrerArbeid: skjemaState.andreForhold,
                  }
                : undefined,
        },
    };
}

export default byggOpplysningerPayload;
