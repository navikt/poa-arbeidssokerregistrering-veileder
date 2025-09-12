import type { NextApiRequest, NextApiResponse } from 'next';

const tidslinjer = (req: NextApiRequest, res: NextApiResponse): void => {
    res.json(data);
};

const data = {
    tidslinjer: [
        {
            periodeId: '66979b2b-99c3-4601-8473-352923d1afcb',
            identitetsnummer: '24849098329',
            startet: '2025-08-13T08:17:23.648Z',
            hendelser: [
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-08-13T08:17:23.640Z',
                    opplysningerV4: {
                        id: 'abfdc173-8c83-4b50-97e3-ac0e8583f616',
                        periodeId: '66979b2b-99c3-4601-8473-352923d1afcb',
                        sendtInnAv: {
                            tidspunkt: '2025-08-13T08:17:23.640Z',
                            utfoertAv: {
                                type: 'VEILEDER',
                                id: 'Z994498',
                                sikkerhetsnivaa: 'azure:undefined',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.08.11.361-1',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                        },
                        utdanning: {
                            nus: '3',
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
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-08-13T08:17:23.648Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-08-13T08:17:23.648Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                            sikkerhetsnivaa: 'azure:undefined',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.08.11.361-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-08-13T08:17:25.324Z',
                    profileringV1: {
                        id: '8b27bcf7-43fe-45c9-b0f4-28a49126a185',
                        periodeId: '66979b2b-99c3-4601-8473-352923d1afcb',
                        opplysningerOmArbeidssokerId: 'abfdc173-8c83-4b50-97e3-ac0e8583f616',
                        sendtInnAv: {
                            tidspunkt: '2025-08-13T08:17:25.324Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.08.12.166-1',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.08.12.166-1',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-08-13T08:17:23.640Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 35,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-08-13T08:19:25.991Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-08-13T08:19:25.991Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                            sikkerhetsnivaa: 'azure:undefined',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.08.11.361-1',
                        aarsak: 'Feilregistrering',
                        tidspunktFraKilde: {
                            tidspunkt: '2025-08-13T08:19:25.991Z',
                            avviksType: 'SLETTET',
                        },
                    },
                },
            ],
            avsluttet: '2025-08-13T08:19:25.991Z',
        },
        {
            periodeId: '60bea570-6acb-4fc8-b508-1aa6ed99fe46',
            identitetsnummer: '24849098329',
            startet: '2025-08-22T10:19:52.028Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-08-22T10:19:52.028Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-08-22T10:19:52.028Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '24849098329',
                            sikkerhetsnivaa: 'tokenx:Level4',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.08.18.363-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                        tidspunktFraKilde: null,
                    },
                    periodeAvsluttetV1: null,
                    opplysningerV4: null,
                    profileringV1: null,
                    bekreftelseV1: null,
                    paVegneAvStartV1: null,
                    paVegneAvStoppV1: null,
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-08-22T10:19:52.628Z',
                    periodeStartetV1: null,
                    periodeAvsluttetV1: null,
                    opplysningerV4: {
                        id: '382827ce-c36f-4418-afcc-07dbdaace66c',
                        periodeId: '60bea570-6acb-4fc8-b508-1aa6ed99fe46',
                        sendtInnAv: {
                            tidspunkt: '2025-08-22T10:19:52.628Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '24849098329',
                                sikkerhetsnivaa: 'tokenx:Level4',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.08.18.363-1',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                            tidspunktFraKilde: null,
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
                                        stilling: 'Sushikokk',
                                        stilling_styrk08: '5120',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                    profileringV1: null,
                    bekreftelseV1: null,
                    paVegneAvStartV1: null,
                    paVegneAvStoppV1: null,
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-08-22T10:19:54.538Z',
                    periodeStartetV1: null,
                    periodeAvsluttetV1: null,
                    opplysningerV4: null,
                    profileringV1: {
                        id: '1f2de59a-d02f-4f4d-8900-41fdeefcedbf',
                        periodeId: '60bea570-6acb-4fc8-b508-1aa6ed99fe46',
                        opplysningerOmArbeidssokerId: '382827ce-c36f-4418-afcc-07dbdaace66c',
                        sendtInnAv: {
                            tidspunkt: '2025-08-22T10:19:54.538Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.08.19.168-1',
                                sikkerhetsnivaa: null,
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.08.19.168-1',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-08-22T10:19:52.628Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 35,
                    },
                    bekreftelseV1: null,
                    paVegneAvStartV1: null,
                    paVegneAvStoppV1: null,
                },
                {
                    hendelseType: 'pa_vegne_av_stopp_v1',
                    tidspunkt: '2025-08-22T10:46:35.880Z',
                    periodeStartetV1: null,
                    periodeAvsluttetV1: null,
                    opplysningerV4: null,
                    profileringV1: null,
                    bekreftelseV1: null,
                    paVegneAvStartV1: null,
                    paVegneAvStoppV1: {
                        periodeId: '60bea570-6acb-4fc8-b508-1aa6ed99fe46',
                        bekreftelsesloesning: 'DAGPENGER',
                        fristBrutt: false,
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-08-27T05:12:40.050Z',
                    periodeStartetV1: null,
                    periodeAvsluttetV1: null,
                    opplysningerV4: {
                        id: 'c73e6d6c-d9ba-4af8-954b-410735b07cb1',
                        periodeId: '60bea570-6acb-4fc8-b508-1aa6ed99fe46',
                        sendtInnAv: {
                            tidspunkt: '2025-08-27T05:12:40.050Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '24849098329',
                                sikkerhetsnivaa: 'tokenx:Level4',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.08.18.363-1',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                            tidspunktFraKilde: null,
                        },
                        utdanning: {
                            nus: '4',
                            bestaatt: 'JA',
                            godkjent: 'JA',
                        },
                        helse: {
                            helsetilstandHindrerArbeid: 'NEI',
                        },
                        jobbsituasjon: {
                            beskrivelser: [
                                {
                                    beskrivelse: 'HAR_SAGT_OPP',
                                    detaljer: {
                                        stilling: 'Sushikokk',
                                        stilling_styrk08: '5120',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                    profileringV1: null,
                    bekreftelseV1: null,
                    paVegneAvStartV1: null,
                    paVegneAvStoppV1: null,
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-08-27T05:12:40.599Z',
                    periodeStartetV1: null,
                    periodeAvsluttetV1: null,
                    opplysningerV4: null,
                    profileringV1: {
                        id: '44c8a9ed-f1fe-47ce-808e-d3d109dc997f',
                        periodeId: '60bea570-6acb-4fc8-b508-1aa6ed99fe46',
                        opplysningerOmArbeidssokerId: 'c73e6d6c-d9ba-4af8-954b-410735b07cb1',
                        sendtInnAv: {
                            tidspunkt: '2025-08-27T05:12:40.599Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.08.26.170-1',
                                sikkerhetsnivaa: null,
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.08.26.170-1',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-08-27T05:12:40.050Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 35,
                    },
                    bekreftelseV1: null,
                    paVegneAvStartV1: null,
                    paVegneAvStoppV1: null,
                },
                {
                    hendelseType: 'bekreftelse_v1',
                    tidspunkt: '2025-09-01T05:24:59.291Z',
                    periodeStartetV1: null,
                    periodeAvsluttetV1: null,
                    opplysningerV4: null,
                    profileringV1: null,
                    bekreftelseV1: {
                        status: 'GYLDIG',
                        bekreftelse: {
                            periodeId: '60bea570-6acb-4fc8-b508-1aa6ed99fe46',
                            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                            id: '49abfb7a-6b7d-488e-bf19-545fae98d86e',
                            svar: {
                                sendtInnAv: {
                                    tidspunkt: '2025-09-01T05:24:59.291Z',
                                    utfoertAv: {
                                        type: 'SLUTTBRUKER',
                                        id: '24849098329',
                                        sikkerhetsnivaa: 'tokenx:Level4',
                                    },
                                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:25.08.18.368-1',
                                    aarsak: 'Bekreftelse levert',
                                    tidspunktFraKilde: null,
                                },
                                gjelderFra: '2025-08-22T10:19:52.028Z',
                                gjelderTil: '2025-08-31T22:00:00Z',
                                harJobbetIDennePerioden: false,
                                vilFortsetteSomArbeidssoeker: true,
                            },
                        },
                    },
                    paVegneAvStartV1: null,
                    paVegneAvStoppV1: null,
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-09-05T07:08:03.072Z',
                    periodeStartetV1: null,
                    periodeAvsluttetV1: null,
                    opplysningerV4: {
                        id: '029fce12-6e6a-498d-b058-a868e6c5f798',
                        periodeId: '60bea570-6acb-4fc8-b508-1aa6ed99fe46',
                        sendtInnAv: {
                            tidspunkt: '2025-09-05T07:08:03.072Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '24849098329',
                                sikkerhetsnivaa: 'tokenx:Level4',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.09.04.367-1',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                            tidspunktFraKilde: null,
                        },
                        utdanning: {
                            nus: '7',
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
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                    profileringV1: null,
                    bekreftelseV1: null,
                    paVegneAvStartV1: null,
                    paVegneAvStoppV1: null,
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-09-05T07:08:04.607Z',
                    periodeStartetV1: null,
                    periodeAvsluttetV1: null,
                    opplysningerV4: null,
                    profileringV1: {
                        id: 'fcd9405f-c041-4b96-b794-88b557c1c6ec',
                        periodeId: '60bea570-6acb-4fc8-b508-1aa6ed99fe46',
                        opplysningerOmArbeidssokerId: '029fce12-6e6a-498d-b058-a868e6c5f798',
                        sendtInnAv: {
                            tidspunkt: '2025-09-05T07:08:04.607Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.09.05.185-1',
                                sikkerhetsnivaa: null,
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.09.05.185-1',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-09-05T07:08:03.072Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 35,
                    },
                    bekreftelseV1: null,
                    paVegneAvStartV1: null,
                    paVegneAvStoppV1: null,
                },
            ],
            avsluttet: null,
        },
        {
            periodeId: '87daf215-5d85-485b-88e8-1e928f93e8d6',
            identitetsnummer: '24849098329',
            startet: '2025-05-22T06:30:24.628Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-05-22T06:30:24.628Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-05-22T06:30:24.628Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '24849098329',
                            sikkerhetsnivaa: 'tokenx:Level4',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.05.20.332-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-05-22T06:30:25.813Z',
                    opplysningerV4: {
                        id: '59edc5b4-e662-417d-86f8-cc78afe8ef94',
                        periodeId: '87daf215-5d85-485b-88e8-1e928f93e8d6',
                        sendtInnAv: {
                            tidspunkt: '2025-05-22T06:30:25.813Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '24849098329',
                                sikkerhetsnivaa: 'tokenx:Level4',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.05.20.332-1',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                        },
                        utdanning: {
                            nus: '4',
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
                                        stilling: 'Gallerileder ved kunstgalleri',
                                        stilling_styrk08: '2621',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-05-22T06:30:26.325Z',
                    profileringV1: {
                        id: '0701edce-b8de-4667-8751-f5b8e33397bf',
                        periodeId: '87daf215-5d85-485b-88e8-1e928f93e8d6',
                        opplysningerOmArbeidssokerId: '59edc5b4-e662-417d-86f8-cc78afe8ef94',
                        sendtInnAv: {
                            tidspunkt: '2025-05-22T06:30:26.325Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.05.06.121-1',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.05.06.121-1',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-05-22T06:30:25.813Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 35,
                    },
                },
                {
                    hendelseType: 'pa_vegne_av_stopp_v1',
                    tidspunkt: '2025-06-08T17:29:10.258Z',
                    paVegneAvStoppV1: {
                        periodeId: '87daf215-5d85-485b-88e8-1e928f93e8d6',
                        bekreftelsesloesning: 'DAGPENGER',
                        fristBrutt: false,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-06-09T22:01:19.085Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-06-09T22:01:19.085Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:25.06.04.244-1',
                        },
                        kilde: 'paw-arbeidssoekerregisteret-bekreftelse-tjeneste',
                        aarsak: '[Bekreftelse] ikke levert innen fristen',
                    },
                },
            ],
            avsluttet: '2025-06-09T22:01:19.085Z',
        },
        {
            periodeId: '1a12a5d1-bc96-49aa-ba3c-c5251edadc1d',
            identitetsnummer: '24849098329',
            startet: '2025-04-29T05:17:54.573Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-04-29T05:17:54.573Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-04-29T05:17:54.573Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '24849098329',
                            sikkerhetsnivaa: 'tokenx:Level4',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.04.29.318-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-04-29T05:17:54.976Z',
                    opplysningerV4: {
                        id: 'bb0b7ac3-dd2e-42a2-942a-8d2dd5efd821',
                        periodeId: '1a12a5d1-bc96-49aa-ba3c-c5251edadc1d',
                        sendtInnAv: {
                            tidspunkt: '2025-04-29T05:17:54.976Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '24849098329',
                                sikkerhetsnivaa: 'tokenx:Level4',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.04.29.318-1',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                        },
                        utdanning: {
                            nus: '4',
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
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-04-29T05:17:57.838Z',
                    profileringV1: {
                        id: '0e691a46-39cd-4732-9407-19317927f99d',
                        periodeId: '1a12a5d1-bc96-49aa-ba3c-c5251edadc1d',
                        opplysningerOmArbeidssokerId: 'bb0b7ac3-dd2e-42a2-942a-8d2dd5efd821',
                        sendtInnAv: {
                            tidspunkt: '2025-04-29T05:17:57.838Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.04.29.117-1',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.04.29.117-1',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-04-29T05:17:54.976Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 35,
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-05-16T10:13:20.217Z',
                    opplysningerV4: {
                        id: 'f53bb3b0-dad9-42d5-914c-b2c69f34cbfd',
                        periodeId: '1a12a5d1-bc96-49aa-ba3c-c5251edadc1d',
                        sendtInnAv: {
                            tidspunkt: '2025-05-16T10:13:20.217Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '24849098329',
                                sikkerhetsnivaa: 'tokenx:Level4',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.05.15.330-1',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                        },
                        utdanning: {
                            nus: '4',
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
                                        stilling: 'Logistiker',
                                        stilling_styrk08: '4322',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-05-16T10:13:20.827Z',
                    profileringV1: {
                        id: 'da455ba1-2bb5-456f-9e0d-a90e3ccdf80c',
                        periodeId: '1a12a5d1-bc96-49aa-ba3c-c5251edadc1d',
                        opplysningerOmArbeidssokerId: 'f53bb3b0-dad9-42d5-914c-b2c69f34cbfd',
                        sendtInnAv: {
                            tidspunkt: '2025-05-16T10:13:20.827Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.05.06.121-1',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.05.06.121-1',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-05-16T10:13:20.217Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 35,
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-05-16T10:24:12.491Z',
                    opplysningerV4: {
                        id: '0dfbdd4c-87ac-4859-a202-f2c1484e4a5a',
                        periodeId: '1a12a5d1-bc96-49aa-ba3c-c5251edadc1d',
                        sendtInnAv: {
                            tidspunkt: '2025-05-16T10:24:12.491Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '24849098329',
                                sikkerhetsnivaa: 'tokenx:Level4',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.05.15.330-1',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                        },
                        utdanning: {
                            nus: '4',
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
                                        stilling: 'Agile Coordinator',
                                        stilling_styrk08: '2519',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-05-16T10:24:12.794Z',
                    profileringV1: {
                        id: '0cab6576-6970-482c-9a43-af2ec1546533',
                        periodeId: '1a12a5d1-bc96-49aa-ba3c-c5251edadc1d',
                        opplysningerOmArbeidssokerId: '0dfbdd4c-87ac-4859-a202-f2c1484e4a5a',
                        sendtInnAv: {
                            tidspunkt: '2025-05-16T10:24:12.794Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.05.06.121-1',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.05.06.121-1',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-05-16T10:24:12.491Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 35,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-05-19T22:00:57.959Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-05-19T22:00:57.959Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:25.05.19.227-1',
                        },
                        kilde: 'paw-arbeidssoekerregisteret-bekreftelse-tjeneste',
                        aarsak: '[Bekreftelse] ikke levert innen fristen',
                    },
                },
            ],
            avsluttet: '2025-05-19T22:00:57.959Z',
        },
        {
            periodeId: 'ca76585c-7cd1-48f4-a2c5-f691fe65d897',
            identitetsnummer: '24849098329',
            startet: '2025-04-01T08:21:39.250Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-04-01T08:21:39.250Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-04-01T08:21:39.250Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '24849098329',
                            sikkerhetsnivaa: 'tokenx:Level4',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.31.299-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-04-01T08:21:39.357Z',
                    opplysningerV4: {
                        id: '27e094b1-4c5c-437a-8848-33f9cf4b4a54',
                        periodeId: 'ca76585c-7cd1-48f4-a2c5-f691fe65d897',
                        sendtInnAv: {
                            tidspunkt: '2025-04-01T08:21:39.357Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '24849098329',
                                sikkerhetsnivaa: 'tokenx:Level4',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.31.299-1',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                        },
                        utdanning: {
                            nus: '4',
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
                                        stilling: 'Sushikokk',
                                        stilling_styrk08: '5120',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-04-01T08:21:39.778Z',
                    profileringV1: {
                        id: 'ec30246a-2639-44da-89bb-8dfad55e25ff',
                        periodeId: 'ca76585c-7cd1-48f4-a2c5-f691fe65d897',
                        opplysningerOmArbeidssokerId: '27e094b1-4c5c-437a-8848-33f9cf4b4a54',
                        sendtInnAv: {
                            tidspunkt: '2025-04-01T08:21:39.778Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-04-01T08:21:39.357Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'bekreftelse_v1',
                    tidspunkt: '2025-04-01T08:26:22.283Z',
                    bekreftelseV1: {
                        status: 'GYLDIG',
                        bekreftelse: {
                            periodeId: 'ca76585c-7cd1-48f4-a2c5-f691fe65d897',
                            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                            id: '38272c6f-d81c-4b38-8bec-c579e725a890',
                            svar: {
                                sendtInnAv: {
                                    tidspunkt: '2025-04-01T08:26:22.283Z',
                                    utfoertAv: {
                                        type: 'SLUTTBRUKER',
                                        id: '24849098329',
                                        sikkerhetsnivaa: 'tokenx:Level4',
                                    },
                                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:25.03.31.306-1',
                                    aarsak: 'Bekreftelse levert',
                                },
                                gjelderFra: '2025-04-01T08:21:39.250Z',
                                gjelderTil: '2025-04-01T08:26:39.250Z',
                                harJobbetIDennePerioden: true,
                                vilFortsetteSomArbeidssoeker: true,
                            },
                        },
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-04-02T08:32:30.800Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-04-02T08:32:30.800Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:25.04.01.197-1',
                        },
                        kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
                        aarsak: '[Bekreftelse] ikke levert innen fristen',
                    },
                },
            ],
            avsluttet: '2025-04-02T08:32:30.800Z',
        },
        {
            periodeId: '4280c9bd-bc8a-478e-b762-c0f022db0889',
            identitetsnummer: '24849098329',
            startet: '2025-04-01T05:56:24.644Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-04-01T05:56:24.644Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-04-01T05:56:24.644Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '24849098329',
                            sikkerhetsnivaa: 'tokenx:Level4',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.31.299-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-04-01T05:56:24.862Z',
                    opplysningerV4: {
                        id: 'e50a47b1-7c84-4ffd-8c1d-9948ac234146',
                        periodeId: '4280c9bd-bc8a-478e-b762-c0f022db0889',
                        sendtInnAv: {
                            tidspunkt: '2025-04-01T05:56:24.862Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '24849098329',
                                sikkerhetsnivaa: 'tokenx:Level4',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.31.299-1',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                        },
                        utdanning: {
                            nus: '4',
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
                                        stilling: 'Sushikokk',
                                        stilling_styrk08: '5120',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-04-01T05:56:25.314Z',
                    profileringV1: {
                        id: '23f0d58d-5e3f-4606-b28f-3c80e8e9cff5',
                        periodeId: '4280c9bd-bc8a-478e-b762-c0f022db0889',
                        opplysningerOmArbeidssokerId: 'e50a47b1-7c84-4ffd-8c1d-9948ac234146',
                        sendtInnAv: {
                            tidspunkt: '2025-04-01T05:56:25.314Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-04-01T05:56:24.862Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'bekreftelse_v1',
                    tidspunkt: '2025-04-01T06:38:09.162Z',
                    bekreftelseV1: {
                        status: 'GYLDIG',
                        bekreftelse: {
                            periodeId: '4280c9bd-bc8a-478e-b762-c0f022db0889',
                            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                            id: 'd247c819-8029-467f-9f60-8970f2062384',
                            svar: {
                                sendtInnAv: {
                                    tidspunkt: '2025-04-01T06:38:09.162Z',
                                    utfoertAv: {
                                        type: 'SLUTTBRUKER',
                                        id: '24849098329',
                                        sikkerhetsnivaa: 'tokenx:Level4',
                                    },
                                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:25.03.31.306-1',
                                    aarsak: 'Bekreftelse levert',
                                },
                                gjelderFra: '2025-04-01T05:56:24.644Z',
                                gjelderTil: '2025-04-01T06:01:24.644Z',
                                harJobbetIDennePerioden: false,
                                vilFortsetteSomArbeidssoeker: false,
                            },
                        },
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-04-01T06:38:09.475Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-04-01T06:38:09.475Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '24849098329',
                            sikkerhetsnivaa: 'tokenx:Level4',
                        },
                        kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
                        aarsak: '[Bekreftelse] Ønsket ikke lenger å være arbeidssøker',
                    },
                },
            ],
            avsluttet: '2025-04-01T06:38:09.475Z',
        },
        {
            periodeId: '5dd88c30-4141-4221-b57c-c376b5a629fa',
            identitetsnummer: '24849098329',
            startet: '2025-03-17T13:26:51.847Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-03-17T13:26:51.847Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-03-17T13:26:51.847Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                            sikkerhetsnivaa: 'azure:undefined',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.12.285-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-03-17T13:26:52.279Z',
                    opplysningerV4: {
                        id: '67546aaf-f152-4293-980e-2df9bdc67808',
                        periodeId: '5dd88c30-4141-4221-b57c-c376b5a629fa',
                        sendtInnAv: {
                            tidspunkt: '2025-03-17T13:26:52.279Z',
                            utfoertAv: {
                                type: 'VEILEDER',
                                id: 'Z994498',
                                sikkerhetsnivaa: 'azure:undefined',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.12.285-1',
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
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-03-17T13:26:53.433Z',
                    profileringV1: {
                        id: '961c54f0-c9ce-4aed-951f-94e1c894a031',
                        periodeId: '5dd88c30-4141-4221-b57c-c376b5a629fa',
                        opplysningerOmArbeidssokerId: '67546aaf-f152-4293-980e-2df9bdc67808',
                        sendtInnAv: {
                            tidspunkt: '2025-03-17T13:26:53.433Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-03-17T13:26:52.279Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-03-18T13:16:48.485Z',
                    opplysningerV4: {
                        id: '1060b081-7edd-45dc-82f2-ff5b2f2efa97',
                        periodeId: '5dd88c30-4141-4221-b57c-c376b5a629fa',
                        sendtInnAv: {
                            tidspunkt: '2025-03-18T13:16:48.485Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '24849098329',
                                sikkerhetsnivaa: 'tokenx:Level4',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.18.287-1',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                        },
                        utdanning: {
                            nus: '6',
                            bestaatt: 'JA',
                            godkjent: 'VET_IKKE',
                        },
                        helse: {
                            helsetilstandHindrerArbeid: 'NEI',
                        },
                        jobbsituasjon: {
                            beskrivelser: [
                                {
                                    beskrivelse: 'HAR_BLITT_SAGT_OPP',
                                    detaljer: {
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-03-18T13:16:48.927Z',
                    profileringV1: {
                        id: '5097eed6-b65e-46e3-8495-aaa36a26e577',
                        periodeId: '5dd88c30-4141-4221-b57c-c376b5a629fa',
                        opplysningerOmArbeidssokerId: '1060b081-7edd-45dc-82f2-ff5b2f2efa97',
                        sendtInnAv: {
                            tidspunkt: '2025-03-18T13:16:48.927Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-03-18T13:16:48.485Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-03-18T13:19:33.650Z',
                    opplysningerV4: {
                        id: '455716a9-3471-40a5-8e2c-b6b48de9d1b6',
                        periodeId: '5dd88c30-4141-4221-b57c-c376b5a629fa',
                        sendtInnAv: {
                            tidspunkt: '2025-03-18T13:19:33.650Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '24849098329',
                                sikkerhetsnivaa: 'tokenx:Level4',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.18.287-1',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                        },
                        utdanning: {
                            nus: '6',
                            bestaatt: 'JA',
                            godkjent: 'VET_IKKE',
                        },
                        helse: {
                            helsetilstandHindrerArbeid: 'NEI',
                        },
                        jobbsituasjon: {
                            beskrivelser: [
                                {
                                    beskrivelse: 'HAR_BLITT_SAGT_OPP',
                                    detaljer: {
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-03-18T13:19:33.863Z',
                    profileringV1: {
                        id: '0a4745d1-1446-42b0-a002-519e5f76454a',
                        periodeId: '5dd88c30-4141-4221-b57c-c376b5a629fa',
                        opplysningerOmArbeidssokerId: '455716a9-3471-40a5-8e2c-b6b48de9d1b6',
                        sendtInnAv: {
                            tidspunkt: '2025-03-18T13:19:33.863Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-03-18T13:19:33.650Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-03-18T13:32:56.440Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-03-18T13:32:56.440Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:25.03.18.180-1',
                        },
                        kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
                        aarsak: '[Bekreftelse] ikke levert innen fristen',
                    },
                },
            ],
            avsluttet: '2025-03-18T13:32:56.440Z',
        },
        {
            periodeId: 'b8dba9a7-1bcc-430a-8210-114ab078f596',
            identitetsnummer: '24849098329',
            startet: '2025-03-13T08:48:30.972Z',
            hendelser: [
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-03-13T08:48:30.873Z',
                    opplysningerV4: {
                        id: 'ac179999-e69f-4d92-bf7f-2832d0c18e97',
                        periodeId: 'b8dba9a7-1bcc-430a-8210-114ab078f596',
                        sendtInnAv: {
                            tidspunkt: '2025-03-13T08:48:30.873Z',
                            utfoertAv: {
                                type: 'VEILEDER',
                                id: 'Z994498',
                                sikkerhetsnivaa: 'azure:undefined',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.12.285-1',
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
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-03-13T08:48:30.972Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-03-13T08:48:30.972Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                            sikkerhetsnivaa: 'azure:undefined',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.12.285-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-03-13T08:48:33.272Z',
                    profileringV1: {
                        id: '046d1a44-ea24-4de6-b695-1a305cb77171',
                        periodeId: 'b8dba9a7-1bcc-430a-8210-114ab078f596',
                        opplysningerOmArbeidssokerId: 'ac179999-e69f-4d92-bf7f-2832d0c18e97',
                        sendtInnAv: {
                            tidspunkt: '2025-03-13T08:48:33.272Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-03-13T08:48:30.873Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-03-14T08:55:33.246Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-03-14T08:55:33.246Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:25.03.12.178-1',
                        },
                        kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
                        aarsak: '[Bekreftelse] ikke levert innen fristen',
                    },
                },
            ],
            avsluttet: '2025-03-14T08:55:33.246Z',
        },
        {
            periodeId: 'ffede47f-41b9-4b44-a683-78d7b0373881',
            identitetsnummer: '24849098329',
            startet: '2025-03-11T11:43:46.437Z',
            hendelser: [
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-03-11T11:43:46.235Z',
                    opplysningerV4: {
                        id: 'c8c62fc8-8e04-4243-b986-f68781f499b6',
                        periodeId: 'ffede47f-41b9-4b44-a683-78d7b0373881',
                        sendtInnAv: {
                            tidspunkt: '2025-03-11T11:43:46.235Z',
                            utfoertAv: {
                                type: 'VEILEDER',
                                id: 'Z994498',
                                sikkerhetsnivaa: 'azure:undefined',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
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
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-03-11T11:43:46.437Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-03-11T11:43:46.437Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                            sikkerhetsnivaa: 'azure:undefined',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-03-11T11:44:05.068Z',
                    opplysningerV4: {
                        id: '120f88c2-6df0-4e00-81f3-2deb1dc23ed1',
                        periodeId: 'ffede47f-41b9-4b44-a683-78d7b0373881',
                        sendtInnAv: {
                            tidspunkt: '2025-03-11T11:44:05.068Z',
                            utfoertAv: {
                                type: 'VEILEDER',
                                id: 'Z994498',
                                sikkerhetsnivaa: 'azure:undefined',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
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
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-03-11T11:44:13.464Z',
                    profileringV1: {
                        id: 'af296238-efdb-4dd0-bff4-99f5d3b57fec',
                        periodeId: 'ffede47f-41b9-4b44-a683-78d7b0373881',
                        opplysningerOmArbeidssokerId: 'c8c62fc8-8e04-4243-b986-f68781f499b6',
                        sendtInnAv: {
                            tidspunkt: '2025-03-11T11:44:13.464Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-03-11T11:43:46.235Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-03-11T11:44:13.680Z',
                    profileringV1: {
                        id: '23b1c44c-204e-477e-ac77-828d6956d300',
                        periodeId: 'ffede47f-41b9-4b44-a683-78d7b0373881',
                        opplysningerOmArbeidssokerId: '120f88c2-6df0-4e00-81f3-2deb1dc23ed1',
                        sendtInnAv: {
                            tidspunkt: '2025-03-11T11:44:13.680Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-03-11T11:44:05.068Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-03-12T11:56:06.511Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-03-12T11:56:06.511Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:25.03.12.177-1',
                        },
                        kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
                        aarsak: '[Bekreftelse] ikke levert innen fristen',
                    },
                },
            ],
            avsluttet: '2025-03-12T11:56:06.511Z',
        },
        {
            periodeId: 'a56acc61-5ce4-453f-8dbc-45cbaea929b4',
            identitetsnummer: '24849098329',
            startet: '2025-03-11T11:01:38.274Z',
            hendelser: [
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-03-11T11:01:38.164Z',
                    opplysningerV4: {
                        id: 'a185170d-439c-43db-a254-9014f3d00d6d',
                        periodeId: 'a56acc61-5ce4-453f-8dbc-45cbaea929b4',
                        sendtInnAv: {
                            tidspunkt: '2025-03-11T11:01:38.164Z',
                            utfoertAv: {
                                type: 'VEILEDER',
                                id: 'Z994498',
                                sikkerhetsnivaa: 'azure:undefined',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
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
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-03-11T11:01:38.274Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-03-11T11:01:38.274Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                            sikkerhetsnivaa: 'azure:undefined',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-03-11T11:01:38.564Z',
                    profileringV1: {
                        id: '10f34a9b-ca21-4d3d-bc90-08e1a245e43b',
                        periodeId: 'a56acc61-5ce4-453f-8dbc-45cbaea929b4',
                        opplysningerOmArbeidssokerId: 'a185170d-439c-43db-a254-9014f3d00d6d',
                        sendtInnAv: {
                            tidspunkt: '2025-03-11T11:01:38.564Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-03-11T11:01:38.164Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-03-11T11:02:08.957Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-03-11T11:02:08.957Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                            sikkerhetsnivaa: 'azure:undefined',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
                        aarsak: 'Feilregistrering',
                        tidspunktFraKilde: {
                            tidspunkt: '2025-03-11T11:02:08.956Z',
                            avviksType: 'SLETTET',
                        },
                    },
                },
            ],
            avsluttet: '2025-03-11T11:02:08.957Z',
        },
        {
            periodeId: 'fe26980f-74a7-4523-8c77-e31a2ace9b29',
            identitetsnummer: '24849098329',
            startet: '2025-03-11T11:00:35.987Z',
            hendelser: [
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-03-11T11:00:35.238Z',
                    opplysningerV4: {
                        id: 'c3d30c03-c2b6-4ff4-809b-34ebdc88b773',
                        periodeId: 'fe26980f-74a7-4523-8c77-e31a2ace9b29',
                        sendtInnAv: {
                            tidspunkt: '2025-03-11T11:00:35.238Z',
                            utfoertAv: {
                                type: 'VEILEDER',
                                id: 'Z994498',
                                sikkerhetsnivaa: 'azure:undefined',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
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
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-03-11T11:00:35.987Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-03-11T11:00:35.987Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                            sikkerhetsnivaa: 'azure:undefined',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-03-11T11:00:36.294Z',
                    profileringV1: {
                        id: '3015e6d0-be22-4dd4-b63d-f1b49c7a26e7',
                        periodeId: 'fe26980f-74a7-4523-8c77-e31a2ace9b29',
                        opplysningerOmArbeidssokerId: 'c3d30c03-c2b6-4ff4-809b-34ebdc88b773',
                        sendtInnAv: {
                            tidspunkt: '2025-03-11T11:00:36.294Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-03-11T11:00:35.238Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-03-11T11:01:20.298Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-03-11T11:01:20.298Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                            sikkerhetsnivaa: 'azure:undefined',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
                        aarsak: 'Stopp av periode',
                    },
                },
            ],
            avsluttet: '2025-03-11T11:01:20.298Z',
        },
        {
            periodeId: 'b00685b4-9dc6-4676-9302-42623379ed4a',
            identitetsnummer: '24849098329',
            startet: '2025-03-11T06:59:10.662Z',
            hendelser: [
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-03-11T06:59:10.079Z',
                    opplysningerV4: {
                        id: '4d26fb20-d5a2-4f71-a4dd-d0d49d93856a',
                        periodeId: 'b00685b4-9dc6-4676-9302-42623379ed4a',
                        sendtInnAv: {
                            tidspunkt: '2025-03-11T06:59:10.079Z',
                            utfoertAv: {
                                type: 'VEILEDER',
                                id: 'Z994498',
                                sikkerhetsnivaa: 'azure:undefined',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
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
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-03-11T06:59:10.662Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-03-11T06:59:10.662Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                            sikkerhetsnivaa: 'azure:undefined',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-03-11T06:59:11.102Z',
                    profileringV1: {
                        id: 'ff38ec87-f17f-425a-ac0e-5b394a5c0a51',
                        periodeId: 'b00685b4-9dc6-4676-9302-42623379ed4a',
                        opplysningerOmArbeidssokerId: '4d26fb20-d5a2-4f71-a4dd-d0d49d93856a',
                        sendtInnAv: {
                            tidspunkt: '2025-03-11T06:59:11.102Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-03-11T06:59:10.079Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-03-11T06:59:27.608Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-03-11T06:59:27.608Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                            sikkerhetsnivaa: 'azure:undefined',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
                        aarsak: 'Feilregistrering',
                        tidspunktFraKilde: {
                            tidspunkt: '2025-03-11T06:59:27.608Z',
                            avviksType: 'SLETTET',
                        },
                    },
                },
            ],
            avsluttet: '2025-03-11T06:59:27.608Z',
        },
        {
            periodeId: 'd516dae6-a4f3-426b-a37d-920fe39d1c80',
            identitetsnummer: '24849098329',
            startet: '2025-03-11T05:54:46.466Z',
            hendelser: [
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-03-11T05:54:46.377Z',
                    opplysningerV4: {
                        id: 'c676411f-5126-4afd-8620-dfe1958a4d72',
                        periodeId: 'd516dae6-a4f3-426b-a37d-920fe39d1c80',
                        sendtInnAv: {
                            tidspunkt: '2025-03-11T05:54:46.377Z',
                            utfoertAv: {
                                type: 'VEILEDER',
                                id: 'Z994498',
                                sikkerhetsnivaa: 'azure:undefined',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
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
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-03-11T05:54:46.466Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-03-11T05:54:46.466Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                            sikkerhetsnivaa: 'azure:undefined',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-03-11T05:54:46.756Z',
                    profileringV1: {
                        id: '49ceceb7-b3d1-4e38-b4e9-ffefc7576944',
                        periodeId: 'd516dae6-a4f3-426b-a37d-920fe39d1c80',
                        opplysningerOmArbeidssokerId: 'c676411f-5126-4afd-8620-dfe1958a4d72',
                        sendtInnAv: {
                            tidspunkt: '2025-03-11T05:54:46.756Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-03-11T05:54:46.377Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-03-11T05:54:58.328Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-03-11T05:54:58.328Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                            sikkerhetsnivaa: 'azure:undefined',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
                        aarsak: 'Feilregistrering',
                        tidspunktFraKilde: {
                            tidspunkt: '2025-03-11T05:54:58.328Z',
                            avviksType: 'SLETTET',
                        },
                    },
                },
            ],
            avsluttet: '2025-03-11T05:54:58.328Z',
        },
        {
            periodeId: '570dd735-81cb-4d6a-b07e-534c237b2af1',
            identitetsnummer: '24849098329',
            startet: '2025-03-11T05:52:16.813Z',
            hendelser: [
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-03-11T05:52:15.837Z',
                    opplysningerV4: {
                        id: '4dd78308-3601-4e1b-86c3-daea1ff4fc8f',
                        periodeId: '570dd735-81cb-4d6a-b07e-534c237b2af1',
                        sendtInnAv: {
                            tidspunkt: '2025-03-11T05:52:15.837Z',
                            utfoertAv: {
                                type: 'VEILEDER',
                                id: 'Z994498',
                                sikkerhetsnivaa: 'azure:undefined',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
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
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-03-11T05:52:16.813Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-03-11T05:52:16.813Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                            sikkerhetsnivaa: 'azure:undefined',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-03-11T05:52:17.543Z',
                    profileringV1: {
                        id: '15ba329f-82ab-4246-a81c-5f2882ba7b07',
                        periodeId: '570dd735-81cb-4d6a-b07e-534c237b2af1',
                        opplysningerOmArbeidssokerId: '4dd78308-3601-4e1b-86c3-daea1ff4fc8f',
                        sendtInnAv: {
                            tidspunkt: '2025-03-11T05:52:17.543Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-03-11T05:52:15.837Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-03-11T05:54:11.598Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-03-11T05:54:11.598Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                            sikkerhetsnivaa: 'azure:undefined',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.10.283-1',
                        aarsak: 'Stopp av periode',
                    },
                },
            ],
            avsluttet: '2025-03-11T05:54:11.598Z',
        },
        {
            periodeId: '2b2bb8e0-a746-4770-80a6-46bfad6995f7',
            identitetsnummer: '24849098329',
            startet: '2025-03-10T06:28:04.295Z',
            hendelser: [
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-03-10T06:28:04.197Z',
                    opplysningerV4: {
                        id: '07c21bab-9d01-45d9-a351-bf72ce48f344',
                        periodeId: '2b2bb8e0-a746-4770-80a6-46bfad6995f7',
                        sendtInnAv: {
                            tidspunkt: '2025-03-10T06:28:04.197Z',
                            utfoertAv: {
                                type: 'VEILEDER',
                                id: 'Z994498',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.05.279-1',
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
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-03-10T06:28:04.295Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-03-10T06:28:04.295Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.05.279-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-03-10T06:28:04.830Z',
                    profileringV1: {
                        id: '889308f0-813b-4db3-a0e2-71b51087f2ce',
                        periodeId: '2b2bb8e0-a746-4770-80a6-46bfad6995f7',
                        opplysningerOmArbeidssokerId: '07c21bab-9d01-45d9-a351-bf72ce48f344',
                        sendtInnAv: {
                            tidspunkt: '2025-03-10T06:28:04.830Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-03-10T06:28:04.197Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-03-10T06:29:50.762Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-03-10T06:29:50.762Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.05.279-1',
                        aarsak: 'Stopp av periode',
                    },
                },
            ],
            avsluttet: '2025-03-10T06:29:50.762Z',
        },
        {
            periodeId: '0d75c73d-debe-45cb-a69c-c565326abd7a',
            identitetsnummer: '24849098329',
            startet: '2025-02-10T10:52:49.976Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-02-10T10:52:49.976Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-02-10T10:52:49.976Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '24849098329',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.02.10.237-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-02-10T10:52:50.103Z',
                    opplysningerV4: {
                        id: 'c1c2309f-22cc-4927-b0bc-68a5845850bc',
                        periodeId: '0d75c73d-debe-45cb-a69c-c565326abd7a',
                        sendtInnAv: {
                            tidspunkt: '2025-02-10T10:52:50.103Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '24849098329',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.02.10.237-1',
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
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-02-10T10:52:50.626Z',
                    profileringV1: {
                        id: '669fb705-b6ab-4926-bad3-8254946b2949',
                        periodeId: '0d75c73d-debe-45cb-a69c-c565326abd7a',
                        opplysningerOmArbeidssokerId: 'c1c2309f-22cc-4927-b0bc-68a5845850bc',
                        sendtInnAv: {
                            tidspunkt: '2025-02-10T10:52:50.626Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-02-10T10:52:50.103Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-02-11T11:14:28.241Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-02-11T11:14:28.241Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:25.02.11.142-1',
                        },
                        kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
                        aarsak: 'Graceperiode utløpt',
                    },
                },
            ],
            avsluttet: '2025-02-11T11:14:28.241Z',
        },
        {
            periodeId: '40a0e19f-511d-4e21-a68e-b42cc0f7710e',
            identitetsnummer: '24849098329',
            startet: '2025-02-07T10:03:13.689Z',
            hendelser: [
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-02-07T10:03:13.652Z',
                    opplysningerV4: {
                        id: 'eaa4af0f-4aff-4c95-ac50-b24ac7072d2c',
                        periodeId: '40a0e19f-511d-4e21-a68e-b42cc0f7710e',
                        sendtInnAv: {
                            tidspunkt: '2025-02-07T10:03:13.652Z',
                            utfoertAv: {
                                type: 'VEILEDER',
                                id: 'Z994498',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.02.06.235-1',
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
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-02-07T10:03:13.689Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-02-07T10:03:13.689Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.02.06.235-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-02-07T10:03:14.454Z',
                    profileringV1: {
                        id: 'ec1ba692-72e1-42b4-9af1-6739d32d483d',
                        periodeId: '40a0e19f-511d-4e21-a68e-b42cc0f7710e',
                        opplysningerOmArbeidssokerId: 'eaa4af0f-4aff-4c95-ac50-b24ac7072d2c',
                        sendtInnAv: {
                            tidspunkt: '2025-02-07T10:03:14.454Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-02-07T10:03:13.652Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-02-07T11:39:18.525Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-02-07T11:39:18.525Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '24849098329',
                        },
                        kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
                        aarsak: "Svarte NEI på spørsmål 'Vil du fortsatt være registrert som arbeidssøker?'",
                    },
                },
            ],
            avsluttet: '2025-02-07T11:39:18.525Z',
        },
        {
            periodeId: '43803762-778d-417d-856f-5fd72aec9090',
            identitetsnummer: '24849098329',
            startet: '2025-02-07T09:38:28.199Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-02-07T09:38:28.199Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-02-07T09:38:28.199Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.02.06.235-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-02-07T09:38:28.408Z',
                    opplysningerV4: {
                        id: '087b3bd5-83d5-4e8a-b221-ff885407f399',
                        periodeId: '43803762-778d-417d-856f-5fd72aec9090',
                        sendtInnAv: {
                            tidspunkt: '2025-02-07T09:38:28.408Z',
                            utfoertAv: {
                                type: 'VEILEDER',
                                id: 'Z994498',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.02.06.235-1',
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
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-02-07T09:38:28.799Z',
                    profileringV1: {
                        id: 'd4920f9d-aa8d-415a-a6fc-254896691422',
                        periodeId: '43803762-778d-417d-856f-5fd72aec9090',
                        opplysningerOmArbeidssokerId: '087b3bd5-83d5-4e8a-b221-ff885407f399',
                        sendtInnAv: {
                            tidspunkt: '2025-02-07T09:38:28.799Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-02-07T09:38:28.408Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-02-07T09:49:12.175Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-02-07T09:49:12.175Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '24849098329',
                        },
                        kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
                        aarsak: "Svarte NEI på spørsmål 'Vil du fortsatt være registrert som arbeidssøker?'",
                    },
                },
            ],
            avsluttet: '2025-02-07T09:49:12.175Z',
        },
        {
            periodeId: '3d5baaf8-1ae1-4a78-a079-a2f62cbce6f4',
            identitetsnummer: '24849098329',
            startet: '2025-02-03T06:32:19.077Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-02-03T06:32:19.077Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-02-03T06:32:19.077Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '24849098329',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.01.30.230-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-02-03T06:32:19.206Z',
                    opplysningerV4: {
                        id: '6cc66bb5-f3e3-40e5-85a2-3be5717aa935',
                        periodeId: '3d5baaf8-1ae1-4a78-a079-a2f62cbce6f4',
                        sendtInnAv: {
                            tidspunkt: '2025-02-03T06:32:19.206Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '24849098329',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.01.30.230-1',
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
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-02-03T06:32:19.524Z',
                    profileringV1: {
                        id: 'e4c19a89-ba34-47c1-93d0-6d8dc5cabdc4',
                        periodeId: '3d5baaf8-1ae1-4a78-a079-a2f62cbce6f4',
                        opplysningerOmArbeidssokerId: '6cc66bb5-f3e3-40e5-85a2-3be5717aa935',
                        sendtInnAv: {
                            tidspunkt: '2025-02-03T06:32:19.524Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'paw-arbeidssoekerregisteret-monorepo-ekstern-25.01.29.86-1',
                            },
                            kilde: 'paw-arbeidssoekerregisteret-monorepo-ekstern-25.01.29.86-1',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-02-03T06:32:19.206Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-02-04T07:03:56.348Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-02-04T07:03:56.348Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:25.02.04.133-1',
                        },
                        kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
                        aarsak: 'Graceperiode utløpt',
                    },
                },
            ],
            avsluttet: '2025-02-04T07:03:56.348Z',
        },
        {
            periodeId: '47b441ac-3c65-4751-b4d9-69044cc3fbe1',
            identitetsnummer: '24849098329',
            startet: '2025-01-24T07:58:56.957Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-01-24T07:58:56.957Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-01-24T07:58:56.957Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '24849098329',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.01.16.212-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-01-24T07:58:58.708Z',
                    opplysningerV4: {
                        id: '6a6a610c-5b99-496e-8a95-6f3a792dfa57',
                        periodeId: '47b441ac-3c65-4751-b4d9-69044cc3fbe1',
                        sendtInnAv: {
                            tidspunkt: '2025-01-24T07:58:58.708Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '24849098329',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.01.16.212-1',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                        },
                        utdanning: {
                            nus: '4',
                            bestaatt: 'NEI',
                            godkjent: 'JA',
                        },
                        helse: {
                            helsetilstandHindrerArbeid: 'NEI',
                        },
                        jobbsituasjon: {
                            beskrivelser: [
                                {
                                    beskrivelse: 'HAR_SAGT_OPP',
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
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-01-24T07:58:59.591Z',
                    profileringV1: {
                        id: '31fac2ca-d384-4d4c-8eaf-7d69238e5799',
                        periodeId: '47b441ac-3c65-4751-b4d9-69044cc3fbe1',
                        opplysningerOmArbeidssokerId: '6a6a610c-5b99-496e-8a95-6f3a792dfa57',
                        sendtInnAv: {
                            tidspunkt: '2025-01-24T07:58:59.591Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'paw-arbeidssoekerregisteret-monorepo-ekstern-25.01.21.83-1',
                            },
                            kilde: 'paw-arbeidssoekerregisteret-monorepo-ekstern-25.01.21.83-1',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-01-24T07:58:58.708Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-01-27T14:21:57.054Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-01-27T14:21:57.054Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:25.01.27.115-1',
                        },
                        kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
                        aarsak: 'Graceperiode utløpt',
                    },
                },
            ],
            avsluttet: '2025-01-27T14:21:57.054Z',
        },
        {
            periodeId: '596b1d36-0ba3-46e0-910b-0b55bafba3c8',
            identitetsnummer: '24849098329',
            startet: '2025-01-21T06:39:10.767Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-01-21T06:39:10.767Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-01-21T06:39:10.767Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '24849098329',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.01.16.212-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-01-21T06:39:10.909Z',
                    opplysningerV4: {
                        id: '40bb19f2-1a86-4ff6-b5c9-935edb7210ce',
                        periodeId: '596b1d36-0ba3-46e0-910b-0b55bafba3c8',
                        sendtInnAv: {
                            tidspunkt: '2025-01-21T06:39:10.909Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '24849098329',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.01.16.212-1',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                        },
                        utdanning: {
                            nus: '4',
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
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2025-01-21T06:39:11.423Z',
                    profileringV1: {
                        id: 'db14c6dc-d5d4-41e9-867d-ab5820990901',
                        periodeId: '596b1d36-0ba3-46e0-910b-0b55bafba3c8',
                        opplysningerOmArbeidssokerId: '40bb19f2-1a86-4ff6-b5c9-935edb7210ce',
                        sendtInnAv: {
                            tidspunkt: '2025-01-21T06:39:11.423Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'paw-arbeidssoekerregisteret-monorepo-ekstern-25.01.15.81-1',
                            },
                            kilde: 'paw-arbeidssoekerregisteret-monorepo-ekstern-25.01.15.81-1',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-01-21T06:39:10.909Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-01-22T06:45:06.330Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-01-22T06:45:06.330Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:25.01.16.114-1',
                        },
                        kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
                        aarsak: 'Graceperiode utløpt',
                    },
                },
            ],
            avsluttet: '2025-01-22T06:45:06.330Z',
        },
        {
            periodeId: '1613dd57-0fe4-4f2d-a78c-6c6630a305b8',
            identitetsnummer: '24849098329',
            startet: '2024-10-04T07:36:26.995Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2024-10-04T07:36:26.995Z',
                    periodeStartetV1: {
                        tidspunkt: '2024-10-04T07:36:26.995Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '24849098329',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.10.04.92-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2024-10-04T07:36:27.118Z',
                    opplysningerV4: {
                        id: '36705698-9b99-48c4-8bd9-c1d6e9221d8d',
                        periodeId: '1613dd57-0fe4-4f2d-a78c-6c6630a305b8',
                        sendtInnAv: {
                            tidspunkt: '2024-10-04T07:36:27.118Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '24849098329',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.10.04.92-1',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                        },
                        utdanning: {
                            nus: '4',
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
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2024-10-04T07:36:27.404Z',
                    profileringV1: {
                        id: 'ff832858-c391-47ce-9f7d-1a6fc6d78311',
                        periodeId: '1613dd57-0fe4-4f2d-a78c-6c6630a305b8',
                        opplysningerOmArbeidssokerId: '36705698-9b99-48c4-8bd9-c1d6e9221d8d',
                        sendtInnAv: {
                            tidspunkt: '2024-10-04T07:36:27.404Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'paw-arbeidssoekerregisteret-monorepo-ekstern-24.10.01.14-1',
                            },
                            kilde: 'paw-arbeidssoekerregisteret-monorepo-ekstern-24.10.01.14-1',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2024-10-04T07:36:27.118Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2024-10-07T13:01:00.970Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2024-10-07T13:01:00.970Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:24.10.07.4-1',
                        },
                        kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
                        aarsak: 'Graceperiode utløpt',
                    },
                },
            ],
            avsluttet: '2024-10-07T13:01:00.970Z',
        },
        {
            periodeId: '2feb673d-5285-423a-a4f2-fe428e217ce3',
            identitetsnummer: '24849098329',
            startet: '2024-09-02T09:49:49.032Z',
            hendelser: [
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2024-09-02T09:49:48.465Z',
                    opplysningerV4: {
                        id: '473cf33e-059f-4975-bc81-1518a2ddfdc7',
                        periodeId: '2feb673d-5285-423a-a4f2-fe428e217ce3',
                        sendtInnAv: {
                            tidspunkt: '2024-09-02T09:49:48.465Z',
                            utfoertAv: {
                                type: 'VEILEDER',
                                id: 'Z994498',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.08.30.18-1',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                        },
                        utdanning: {
                            nus: '2',
                        },
                        helse: {
                            helsetilstandHindrerArbeid: 'NEI',
                        },
                        jobbsituasjon: {
                            beskrivelser: [
                                {
                                    beskrivelse: 'HAR_BLITT_SAGT_OPP',
                                    detaljer: {
                                        stilling: 'Annen stilling',
                                        stilling_styrk08: '00',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2024-09-02T09:49:49.032Z',
                    periodeStartetV1: {
                        tidspunkt: '2024-09-02T09:49:49.032Z',
                        utfoertAv: {
                            type: 'VEILEDER',
                            id: 'Z994498',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.08.30.18-1',
                        aarsak: 'Er forhåndsgodkjent av ansatt',
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2024-09-06T08:16:36.869Z',
                    profileringV1: {
                        id: 'ac8f8447-84c6-4608-920d-c25c708eecfc',
                        periodeId: '2feb673d-5285-423a-a4f2-fe428e217ce3',
                        opplysningerOmArbeidssokerId: '473cf33e-059f-4975-bc81-1518a2ddfdc7',
                        sendtInnAv: {
                            tidspunkt: '2024-09-06T08:16:36.869Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'paw-arbeidssoekerregisteret-monorepo-ekstern-24.09.06.6-1',
                            },
                            kilde: 'paw-arbeidssoekerregisteret-monorepo-ekstern-24.09.06.6-1',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2024-09-02T09:49:48.465Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2024-09-27T11:28:47.057Z',
                    opplysningerV4: {
                        id: '6f4c792f-535d-4960-92bb-939419cdd721',
                        periodeId: '2feb673d-5285-423a-a4f2-fe428e217ce3',
                        sendtInnAv: {
                            tidspunkt: '2024-09-27T11:28:47.057Z',
                            utfoertAv: {
                                type: 'VEILEDER',
                                id: 'Z994498',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.09.27.68-1',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                        },
                        utdanning: {
                            nus: '2',
                        },
                        helse: {
                            helsetilstandHindrerArbeid: 'NEI',
                        },
                        jobbsituasjon: {
                            beskrivelser: [
                                {
                                    beskrivelse: 'HAR_BLITT_SAGT_OPP',
                                    detaljer: {
                                        stilling: 'Applications Supporter',
                                        stilling_styrk08: '3512',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2024-09-27T11:28:47.860Z',
                    profileringV1: {
                        id: '2fee6c88-6838-4b02-b85a-921af40ee120',
                        periodeId: '2feb673d-5285-423a-a4f2-fe428e217ce3',
                        opplysningerOmArbeidssokerId: '6f4c792f-535d-4960-92bb-939419cdd721',
                        sendtInnAv: {
                            tidspunkt: '2024-09-27T11:28:47.860Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'paw-arbeidssoekerregisteret-monorepo-ekstern-24.09.11.8-1',
                            },
                            kilde: 'paw-arbeidssoekerregisteret-monorepo-ekstern-24.09.11.8-1',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2024-09-27T11:28:47.057Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2024-10-01T00:00:10.101Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2024-10-01T00:00:10.101Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-utgang-formidlingsgruppe:24.09.30.119-1',
                        },
                        kilde: 'topic:teamarenanais.aapen-arena-formidlingsgruppeendret-v1-q',
                        aarsak: 'ISERV',
                        tidspunktFraKilde: {
                            tidspunkt: '2024-10-01T00:00:03Z',
                            avviksType: 'FORSINKELSE',
                        },
                    },
                },
            ],
            avsluttet: '2024-10-01T00:00:10.101Z',
        },
        {
            periodeId: 'bf70c10f-9348-4baf-a66e-b59a1d28c0c1',
            identitetsnummer: '24849098329',
            startet: '2024-04-19T06:59:42.217Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2024-04-19T06:59:42.217Z',
                    periodeStartetV1: {
                        tidspunkt: '2024-04-19T06:59:42.217Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '24849098329',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.04.18.114-1',
                        aarsak: 'Er over 18 år, er bosatt i Norge i hendhold Folkeregisterloven',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2024-06-24T06:59:45.312Z',
                    opplysningerV4: {
                        id: 'fc0bebb5-68d5-450a-b450-c3db19fad84f',
                        periodeId: 'bf70c10f-9348-4baf-a66e-b59a1d28c0c1',
                        sendtInnAv: {
                            tidspunkt: '2024-06-24T06:59:45.312Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '24849098329',
                            },
                            kilde: 'paw-arbeidssoekerregisteret-inngang',
                            aarsak: 'opplysning om arbeidssøker sendt inn',
                        },
                        utdanning: {
                            nus: '4',
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
                                        stilling: 'Bilskadereparatør',
                                        stilling_styrk08: '7213',
                                    },
                                },
                            ],
                        },
                        annet: {
                            andreForholdHindrerArbeid: 'NEI',
                        },
                    },
                },
                {
                    hendelseType: 'profilering_v1',
                    tidspunkt: '2024-06-24T06:59:46.423Z',
                    profileringV1: {
                        id: '6959ca58-2b73-4d1a-842d-003b904aa6d8',
                        periodeId: 'bf70c10f-9348-4baf-a66e-b59a1d28c0c1',
                        opplysningerOmArbeidssokerId: 'fc0bebb5-68d5-450a-b450-c3db19fad84f',
                        sendtInnAv: {
                            tidspunkt: '2024-06-24T06:59:46.423Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2024-06-24T06:59:45.312Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_GODE_MULIGHETER',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: true,
                        alder: 34,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2024-07-16T00:02:02.945Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2024-07-16T00:02:02.945Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-utgang-formidlingsgruppe:24.07.10.44-1',
                        },
                        kilde: 'topic:teamarenanais.aapen-arena-formidlingsgruppeendret-v1-q',
                        aarsak: 'ISERV',
                        tidspunktFraKilde: {
                            tidspunkt: '2024-07-16T00:01:59Z',
                            avviksType: 'FORSINKELSE',
                        },
                    },
                },
            ],
            avsluttet: '2024-07-16T00:02:02.945Z',
        },
    ],
};

export default tidslinjer;
