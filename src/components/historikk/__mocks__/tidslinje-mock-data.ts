import {
    OpplysningerHendelse,
    BekreftelseHendelse,
    PeriodeAvsluttetHendelse,
    Periode,
} from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';

export const opplysningsHendelse: OpplysningerHendelse = {
    id: 'e98014ee-b7e7-4d74-8ff9-d8fa959e6a04',
    sendtInnAv: {
        tidspunkt: '2025-10-27T13:17:14.037Z',
        utfoertAv: {
            type: 'SLUTTBRUKER',
            id: '24849098329',
            sikkerhetsnivaa: 'tokenx:Level4',
        },
        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.10.14.382-1',
        aarsak: 'opplysning om arbeidssøker sendt inn',
    },
    utdanning: {
        nus: '6',
        bestaatt: 'JA',
        godkjent: 'JA',
    },
    helse: {
        helsetilstandHindrerArbeid: 'NEI',
    },
    jobbsituasjon: {
        beskrivelser: [
            {
                beskrivelse: 'HAR_BLITT_SAGT_OPP',
                detaljer: {
                    stilling: 'Chassispåbygger',
                    stilling_styrk08: '8211',
                },
            },
        ],
    },
    annet: {
        andreForholdHindrerArbeid: 'NEI',
    },
    tidspunkt: '2025-10-27T13:17:14.037Z',
    type: 'OPPLYSNINGER_V4',
};

export const bekreftelseHendelse: BekreftelseHendelse = {
    id: '037433f9-0ae4-41c9-83a6-c26c860b0cc4',
    bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
    status: 'GYLDIG',
    svar: {
        sendtInnAv: {
            tidspunkt: '2025-10-24T13:09:58.274Z',
            utfoertAv: {
                type: 'SLUTTBRUKER',
                id: '24849098329',
                sikkerhetsnivaa: 'tokenx:Level4',
            },
            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:25.10.14.387-1',
            aarsak: 'Bekreftelse levert',
        },
        gjelderFra: '2025-10-19T22:00:00Z',
        gjelderTil: '2025-10-26T23:00:00Z',
        harJobbetIDennePerioden: false,
        vilFortsetteSomArbeidssoeker: false,
    },
    tidspunkt: '2025-10-24T13:09:58.274Z',
    type: 'BEKREFTELSE_V1',
};

export const avsluttetPeriode: PeriodeAvsluttetHendelse = {
    sendtInnAv: {
        tidspunkt: '2025-09-23T07:32:45.810Z',
        utfoertAv: {
            type: 'VEILEDER',
            id: 'Z994498',
            sikkerhetsnivaa: 'azure:undefined',
        },
        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.09.22.376-1',
        aarsak: 'Stopp av periode',
    },
    tidspunkt: '2025-09-23T07:32:45.810Z',
    type: 'PERIODE_AVSLUTTET_V1',
};

export const samplePeriode: Periode = {
    periodeId: 'd4428822-103c-423a-aa7c-4dd016b0cb47',
    identitetsnummer: '24849098329',
    startet: '2026-01-13T11:31:07.953Z',
    hendelser: [
        {
            periodeId: 'd4428822-103c-423a-aa7c-4dd016b0cb47',
            bekreftelsesloesning: 'DAGPENGER',
            fristBrutt: false,
            tidspunkt: '2026-01-13T12:35:03.331Z',
            type: 'PAA_VEGNE_AV_STOPP_V1',
        },
        {
            id: 'd684452d-78ec-426a-ae6a-7d505dbe3a4e',
            opplysningerOmArbeidssokerId: 'be4ccbb7-c76f-405f-92c5-9f02ed671b73',
            sendtInnAv: {
                tidspunkt: '2026-01-13T11:31:08.531Z',
                utfoertAv: {
                    type: 'SYSTEM',
                    id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.12.11.257-1',
                },
                kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.12.11.257-1',
                aarsak: 'opplysninger-mottatt',
                tidspunktFraKilde: {
                    tidspunkt: '2026-01-13T11:31:07.867Z',
                    avviksType: 'FORSINKELSE',
                },
            },
            profilertTil: 'OPPGITT_HINDRINGER',
            jobbetSammenhengendeSeksAvTolvSisteMnd: true,
            alder: 35,
            tidspunkt: '2026-01-13T11:31:08.531Z',
            type: 'PROFILERING_V1',
        },
        {
            sendtInnAv: {
                tidspunkt: '2026-01-13T11:31:07.953Z',
                utfoertAv: {
                    type: 'VEILEDER',
                    id: 'Z994498',
                    sikkerhetsnivaa: 'azure:undefined',
                },
                kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:26.01.07.405-1',
                aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
            },
            tidspunkt: '2026-01-13T11:31:07.953Z',
            type: 'PERIODE_STARTET_V1',
        },
        {
            id: 'be4ccbb7-c76f-405f-92c5-9f02ed671b73',
            sendtInnAv: {
                tidspunkt: '2026-01-13T11:31:07.867Z',
                utfoertAv: {
                    type: 'VEILEDER',
                    id: 'Z994498',
                    sikkerhetsnivaa: 'azure:undefined',
                },
                kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:26.01.07.405-1',
                aarsak: 'opplysning om arbeidssøker sendt inn',
            },
            utdanning: {
                nus: '3',
                bestaatt: 'JA',
                godkjent: 'JA',
            },
            helse: {
                helsetilstandHindrerArbeid: 'JA',
            },
            jobbsituasjon: {
                beskrivelser: [
                    {
                        beskrivelse: 'VIL_BYTTE_JOBB',
                        detaljer: {
                            stilling: 'Chassispåbygger',
                            stilling_styrk08: '8211',
                        },
                    },
                ],
            },
            annet: {
                andreForholdHindrerArbeid: 'NEI',
            },
            tidspunkt: '2026-01-13T11:31:07.867Z',
            type: 'OPPLYSNINGER_V4',
        },
    ],
};
