import {
    DinSituasjon,
    JaEllerNei,
    SisteStillingValg,
    SporsmalId,
    UtdanningGodkjentValg,
} from '@navikt/arbeidssokerregisteret-utils';
import type { Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { describe, expect, it } from 'vitest';
import type { SisteArbeidsforholdResult } from '@/app/lib/api/aareg';
import { mapOpplysningerTilInitState } from './mapSnapshotOpplysningerTilRegistrering';

// ———————————————————————————————————————————————————
// Test data helpers
// ———————————————————————————————————————————————————

type OpplysningerHendelse = NonNullable<Snapshot['opplysning']>;

function lagOpplysning(overrides: {
    beskrivelse?: string;
    stilling?: string;
    stilling_styrk08?: string;
    nus?: string;
    bestaatt?: string;
    godkjent?: string;
    helsetilstandHindrerArbeid?: string;
    andreForholdHindrerArbeid?: string;
}): OpplysningerHendelse {
    const {
        beskrivelse = 'HAR_BLITT_SAGT_OPP',
        stilling,
        stilling_styrk08,
        nus = '3',
        bestaatt = 'JA',
        godkjent = 'JA',
        helsetilstandHindrerArbeid = 'NEI',
        andreForholdHindrerArbeid = 'NEI',
    } = overrides;

    const detaljer: Record<string, string> = {};
    if (stilling !== undefined) detaljer.stilling = stilling;
    if (stilling_styrk08 !== undefined) detaljer.stilling_styrk08 = stilling_styrk08;

    return {
        id: 'test-opplysning-id',
        utdanning: { nus, bestaatt, godkjent },
        helse: { helsetilstandHindrerArbeid },
        jobbsituasjon: {
            beskrivelser: [
                {
                    beskrivelse,
                    detaljer: Object.keys(detaljer).length > 0 ? detaljer : undefined,
                },
            ],
        },
        annet: { andreForholdHindrerArbeid },
        tidspunkt: '2026-02-10T06:17:49.667Z',
        type: 'OPPLYSNINGER_V4',
    } as unknown as OpplysningerHendelse;
}

const aaregMedData: SisteArbeidsforholdResult = {
    sisteArbeidsforhold: {
        konseptId: 12345,
        label: 'KONTORLEDER',
        styrk08: '1231',
    },
};

const aaregUtenData: SisteArbeidsforholdResult = {
    sisteArbeidsforhold: null,
};

// ———————————————————————————————————————————————————
// Tests
// ———————————————————————————————————————————————————

describe('mapOpplysningerTilInitState', () => {
    it('returnerer tomt objekt når opplysning er undefined', () => {
        const result = mapOpplysningerTilInitState(undefined, aaregMedData);
        expect(result).toEqual({});
    });

    describe('sisteJobb — aareg har data', () => {
        it('bruker aareg-verdier og overstyrer snapshot-stilling', () => {
            const opplysning = lagOpplysning({
                beskrivelse: 'HAR_BLITT_SAGT_OPP',
                stilling: 'Kokk',
                stilling_styrk08: '5120',
            });

            const result = mapOpplysningerTilInitState(opplysning, aaregMedData);

            // Snapshot sa «Kokk» men aareg er ferskere — skal bruke aareg
            expect(result[SporsmalId.sisteJobb]).toEqual({
                label: 'KONTORLEDER',
                styrk08: '1231',
                konseptId: 12345,
            });
        });
    });

    describe('sisteJobb — aareg har IKKE data', () => {
        it('faller tilbake til snapshot-stilling når aareg returnerer null', () => {
            const opplysning = lagOpplysning({
                beskrivelse: 'HAR_BLITT_SAGT_OPP',
                stilling: 'Kokk',
                stilling_styrk08: '5120',
            });

            const result = mapOpplysningerTilInitState(opplysning, aaregUtenData);

            expect(result[SporsmalId.sisteJobb]).toEqual({
                label: 'Kokk',
                styrk08: '5120',
                konseptId: -1,
            });
        });

        it('faller tilbake til "Annen stilling" med styrk08 "-1" når verken aareg eller snapshot har stilling', () => {
            const opplysning = lagOpplysning({
                beskrivelse: 'HAR_BLITT_SAGT_OPP',
                // ingen stilling eller stilling_styrk08
            });

            const result = mapOpplysningerTilInitState(opplysning, aaregUtenData);

            expect(result[SporsmalId.sisteJobb]).toEqual({
                label: 'Annen stilling',
                styrk08: '-1',
                konseptId: -1,
            });
        });

        it('faller tilbake til "Annen stilling" når aaregResult er undefined', () => {
            const opplysning = lagOpplysning({
                beskrivelse: 'HAR_BLITT_SAGT_OPP',
            });

            const result = mapOpplysningerTilInitState(opplysning, undefined);

            expect(result[SporsmalId.sisteJobb]).toEqual({
                label: 'Annen stilling',
                styrk08: '-1',
                konseptId: -1,
            });
        });
    });

    describe('sisteStilling — basert på dinSituasjon', () => {
        it.each([
            ['AKKURAT_FULLFORT_UTDANNING', DinSituasjon.AKKURAT_FULLFORT_UTDANNING],
            ['IKKE_VAERT_I_JOBB_SISTE_2_AAR', DinSituasjon.JOBB_OVER_2_AAR],
            ['USIKKER_JOBBSITUASJON', DinSituasjon.USIKKER_JOBBSITUASJON],
        ])('setter HAR_HATT_JOBB når beskrivelse er %s og snapshot har stilling', (beskrivelse) => {
            const opplysning = lagOpplysning({
                beskrivelse,
                stilling: 'Kokk',
                stilling_styrk08: '5120',
            });

            const result = mapOpplysningerTilInitState(opplysning, aaregUtenData);

            expect(result[SporsmalId.sisteStilling]).toBe(SisteStillingValg.HAR_HATT_JOBB);
        });

        it.each([
            ['AKKURAT_FULLFORT_UTDANNING', DinSituasjon.AKKURAT_FULLFORT_UTDANNING],
            ['IKKE_VAERT_I_JOBB_SISTE_2_AAR', DinSituasjon.JOBB_OVER_2_AAR],
            ['USIKKER_JOBBSITUASJON', DinSituasjon.USIKKER_JOBBSITUASJON],
        ])('setter HAR_IKKE_HATT_JOBB når beskrivelse er %s og snapshot mangler stilling', (beskrivelse) => {
            const opplysning = lagOpplysning({
                beskrivelse,
                // ingen stilling
            });

            const result = mapOpplysningerTilInitState(opplysning, aaregUtenData);

            expect(result[SporsmalId.sisteStilling]).toBe(SisteStillingValg.HAR_IKKE_HATT_JOBB);
        });

        it('setter INGEN_SVAR for situasjoner utenfor SITUASJONER_MED_SISTE_STILLING', () => {
            const opplysning = lagOpplysning({
                beskrivelse: 'HAR_BLITT_SAGT_OPP',
                stilling: 'Kokk',
                stilling_styrk08: '5120',
            });

            const result = mapOpplysningerTilInitState(opplysning, aaregUtenData);

            expect(result[SporsmalId.sisteStilling]).toBe(SisteStillingValg.INGEN_SVAR);
        });
    });

    describe('dinSituasjon — mapping fra beskrivelse', () => {
        it.each([
            ['HAR_SAGT_OPP', DinSituasjon.HAR_SAGT_OPP],
            ['HAR_BLITT_SAGT_OPP', DinSituasjon.MISTET_JOBBEN],
            ['ER_PERMITTERT', DinSituasjon.ER_PERMITTERT],
            ['ALDRI_HATT_JOBB', DinSituasjon.ALDRI_HATT_JOBB],
            ['IKKE_VAERT_I_JOBB_SISTE_2_AAR', DinSituasjon.JOBB_OVER_2_AAR],
            ['AKKURAT_FULLFORT_UTDANNING', DinSituasjon.AKKURAT_FULLFORT_UTDANNING],
            ['VIL_BYTTE_JOBB', DinSituasjon.VIL_BYTTE_JOBB],
            ['USIKKER_JOBBSITUASJON', DinSituasjon.USIKKER_JOBBSITUASJON],
            ['DELTIDSJOBB_VIL_MER', DinSituasjon.DELTIDSJOBB_VIL_MER],
        ])('mapper beskrivelse %s til DinSituasjon.%s', (beskrivelse, expected) => {
            const opplysning = lagOpplysning({ beskrivelse });
            const result = mapOpplysningerTilInitState(opplysning, aaregUtenData);
            expect(result[SporsmalId.dinSituasjon]).toBe(expected);
        });

        it('faller tilbake til INGEN_SVAR når jobbsituasjon.beskrivelser er tom', () => {
            const opplysning = lagOpplysning({ beskrivelse: 'HAR_BLITT_SAGT_OPP' });
            // Override to have no beskrivelser
            (opplysning as any).jobbsituasjon.beskrivelser = [];

            const result = mapOpplysningerTilInitState(opplysning, aaregUtenData);
            expect(result[SporsmalId.dinSituasjon]).toBe(DinSituasjon.INGEN_SVAR);
        });
    });

    describe('øvrige felter — utdanning, helse, annet', () => {
        it('mapper utdanning, utdanningGodkjent, utdanningBestatt, helseHinder og andreForhold', () => {
            const opplysning = lagOpplysning({
                beskrivelse: 'HAR_BLITT_SAGT_OPP',
                nus: '3',
                bestaatt: 'JA',
                godkjent: 'NEI',
                helsetilstandHindrerArbeid: 'JA',
                andreForholdHindrerArbeid: 'JA',
            });

            const result = mapOpplysningerTilInitState(opplysning, aaregUtenData);

            expect(result[SporsmalId.utdanningGodkjent]).toBe('NEI');
            expect(result[SporsmalId.utdanningBestatt]).toBe(JaEllerNei.JA);
            expect(result[SporsmalId.helseHinder]).toBe(JaEllerNei.JA);
            expect(result[SporsmalId.andreForhold]).toBe(JaEllerNei.JA);
        });

        it('faller tilbake til INGEN_SVAR for manglende utdanning-felter', () => {
            const opplysning = lagOpplysning({ beskrivelse: 'HAR_BLITT_SAGT_OPP' });
            // Override utdanning to be missing godkjent/bestaatt
            (opplysning as any).utdanning = { nus: '9' };

            const result = mapOpplysningerTilInitState(opplysning, aaregUtenData);

            expect(result[SporsmalId.utdanningGodkjent]).toBe(UtdanningGodkjentValg.INGEN_SVAR);
            expect(result[SporsmalId.utdanningBestatt]).toBe(JaEllerNei.INGEN_SVAR);
        });
    });
});
