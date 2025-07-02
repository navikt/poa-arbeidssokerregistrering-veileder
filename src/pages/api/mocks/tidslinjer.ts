import type { NextApiRequest, NextApiResponse } from 'next';

const tidslinjer = (req: NextApiRequest, res: NextApiResponse): void => {
    res.json(data);
};

const data = {
    tidslinjer: [
        {
            periodeId: 'a0e5b2a3-938c-40ed-b1b5-af07782d1a16',
            identitetsnummer: '63846802349',
            startet: '2025-06-27T11:24:18.966Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-06-27T11:24:18.966Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-06-27T11:24:18.966Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '63846802349',
                            sikkerhetsnivaa: 'tokenx:Level4',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.06.16.352-1',
                        aarsak: 'Er EU/EØS statsborger',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-06-27T11:24:19.097Z',
                    opplysningerV4: {
                        id: '75ec4938-8c80-4def-814f-554dddce1ec8',
                        periodeId: 'a0e5b2a3-938c-40ed-b1b5-af07782d1a16',
                        sendtInnAv: {
                            tidspunkt: '2025-06-27T11:24:19.097Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '63846802349',
                                sikkerhetsnivaa: 'tokenx:Level4',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.06.16.352-1',
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
                    tidspunkt: '2025-06-27T11:24:19.689Z',
                    profileringV1: {
                        id: '7a46915e-2651-4ef1-9996-917ba725eded',
                        periodeId: 'a0e5b2a3-938c-40ed-b1b5-af07782d1a16',
                        opplysningerOmArbeidssokerId: '75ec4938-8c80-4def-814f-554dddce1ec8',
                        sendtInnAv: {
                            tidspunkt: '2025-06-27T11:24:19.689Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.06.27.142-1',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.06.27.142-1',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-06-27T11:24:19.097Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 57,
                    },
                },
            ],
        },
        {
            periodeId: '2298a107-a311-4fcc-80ad-e9248e53edbb',
            identitetsnummer: '63846802349',
            startet: '2025-05-05T07:57:11.133Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-05-05T07:57:11.133Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-05-05T07:57:11.133Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '63846802349',
                            sikkerhetsnivaa: 'tokenx:Level4',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.05.05.322-1',
                        aarsak: 'Er EU/EØS statsborger',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-05-05T07:57:11.454Z',
                    opplysningerV4: {
                        id: '0bb98a02-fd32-40c1-b015-554789d2caad',
                        periodeId: '2298a107-a311-4fcc-80ad-e9248e53edbb',
                        sendtInnAv: {
                            tidspunkt: '2025-05-05T07:57:11.454Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '63846802349',
                                sikkerhetsnivaa: 'tokenx:Level4',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.05.05.322-1',
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
                    tidspunkt: '2025-05-05T07:57:15.930Z',
                    profileringV1: {
                        id: 'f87553f4-f218-4684-9d4c-9337ef7eb8e8',
                        periodeId: '2298a107-a311-4fcc-80ad-e9248e53edbb',
                        opplysningerOmArbeidssokerId: '0bb98a02-fd32-40c1-b015-554789d2caad',
                        sendtInnAv: {
                            tidspunkt: '2025-05-05T07:57:15.930Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.05.05.119-1',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.05.05.119-1',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-05-05T07:57:11.454Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 57,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-05-26T22:01:24.813Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-05-26T22:01:24.813Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:25.05.23.230-1',
                        },
                        kilde: 'paw-arbeidssoekerregisteret-bekreftelse-tjeneste',
                        aarsak: '[Bekreftelse] ikke levert innen fristen',
                    },
                },
            ],
            avsluttet: '2025-05-26T22:01:24.813Z',
        },
        {
            periodeId: '7c4c75e2-9850-4dd9-95b7-94ce35b2a279',
            identitetsnummer: '63846802349',
            startet: '2025-03-27T06:33:35.456Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-03-27T06:33:35.456Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-03-27T06:33:35.456Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '63846802349',
                            sikkerhetsnivaa: 'tokenx:Level4',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.27.292-1',
                        aarsak: 'Er EU/EØS statsborger',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-03-27T06:33:36.069Z',
                    opplysningerV4: {
                        id: '1f68688f-e306-46d9-b847-d67965928fc4',
                        periodeId: '7c4c75e2-9850-4dd9-95b7-94ce35b2a279',
                        sendtInnAv: {
                            tidspunkt: '2025-03-27T06:33:36.069Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '63846802349',
                                sikkerhetsnivaa: 'tokenx:Level4',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.27.292-1',
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
                    tidspunkt: '2025-03-27T06:33:37.267Z',
                    profileringV1: {
                        id: '35a38a61-f4e5-4f32-9747-c16ce34aeb3b',
                        periodeId: '7c4c75e2-9850-4dd9-95b7-94ce35b2a279',
                        opplysningerOmArbeidssokerId: '1f68688f-e306-46d9-b847-d67965928fc4',
                        sendtInnAv: {
                            tidspunkt: '2025-03-27T06:33:37.267Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-03-27T06:33:36.069Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 56,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-03-27T08:20:46.095Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-03-27T08:20:46.095Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:25.03.27.189-1',
                        },
                        kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
                        aarsak: '[Bekreftelse] ikke levert innen fristen',
                    },
                },
            ],
            avsluttet: '2025-03-27T08:20:46.095Z',
        },
        {
            periodeId: '48ccd4f5-da72-4153-a60f-03ffe896b8e6',
            identitetsnummer: '63846802349',
            startet: '2025-03-25T06:14:53.216Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-03-25T06:14:53.216Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-03-25T06:14:53.216Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '63846802349',
                            sikkerhetsnivaa: 'tokenx:Level4',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.24.291-1',
                        aarsak: 'Er EU/EØS statsborger',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-03-25T06:14:53.323Z',
                    opplysningerV4: {
                        id: 'a8882526-074c-455f-b746-c8177672d93b',
                        periodeId: '48ccd4f5-da72-4153-a60f-03ffe896b8e6',
                        sendtInnAv: {
                            tidspunkt: '2025-03-25T06:14:53.323Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '63846802349',
                                sikkerhetsnivaa: 'tokenx:Level4',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.24.291-1',
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
                    tidspunkt: '2025-03-25T06:14:53.603Z',
                    profileringV1: {
                        id: '5c70b2ac-4503-40b7-a324-cc3e73d047f8',
                        periodeId: '48ccd4f5-da72-4153-a60f-03ffe896b8e6',
                        opplysningerOmArbeidssokerId: 'a8882526-074c-455f-b746-c8177672d93b',
                        sendtInnAv: {
                            tidspunkt: '2025-03-25T06:14:53.603Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-03-25T06:14:53.323Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 56,
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-03-26T06:20:47.229Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-03-26T06:20:47.229Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:25.03.24.187-1',
                        },
                        kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
                        aarsak: '[Bekreftelse] ikke levert innen fristen',
                    },
                },
            ],
            avsluttet: '2025-03-26T06:20:47.229Z',
        },
        {
            periodeId: '319ab285-f6ac-4472-be36-fb4550bfc4a8',
            identitetsnummer: '63846802349',
            startet: '2025-03-20T11:01:25.925Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-03-20T11:01:25.925Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-03-20T11:01:25.925Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '63846802349',
                            sikkerhetsnivaa: 'tokenx:Level4',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.18.287-1',
                        aarsak: 'Er EU/EØS statsborger',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-03-20T11:01:26.083Z',
                    opplysningerV4: {
                        id: '8c31baaf-82ff-4e6e-87b2-aef6d4796b58',
                        periodeId: '319ab285-f6ac-4472-be36-fb4550bfc4a8',
                        sendtInnAv: {
                            tidspunkt: '2025-03-20T11:01:26.083Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '63846802349',
                                sikkerhetsnivaa: 'tokenx:Level4',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.18.287-1',
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
                                    beskrivelse: 'VIL_BYTTE_JOBB',
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
                    tidspunkt: '2025-03-20T11:01:26.722Z',
                    profileringV1: {
                        id: '3f0af7ce-eda7-42f1-b82d-cb02e3f26be3',
                        periodeId: '319ab285-f6ac-4472-be36-fb4550bfc4a8',
                        opplysningerOmArbeidssokerId: '8c31baaf-82ff-4e6e-87b2-aef6d4796b58',
                        sendtInnAv: {
                            tidspunkt: '2025-03-20T11:01:26.722Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-03-20T11:01:26.083Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 56,
                    },
                },
                {
                    hendelseType: 'bekreftelse_v1',
                    tidspunkt: '2025-03-20T11:06:04.527Z',
                    bekreftelseV1: {
                        status: 'GYLDIG',
                        bekreftelse: {
                            periodeId: '319ab285-f6ac-4472-be36-fb4550bfc4a8',
                            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                            id: '33059d50-cd44-4124-8543-8bfa15e2e1f3',
                            svar: {
                                sendtInnAv: {
                                    tidspunkt: '2025-03-20T11:06:04.527Z',
                                    utfoertAv: {
                                        type: 'SLUTTBRUKER',
                                        id: '63846802349',
                                        sikkerhetsnivaa: 'tokenx:Level4',
                                    },
                                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:25.03.20.294-1',
                                    aarsak: 'Bekreftelse levert',
                                },
                                gjelderFra: '2025-03-20T11:01:25.925Z',
                                gjelderTil: '2025-03-20T11:06:25.925Z',
                                harJobbetIDennePerioden: true,
                                vilFortsetteSomArbeidssoeker: true,
                            },
                        },
                    },
                },
                {
                    hendelseType: 'bekreftelse_v1',
                    tidspunkt: '2025-03-20T11:14:30.800Z',
                    bekreftelseV1: {
                        status: 'GYLDIG',
                        bekreftelse: {
                            periodeId: '319ab285-f6ac-4472-be36-fb4550bfc4a8',
                            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                            id: 'dcd4dc7a-d954-411b-beb5-ae2f908756de',
                            svar: {
                                sendtInnAv: {
                                    tidspunkt: '2025-03-20T11:14:30.800Z',
                                    utfoertAv: {
                                        type: 'SLUTTBRUKER',
                                        id: '63846802349',
                                        sikkerhetsnivaa: 'tokenx:Level4',
                                    },
                                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:25.03.20.294-1',
                                    aarsak: 'Bekreftelse levert',
                                },
                                gjelderFra: '2025-03-20T11:06:25.925Z',
                                gjelderTil: '2025-03-20T11:11:25.925Z',
                                harJobbetIDennePerioden: true,
                                vilFortsetteSomArbeidssoeker: true,
                            },
                        },
                    },
                },
                {
                    hendelseType: 'bekreftelse_v1',
                    tidspunkt: '2025-03-20T11:24:07.323Z',
                    bekreftelseV1: {
                        status: 'GYLDIG',
                        bekreftelse: {
                            periodeId: '319ab285-f6ac-4472-be36-fb4550bfc4a8',
                            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                            id: 'd962810b-2642-4d73-b25f-f9a5254e31f7',
                            svar: {
                                sendtInnAv: {
                                    tidspunkt: '2025-03-20T11:24:07.323Z',
                                    utfoertAv: {
                                        type: 'SLUTTBRUKER',
                                        id: '63846802349',
                                        sikkerhetsnivaa: 'tokenx:Level4',
                                    },
                                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:25.03.20.294-1',
                                    aarsak: 'Bekreftelse levert',
                                },
                                gjelderFra: '2025-03-20T11:11:25.925Z',
                                gjelderTil: '2025-03-20T11:16:25.925Z',
                                harJobbetIDennePerioden: true,
                                vilFortsetteSomArbeidssoeker: true,
                            },
                        },
                    },
                },
                {
                    hendelseType: 'bekreftelse_v1',
                    tidspunkt: '2025-03-20T11:24:13.533Z',
                    bekreftelseV1: {
                        status: 'GYLDIG',
                        bekreftelse: {
                            periodeId: '319ab285-f6ac-4472-be36-fb4550bfc4a8',
                            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                            id: '5d347705-d3e2-4491-bfa0-bd926c22065c',
                            svar: {
                                sendtInnAv: {
                                    tidspunkt: '2025-03-20T11:24:13.533Z',
                                    utfoertAv: {
                                        type: 'SLUTTBRUKER',
                                        id: '63846802349',
                                        sikkerhetsnivaa: 'tokenx:Level4',
                                    },
                                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:25.03.20.294-1',
                                    aarsak: 'Bekreftelse levert',
                                },
                                gjelderFra: '2025-03-20T11:16:25.925Z',
                                gjelderTil: '2025-03-20T11:21:25.925Z',
                                harJobbetIDennePerioden: true,
                                vilFortsetteSomArbeidssoeker: true,
                            },
                        },
                    },
                },
                {
                    hendelseType: 'bekreftelse_v1',
                    tidspunkt: '2025-03-20T11:46:19.518Z',
                    bekreftelseV1: {
                        status: 'GYLDIG',
                        bekreftelse: {
                            periodeId: '319ab285-f6ac-4472-be36-fb4550bfc4a8',
                            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                            id: 'd043d653-a259-43be-bc1f-cd8f82a345d1',
                            svar: {
                                sendtInnAv: {
                                    tidspunkt: '2025-03-20T11:46:19.518Z',
                                    utfoertAv: {
                                        type: 'SLUTTBRUKER',
                                        id: '63846802349',
                                        sikkerhetsnivaa: 'tokenx:Level4',
                                    },
                                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:25.03.20.294-1',
                                    aarsak: 'Bekreftelse levert',
                                },
                                gjelderFra: '2025-03-20T11:21:25.925Z',
                                gjelderTil: '2025-03-20T11:26:25.925Z',
                                harJobbetIDennePerioden: true,
                                vilFortsetteSomArbeidssoeker: true,
                            },
                        },
                    },
                },
                {
                    hendelseType: 'bekreftelse_v1',
                    tidspunkt: '2025-03-20T11:46:24.111Z',
                    bekreftelseV1: {
                        status: 'GYLDIG',
                        bekreftelse: {
                            periodeId: '319ab285-f6ac-4472-be36-fb4550bfc4a8',
                            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                            id: '62a1103a-c64c-4b92-b9f0-ecfe43fda953',
                            svar: {
                                sendtInnAv: {
                                    tidspunkt: '2025-03-20T11:46:24.111Z',
                                    utfoertAv: {
                                        type: 'SLUTTBRUKER',
                                        id: '63846802349',
                                        sikkerhetsnivaa: 'tokenx:Level4',
                                    },
                                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:25.03.20.294-1',
                                    aarsak: 'Bekreftelse levert',
                                },
                                gjelderFra: '2025-03-20T11:26:25.925Z',
                                gjelderTil: '2025-03-20T11:31:25.925Z',
                                harJobbetIDennePerioden: true,
                                vilFortsetteSomArbeidssoeker: true,
                            },
                        },
                    },
                },
                {
                    hendelseType: 'bekreftelse_v1',
                    tidspunkt: '2025-03-20T11:46:29.711Z',
                    bekreftelseV1: {
                        status: 'GYLDIG',
                        bekreftelse: {
                            periodeId: '319ab285-f6ac-4472-be36-fb4550bfc4a8',
                            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                            id: 'd64c5c0b-0ed2-4f34-93ee-88d890dd95f4',
                            svar: {
                                sendtInnAv: {
                                    tidspunkt: '2025-03-20T11:46:29.711Z',
                                    utfoertAv: {
                                        type: 'SLUTTBRUKER',
                                        id: '63846802349',
                                        sikkerhetsnivaa: 'tokenx:Level4',
                                    },
                                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:25.03.20.294-1',
                                    aarsak: 'Bekreftelse levert',
                                },
                                gjelderFra: '2025-03-20T11:31:25.925Z',
                                gjelderTil: '2025-03-20T11:36:25.925Z',
                                harJobbetIDennePerioden: true,
                                vilFortsetteSomArbeidssoeker: true,
                            },
                        },
                    },
                },
                {
                    hendelseType: 'bekreftelse_v1',
                    tidspunkt: '2025-03-20T11:46:46.504Z',
                    bekreftelseV1: {
                        status: 'GYLDIG',
                        bekreftelse: {
                            periodeId: '319ab285-f6ac-4472-be36-fb4550bfc4a8',
                            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                            id: '6ac2e6be-afe9-4353-bc69-39a80bc09d0a',
                            svar: {
                                sendtInnAv: {
                                    tidspunkt: '2025-03-20T11:46:46.504Z',
                                    utfoertAv: {
                                        type: 'SLUTTBRUKER',
                                        id: '63846802349',
                                        sikkerhetsnivaa: 'tokenx:Level4',
                                    },
                                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:25.03.20.294-1',
                                    aarsak: 'Bekreftelse levert',
                                },
                                gjelderFra: '2025-03-20T11:36:25.925Z',
                                gjelderTil: '2025-03-20T11:41:25.925Z',
                                harJobbetIDennePerioden: true,
                                vilFortsetteSomArbeidssoeker: true,
                            },
                        },
                    },
                },
                {
                    hendelseType: 'bekreftelse_v1',
                    tidspunkt: '2025-03-20T13:49:34.427Z',
                    bekreftelseV1: {
                        status: 'GYLDIG',
                        bekreftelse: {
                            periodeId: '319ab285-f6ac-4472-be36-fb4550bfc4a8',
                            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                            id: '019d9856-f7b4-4e6f-a513-7a8c8d5f3a93',
                            svar: {
                                sendtInnAv: {
                                    tidspunkt: '2025-03-20T13:49:34.427Z',
                                    utfoertAv: {
                                        type: 'VEILEDER',
                                        id: 'Z994498',
                                    },
                                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:25.03.20.294-1',
                                    aarsak: 'Bekreftelse levert',
                                },
                                gjelderFra: '2025-03-20T11:41:25.925Z',
                                gjelderTil: '2025-03-20T11:46:25.925Z',
                                harJobbetIDennePerioden: true,
                                vilFortsetteSomArbeidssoeker: true,
                            },
                        },
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-03-21T11:52:21.256Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-03-21T11:52:21.256Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:25.03.21.184-1',
                        },
                        kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
                        aarsak: '[Bekreftelse] ikke levert innen fristen',
                    },
                },
            ],
            avsluttet: '2025-03-21T11:52:21.256Z',
        },
        {
            periodeId: '784c1a8a-6acd-4776-97c7-49a5b8b86c6c',
            identitetsnummer: '63846802349',
            startet: '2025-03-19T08:52:08.231Z',
            hendelser: [
                {
                    hendelseType: 'periode_startet_v1',
                    tidspunkt: '2025-03-19T08:52:08.231Z',
                    periodeStartetV1: {
                        tidspunkt: '2025-03-19T08:52:08.231Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '63846802349',
                            sikkerhetsnivaa: 'tokenx:Level4',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.18.287-1',
                        aarsak: 'Er EU/EØS statsborger',
                    },
                },
                {
                    hendelseType: 'opplysninger_v4',
                    tidspunkt: '2025-03-19T08:52:08.358Z',
                    opplysningerV4: {
                        id: '65683871-43d7-4802-b7b4-3f953091e2e0',
                        periodeId: '784c1a8a-6acd-4776-97c7-49a5b8b86c6c',
                        sendtInnAv: {
                            tidspunkt: '2025-03-19T08:52:08.358Z',
                            utfoertAv: {
                                type: 'SLUTTBRUKER',
                                id: '63846802349',
                                sikkerhetsnivaa: 'tokenx:Level4',
                            },
                            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.03.18.287-1',
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
                                    beskrivelse: 'HAR_SAGT_OPP',
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
                    tidspunkt: '2025-03-19T08:52:08.905Z',
                    profileringV1: {
                        id: 'd8445b63-c012-481e-8646-88f7004fef3f',
                        periodeId: '784c1a8a-6acd-4776-97c7-49a5b8b86c6c',
                        opplysningerOmArbeidssokerId: '65683871-43d7-4802-b7b4-3f953091e2e0',
                        sendtInnAv: {
                            tidspunkt: '2025-03-19T08:52:08.905Z',
                            utfoertAv: {
                                type: 'SYSTEM',
                                id: 'null-null',
                            },
                            kilde: 'null-null',
                            aarsak: 'opplysninger-mottatt',
                            tidspunktFraKilde: {
                                tidspunkt: '2025-03-19T08:52:08.358Z',
                                avviksType: 'FORSINKELSE',
                            },
                        },
                        profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                        jobbetSammenhengendeSeksAvTolvSisteMnd: false,
                        alder: 56,
                    },
                },
                {
                    hendelseType: 'bekreftelse_v1',
                    tidspunkt: '2025-03-19T09:23:14.025Z',
                    bekreftelseV1: {
                        status: 'GYLDIG',
                        bekreftelse: {
                            periodeId: '784c1a8a-6acd-4776-97c7-49a5b8b86c6c',
                            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                            id: '1c7b9e98-8dc3-4530-b525-973eff20c56c',
                            svar: {
                                sendtInnAv: {
                                    tidspunkt: '2025-03-19T09:23:14.025Z',
                                    utfoertAv: {
                                        type: 'SLUTTBRUKER',
                                        id: '63846802349',
                                        sikkerhetsnivaa: 'tokenx:Level4',
                                    },
                                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:25.03.19.293-1',
                                    aarsak: 'Bekreftelse levert',
                                },
                                gjelderFra: '2025-03-19T08:52:08.231Z',
                                gjelderTil: '2025-03-19T08:57:08.231Z',
                                harJobbetIDennePerioden: true,
                                vilFortsetteSomArbeidssoeker: true,
                            },
                        },
                    },
                },
                {
                    hendelseType: 'bekreftelse_v1',
                    tidspunkt: '2025-03-19T09:23:21.420Z',
                    bekreftelseV1: {
                        status: 'UVENTET_KILDE',
                        bekreftelse: {
                            periodeId: '784c1a8a-6acd-4776-97c7-49a5b8b86c6c',
                            bekreftelsesloesning: 'DAGPENGER',
                            id: '0a6fe68f-9961-41f8-8116-316d4cf77186',
                            svar: {
                                sendtInnAv: {
                                    tidspunkt: '2025-03-19T09:23:21.420Z',
                                    utfoertAv: {
                                        type: 'SLUTTBRUKER',
                                        id: '63846802349',
                                        sikkerhetsnivaa: 'tokenx:Level4',
                                    },
                                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:25.03.19.293-1',
                                    aarsak: 'Bekreftelse levert',
                                },
                                gjelderFra: '2025-03-19T08:57:08.231Z',
                                gjelderTil: '2025-03-19T09:02:08.231Z',
                                harJobbetIDennePerioden: true,
                                vilFortsetteSomArbeidssoeker: true,
                            },
                        },
                    },
                },
                {
                    hendelseType: 'bekreftelse_v1',
                    tidspunkt: '2025-03-19T09:23:51.375Z',
                    bekreftelseV1: {
                        status: 'GYLDIG',
                        bekreftelse: {
                            periodeId: '784c1a8a-6acd-4776-97c7-49a5b8b86c6c',
                            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                            id: '2b8f41c5-4087-4534-a783-fa4cf733c830',
                            svar: {
                                sendtInnAv: {
                                    tidspunkt: '2025-03-19T09:23:51.375Z',
                                    utfoertAv: {
                                        type: 'SLUTTBRUKER',
                                        id: '63846802349',
                                        sikkerhetsnivaa: 'tokenx:Level4',
                                    },
                                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:25.03.19.293-1',
                                    aarsak: 'Bekreftelse levert',
                                },
                                gjelderFra: '2025-03-19T09:02:08.231Z',
                                gjelderTil: '2025-03-19T09:07:08.231Z',
                                harJobbetIDennePerioden: false,
                                vilFortsetteSomArbeidssoeker: false,
                            },
                        },
                    },
                },
                {
                    hendelseType: 'periode_avsluttet_v1',
                    tidspunkt: '2025-03-19T09:23:51.670Z',
                    periodeAvsluttetV1: {
                        tidspunkt: '2025-03-19T09:23:51.670Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '63846802349',
                            sikkerhetsnivaa: 'tokenx:Level4',
                        },
                        kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
                        aarsak: '[Bekreftelse] Ønsket ikke lenger å være arbeidssøker',
                    },
                },
            ],
            avsluttet: '2025-03-19T09:23:51.670Z',
        },
    ],
};

export default tidslinjer;
