import {
    DinSituasjon,
    JaEllerNei,
    mapUtdanningsnivaaTilNusKode,
    NUS,
    SisteStillingValg,
    SporsmalId,
    UtdanningGodkjentValg,
    Utdanningsnivaa,
} from '@navikt/arbeidssokerregisteret-utils';
import { describe, expect, it } from 'vitest';
import type { RegistreringState } from '@/model/registrering';
import byggOpplysningerPayload from './bygg-opplysninger-payload';

describe('byggOpplysningerPayload', () => {
    it.each([
        [Utdanningsnivaa.INGEN_SVAR, NUS.INGEN_SVAR],
        [Utdanningsnivaa.INGEN_UTDANNING, NUS.INGEN_UTDANNING],
        [Utdanningsnivaa.GRUNNSKOLE, NUS.GRUNNSKOLE],
    ])('mapper utdanning %s uten bestått- og godkjentverdier', (utdanningsnivaa, nus) => {
        const state = {
            [SporsmalId.utdanning]: utdanningsnivaa,
        } satisfies RegistreringState;

        expect(byggOpplysningerPayload(state)).toStrictEqual({
            opplysningerOmArbeidssoeker: {
                utdanning: { nus },
                helse: undefined,
                jobbsituasjon: {
                    beskrivelser: [
                        {
                            beskrivelse: 'UDEFINERT',
                            detaljer: { stilling: undefined, stilling_styrk08: undefined },
                        },
                    ],
                },
                annet: undefined,
            },
        });
    });

    it('mapper høyere utdanning med bestått- og godkjentverdier', () => {
        const state = {
            [SporsmalId.utdanning]: Utdanningsnivaa.HOYERE_UTDANNING_1_TIL_4,
            [SporsmalId.utdanningBestatt]: JaEllerNei.JA,
            [SporsmalId.utdanningGodkjent]: UtdanningGodkjentValg.NEI,
        } satisfies RegistreringState;

        expect(byggOpplysningerPayload(state)).toStrictEqual({
            opplysningerOmArbeidssoeker: {
                utdanning: {
                    nus: mapUtdanningsnivaaTilNusKode(Utdanningsnivaa.HOYERE_UTDANNING_1_TIL_4),
                    bestaatt: JaEllerNei.JA,
                    godkjent: UtdanningGodkjentValg.NEI,
                },
                helse: undefined,
                jobbsituasjon: {
                    beskrivelser: [
                        {
                            beskrivelse: 'UDEFINERT',
                            detaljer: { stilling: undefined, stilling_styrk08: undefined },
                        },
                    ],
                },
                annet: undefined,
            },
        });
    });

    it('mapper MISTET_JOBBEN og bytter styrk08-suffikset -1 til 00', () => {
        const state = {
            [SporsmalId.dinSituasjon]: DinSituasjon.MISTET_JOBBEN,
            [SporsmalId.sisteJobb]: { konseptId: 12345, label: 'Butikkmedarbeider', styrk08: '5223-1' },
        } satisfies RegistreringState;

        expect(byggOpplysningerPayload(state)).toStrictEqual({
            opplysningerOmArbeidssoeker: {
                utdanning: { nus: NUS.INGEN_SVAR },
                helse: undefined,
                jobbsituasjon: {
                    beskrivelser: [
                        {
                            beskrivelse: 'HAR_BLITT_SAGT_OPP',
                            detaljer: {
                                stilling: 'Butikkmedarbeider',
                                stilling_styrk08: '522300',
                            },
                        },
                    ],
                },
                annet: undefined,
            },
        });
    });

    it('mapper ALDRI_HATT_JOBB uten stillingsdetaljer', () => {
        const state = {
            [SporsmalId.dinSituasjon]: DinSituasjon.ALDRI_HATT_JOBB,
        } satisfies RegistreringState;

        expect(byggOpplysningerPayload(state)).toStrictEqual({
            opplysningerOmArbeidssoeker: {
                utdanning: { nus: NUS.INGEN_SVAR },
                helse: undefined,
                jobbsituasjon: {
                    beskrivelser: [{ beskrivelse: DinSituasjon.ALDRI_HATT_JOBB, detaljer: undefined }],
                },
                annet: undefined,
            },
        });
    });

    it('mapper helse og andre forhold når svarene finnes', () => {
        const state = {
            [SporsmalId.helseHinder]: JaEllerNei.JA,
            [SporsmalId.andreForhold]: JaEllerNei.NEI,
            [SporsmalId.sisteStilling]: SisteStillingValg.HAR_IKKE_HATT_JOBB,
            [SporsmalId.dinSituasjon]: DinSituasjon.JOBB_OVER_2_AAR,
        } satisfies RegistreringState;

        expect(byggOpplysningerPayload(state)).toStrictEqual({
            opplysningerOmArbeidssoeker: {
                utdanning: { nus: NUS.INGEN_SVAR },
                helse: { helsetilstandHindrerArbeid: JaEllerNei.JA },
                jobbsituasjon: {
                    beskrivelser: [
                        {
                            beskrivelse: 'IKKE_VAERT_I_JOBB_SISTE_2_AAR',
                            detaljer: undefined,
                        },
                    ],
                },
                annet: { andreForholdHindrerArbeid: JaEllerNei.NEI },
            },
        });
    });
});
