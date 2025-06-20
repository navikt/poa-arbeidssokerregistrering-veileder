import { mergeGyldigeBekreftelser } from './merge-gyldige-bekreftelser';

import { AggregerteBekreftelser, BekreftelseMedStatus, BekreftelseStatus } from '../model/bekreftelse';

import {
    AggregertPeriode,
    AggregertePerioder,
    AggregertePerioderMedBekreftelseStatus,
} from '../types/aggregerte-perioder';

const dataAggregertePerioder = [
    {
        periodeId: 'd70c0256-e3bc-470e-b3fe-f5999691fef8',
        startet: {
            tidspunkt: '2025-11-19T08:43:22.237Z',
            utfoertAv: {
                type: 'SLUTTBRUKER',
                id: '10908697745',
            },
            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.11.15.143-1',
            aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
            tidspunktFraKilde: null,
        },
        avsluttet: {
            tidspunkt: '2025-11-19T08:56:25.842Z',
            utfoertAv: {
                type: 'SYSTEM',
                id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:24.11.15.54-1',
            },
            kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
            aarsak: 'Graceperiode utløpt',
            tidspunktFraKilde: null,
        },
        opplysningerOmArbeidssoeker: [
            {
                opplysningerOmArbeidssoekerId: 'c36257ca-5cb2-4ed6-8820-8c22e55f5618',
                periodeId: 'd70c0256-e3bc-470e-b3fe-f5999691fef8',
                sendtInnAv: {
                    tidspunkt: '2025-11-19T08:44:01.611Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                        id: '10908697745',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.11.15.143-1',
                    aarsak: 'opplysning om arbeidssøker sendt inn',
                    tidspunktFraKilde: null,
                },
                jobbsituasjon: [
                    {
                        beskrivelse: 'HAR_BLITT_SAGT_OPP',
                        detaljer: {
                            stilling_styrk08: '8183',
                            stilling: 'Emballasjearbeider hermetikk - frukt, grønnsaker og nøtter',
                        },
                    },
                ],
                utdanning: {
                    nus: '4',
                    bestaatt: 'NEI',
                    godkjent: 'VET_IKKE',
                },
                helse: {
                    helsetilstandHindrerArbeid: 'NEI',
                },
                annet: {
                    andreForholdHindrerArbeid: 'JA',
                },
                profilering: {
                    profileringId: '657d1408-280c-4a99-9d1e-b57d5ea707a7',
                    periodeId: 'd70c0256-e3bc-470e-b3fe-f5999691fef8',
                    opplysningerOmArbeidssoekerId: 'c36257ca-5cb2-4ed6-8820-8c22e55f5618',
                    sendtInnAv: {
                        tidspunkt: '2024-11-19T08:44:01.886Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'paw-arbeidssoekerregisteret-monorepo-ekstern-24.11.18.41-1',
                        },
                        kilde: 'paw-arbeidssoekerregisteret-monorepo-ekstern-24.11.18.41-1',
                        aarsak: 'opplysninger-mottatt',
                    },
                    profilertTil: 'OPPGITT_HINDRINGER',
                    jobbetSammenhengendeSeksAvTolvSisteManeder: true,
                    alder: 38,
                },
            },
            {
                opplysningerOmArbeidssoekerId: 'e92f2bb8-225e-4319-bf79-fc1db422b662',
                periodeId: 'd70c0256-e3bc-470e-b3fe-f5999691fef8',
                sendtInnAv: {
                    tidspunkt: '2024-11-19T08:43:22.779Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                        id: '10908697745',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.11.15.143-1',
                    aarsak: 'opplysning om arbeidssøker sendt inn',
                    tidspunktFraKilde: null,
                },
                jobbsituasjon: [
                    {
                        beskrivelse: 'HAR_BLITT_SAGT_OPP',
                        detaljer: {
                            stilling_styrk08: '8183',
                            stilling: 'Emballasjearbeider hermetikk - frukt, grønnsaker og nøtter',
                        },
                    },
                ],
                utdanning: {
                    nus: '0',
                    bestaatt: null,
                    godkjent: null,
                },
                helse: {
                    helsetilstandHindrerArbeid: 'JA',
                },
                annet: {
                    andreForholdHindrerArbeid: 'JA',
                },
                profilering: {
                    profileringId: 'ad3fbd45-617c-4eb1-b874-0d09951f8f1f',
                    periodeId: 'd70c0256-e3bc-470e-b3fe-f5999691fef8',
                    opplysningerOmArbeidssoekerId: 'e92f2bb8-225e-4319-bf79-fc1db422b662',
                    sendtInnAv: {
                        tidspunkt: '2024-11-19T08:43:23.488Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'paw-arbeidssoekerregisteret-monorepo-ekstern-24.11.18.41-1',
                        },
                        kilde: 'paw-arbeidssoekerregisteret-monorepo-ekstern-24.11.18.41-1',
                        aarsak: 'opplysninger-mottatt',
                    },
                    profilertTil: 'OPPGITT_HINDRINGER',
                    jobbetSammenhengendeSeksAvTolvSisteManeder: true,
                    alder: 38,
                },
            },
        ],
        bekreftelser: [],
    },
    {
        periodeId: 'e3a33f8c-586e-45c6-b1e8-2e4573983608',
        startet: {
            tidspunkt: '2024-11-15T12:48:25.398Z',
            utfoertAv: {
                type: 'SLUTTBRUKER',
                id: '10908697745',
            },
            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.11.14.141-1',
            aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
            tidspunktFraKilde: null,
        },
        avsluttet: {
            tidspunkt: '2024-11-15T13:07:53.185Z',
            utfoertAv: {
                type: 'SYSTEM',
                id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:24.11.14.52-1',
            },
            kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
            aarsak: 'Graceperiode utløpt',
            tidspunktFraKilde: null,
        },
        opplysningerOmArbeidssoeker: [
            {
                opplysningerOmArbeidssoekerId: 'e2c405b4-5572-4b08-91bc-4a882b587a96',
                periodeId: 'e3a33f8c-586e-45c6-b1e8-2e4573983608',
                sendtInnAv: {
                    tidspunkt: '2024-11-15T12:48:25.578Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                        id: '10908697745',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.11.14.141-1',
                    aarsak: 'opplysning om arbeidssøker sendt inn',
                    tidspunktFraKilde: null,
                },
                jobbsituasjon: [
                    {
                        beskrivelse: 'HAR_SAGT_OPP',
                        detaljer: {
                            stilling_styrk08: '8183',
                            stilling: 'Emballasjearbeider hermetikk - frukt, grønnsaker og nøtter',
                        },
                    },
                ],
                utdanning: {
                    nus: '3',
                    bestaatt: 'JA',
                    godkjent: 'JA',
                },
                helse: {
                    helsetilstandHindrerArbeid: 'NEI',
                },
                annet: {
                    andreForholdHindrerArbeid: 'NEI',
                },
                profilering: {
                    profileringId: '2e07b7c5-2222-43c2-9fef-d096b5050b0d',
                    periodeId: 'e3a33f8c-586e-45c6-b1e8-2e4573983608',
                    opplysningerOmArbeidssoekerId: 'e2c405b4-5572-4b08-91bc-4a882b587a96',
                    sendtInnAv: {
                        tidspunkt: '2024-11-15T12:48:26.258Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'paw-arbeidssoekerregisteret-monorepo-ekstern-24.11.11.40-1',
                        },
                        kilde: 'paw-arbeidssoekerregisteret-monorepo-ekstern-24.11.11.40-1',
                        aarsak: 'opplysninger-mottatt',
                    },
                    profilertTil: 'ANTATT_GODE_MULIGHETER',
                    jobbetSammenhengendeSeksAvTolvSisteManeder: true,
                    alder: 38,
                },
            },
        ],
        bekreftelser: [
            {
                periodeId: 'e3a33f8c-586e-45c6-b1e8-2e4573983608',
                bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                svar: {
                    sendtInnAv: {
                        tidspunkt: '2024-11-15T13:00:20.993Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '10908697745',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:24.11.14.142-1',
                        aarsak: 'Bekreftelse levert',
                        tidspunktFraKilde: null,
                    },
                    gjelderFra: '2024-11-15T12:48:25.398Z',
                    gjelderTil: '2024-11-15T12:53:25.398Z',
                    harJobbetIDennePerioden: true,
                    vilFortsetteSomArbeidssoeker: true,
                },
            },
        ],
    },
    {
        periodeId: 'c9437853-e90c-482d-8ecb-1d2dad4766f2',
        startet: {
            tidspunkt: '2024-11-14T06:52:07.103Z',
            utfoertAv: {
                type: 'SLUTTBRUKER',
                id: '10908697745',
            },
            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.11.13.138-1',
            aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
            tidspunktFraKilde: null,
        },
        avsluttet: {
            tidspunkt: '2024-11-14T07:06:32.914Z',
            utfoertAv: {
                type: 'SYSTEM',
                id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:24.11.13.49-1',
            },
            kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
            aarsak: 'Graceperiode utløpt',
            tidspunktFraKilde: null,
        },
        opplysningerOmArbeidssoeker: [
            {
                opplysningerOmArbeidssoekerId: '3f345e50-7af4-43e9-b3ad-967b1f304b1e',
                periodeId: 'c9437853-e90c-482d-8ecb-1d2dad4766f2',
                sendtInnAv: {
                    tidspunkt: '2024-11-14T06:52:07.296Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                        id: '10908697745',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.11.13.138-1',
                    aarsak: 'opplysning om arbeidssøker sendt inn',
                    tidspunktFraKilde: null,
                },
                jobbsituasjon: [
                    {
                        beskrivelse: 'HAR_BLITT_SAGT_OPP',
                        detaljer: {
                            stilling_styrk08: '8183',
                            stilling: 'Emballasjearbeider hermetikk - frukt, grønnsaker og nøtter',
                        },
                    },
                ],
                utdanning: {
                    nus: '4',
                    bestaatt: 'JA',
                    godkjent: 'JA',
                },
                helse: {
                    helsetilstandHindrerArbeid: 'NEI',
                },
                annet: {
                    andreForholdHindrerArbeid: 'NEI',
                },
                profilering: {
                    profileringId: '9db53ec1-7578-4648-b3d3-562499b1ff7a',
                    periodeId: 'c9437853-e90c-482d-8ecb-1d2dad4766f2',
                    opplysningerOmArbeidssoekerId: '3f345e50-7af4-43e9-b3ad-967b1f304b1e',
                    sendtInnAv: {
                        tidspunkt: '2024-11-14T06:52:07.614Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'paw-arbeidssoekerregisteret-monorepo-ekstern-24.11.11.40-1',
                        },
                        kilde: 'paw-arbeidssoekerregisteret-monorepo-ekstern-24.11.11.40-1',
                        aarsak: 'opplysninger-mottatt',
                    },
                    profilertTil: 'ANTATT_GODE_MULIGHETER',
                    jobbetSammenhengendeSeksAvTolvSisteManeder: true,
                    alder: 38,
                },
            },
        ],
        bekreftelser: [],
    },
    {
        periodeId: '9875f6e1-342f-429e-b206-029c7832e4cb',
        startet: {
            tidspunkt: '2024-11-13T11:01:24.345Z',
            utfoertAv: {
                type: 'SLUTTBRUKER',
                id: '10908697745',
            },
            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.11.13.138-1',
            aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
            tidspunktFraKilde: null,
        },
        avsluttet: {
            tidspunkt: '2024-11-13T11:20:32.863Z',
            utfoertAv: {
                type: 'SYSTEM',
                id: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-bekreftelse-utgang:24.11.13.49-1',
            },
            kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
            aarsak: 'Graceperiode utløpt',
            tidspunktFraKilde: null,
        },
        opplysningerOmArbeidssoeker: [
            {
                opplysningerOmArbeidssoekerId: 'b0a6e597-4bcc-44c7-8679-74c38cd50767',
                periodeId: '9875f6e1-342f-429e-b206-029c7832e4cb',
                sendtInnAv: {
                    tidspunkt: '2024-11-13T11:01:26.342Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                        id: '10908697745',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.11.13.138-1',
                    aarsak: 'opplysning om arbeidssøker sendt inn',
                    tidspunktFraKilde: null,
                },
                jobbsituasjon: [
                    {
                        beskrivelse: 'HAR_SAGT_OPP',
                        detaljer: {
                            stilling_styrk08: '8183',
                            stilling: 'Emballasjearbeider hermetikk - frukt, grønnsaker og nøtter',
                        },
                    },
                ],
                utdanning: {
                    nus: '4',
                    bestaatt: 'JA',
                    godkjent: 'JA',
                },
                helse: {
                    helsetilstandHindrerArbeid: 'NEI',
                },
                annet: {
                    andreForholdHindrerArbeid: 'NEI',
                },
                profilering: {
                    profileringId: '0bc06346-6dba-4348-93b4-5e3a6c306751',
                    periodeId: '9875f6e1-342f-429e-b206-029c7832e4cb',
                    opplysningerOmArbeidssoekerId: 'b0a6e597-4bcc-44c7-8679-74c38cd50767',
                    sendtInnAv: {
                        tidspunkt: '2024-11-13T11:01:27.925Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                            id: 'paw-arbeidssoekerregisteret-monorepo-ekstern-24.11.11.40-1',
                        },
                        kilde: 'paw-arbeidssoekerregisteret-monorepo-ekstern-24.11.11.40-1',
                        aarsak: 'opplysninger-mottatt',
                    },
                    profilertTil: 'ANTATT_GODE_MULIGHETER',
                    jobbetSammenhengendeSeksAvTolvSisteManeder: true,
                    alder: 38,
                },
            },
        ],
        bekreftelser: [
            {
                periodeId: '9875f6e1-342f-429e-b206-029c7832e4cb',
                bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                svar: {
                    sendtInnAv: {
                        tidspunkt: '2024-11-13T11:09:08.928Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '10908697745',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:24.11.13.139-1',
                        aarsak: 'Bekreftelse levert',
                        tidspunktFraKilde: null,
                    },
                    gjelderFra: '2024-11-13T11:01:24.345Z',
                    gjelderTil: '2024-11-13T11:06:24.345Z',
                    harJobbetIDennePerioden: true,
                    vilFortsetteSomArbeidssoeker: true,
                },
            },
        ],
    },
    {
        periodeId: 'af7201e8-9c14-4597-ab43-b848acb00d6b',
        startet: {
            tidspunkt: '2024-11-13T09:19:28.896Z',
            utfoertAv: {
                type: 'SLUTTBRUKER',
                id: '10908697745',
            },
            kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.11.13.138-1',
            aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
            tidspunktFraKilde: null,
        },
        avsluttet: {
            tidspunkt: '2024-11-13T09:39:05.384Z',
            utfoertAv: {
                type: 'SLUTTBRUKER',
                id: '10908697745',
            },
            kilde: 'paw.arbeidssoekerregisteret.bekreftelse-utgang',
            aarsak: "Svarte NEI på spørsmål 'Vil du fortsatt være registrert som arbeidssøker?'",
            tidspunktFraKilde: null,
        },
        opplysningerOmArbeidssoeker: [
            {
                opplysningerOmArbeidssoekerId: 'e06e706d-7686-408d-8f81-301f39467875',
                periodeId: 'af7201e8-9c14-4597-ab43-b848acb00d6b',
                sendtInnAv: {
                    tidspunkt: '2024-11-13T09:19:29.094Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                        id: '10908697745',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.11.13.138-1',
                    aarsak: 'opplysning om arbeidssøker sendt inn',
                },
                jobbsituasjon: [
                    {
                        beskrivelse: 'USIKKER_JOBBSITUASJON',
                        detaljer: {},
                    },
                ],
                utdanning: {
                    nus: '0',
                    bestaatt: null,
                    godkjent: null,
                },
                helse: {
                    helsetilstandHindrerArbeid: 'NEI',
                },
                annet: {
                    andreForholdHindrerArbeid: 'NEI',
                },
                profilering: {
                    profileringId: '528d18b4-bc77-4862-a6a4-d431c04068ee',
                    periodeId: 'af7201e8-9c14-4597-ab43-b848acb00d6b',
                    opplysningerOmArbeidssoekerId: 'e06e706d-7686-408d-8f81-301f39467875',
                    sendtInnAv: {
                        tidspunkt: '2024-11-13T09:19:29.619Z',
                        utfoertAv: {
                            type: 'SYSTEM',
                        },
                        kilde: 'paw-arbeidssoekerregisteret-monorepo-ekstern-24.11.11.40-1',
                        aarsak: 'opplysninger-mottatt',
                    },
                    profilertTil: 'ANTATT_BEHOV_FOR_VEILEDNING',
                    jobbetSammenhengendeSeksAvTolvSisteManeder: true,
                    alder: 38,
                },
            },
        ],
        bekreftelser: [
            {
                periodeId: 'af7201e8-9c14-4597-ab43-b848acb00d6b',
                bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                svar: {
                    sendtInnAv: {
                        tidspunkt: '2024-11-13T09:39:03.066Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '10908697745',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:24.11.13.139-1',
                        aarsak: 'Bekreftelse levert',
                        tidspunktFraKilde: null,
                    },
                    gjelderFra: '2024-11-13T09:34:28.896Z',
                    gjelderTil: '2024-11-13T09:39:28.896Z',
                    harJobbetIDennePerioden: true,
                    vilFortsetteSomArbeidssoeker: false,
                },
            },
            {
                periodeId: 'af7201e8-9c14-4597-ab43-b848acb00d6b',
                bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                svar: {
                    sendtInnAv: {
                        tidspunkt: '2024-11-13T09:36:33.465Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '10908697745',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:24.11.13.139-1',
                        aarsak: 'Bekreftelse levert',
                        tidspunktFraKilde: null,
                    },
                    gjelderFra: '2024-11-13T09:29:28.896Z',
                    gjelderTil: '2024-11-13T09:34:28.896Z',
                    harJobbetIDennePerioden: true,
                    vilFortsetteSomArbeidssoeker: false,
                },
            },
            {
                periodeId: 'af7201e8-9c14-4597-ab43-b848acb00d6b',
                bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                svar: {
                    sendtInnAv: {
                        tidspunkt: '2024-11-13T09:36:07.810Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '10908697745',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:24.11.13.139-1',
                        aarsak: 'Bekreftelse levert',
                        tidspunktFraKilde: null,
                    },
                    gjelderFra: '2024-11-13T09:24:28.896Z',
                    gjelderTil: '2024-11-13T09:29:28.896Z',
                    harJobbetIDennePerioden: true,
                    vilFortsetteSomArbeidssoeker: false,
                },
            },
            {
                periodeId: 'af7201e8-9c14-4597-ab43-b848acb00d6b',
                bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
                svar: {
                    sendtInnAv: {
                        tidspunkt: '2024-11-13T09:23:43.001Z',
                        utfoertAv: {
                            type: 'SLUTTBRUKER',
                            id: '10908697745',
                        },
                        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:24.11.13.139-1',
                        aarsak: 'Bekreftelse levert',
                        tidspunktFraKilde: null,
                    },
                    gjelderFra: '2024-11-13T09:19:28.896Z',
                    gjelderTil: '2024-11-13T09:24:28.896Z',
                    harJobbetIDennePerioden: true,
                    vilFortsetteSomArbeidssoeker: true,
                },
            },
        ],
    },
] as AggregertePerioder;

const dataBekreftelserMedStatus = {
    'd70c0256-e3bc-470e-b3fe-f5999691fef8': [],
    'e3a33f8c-586e-45c6-b1e8-2e4573983608': [
        {
            periodeId: 'e3a33f8c-586e-45c6-b1e8-2e4573983608',
            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
            status: BekreftelseStatus.UVENTET_KILDE,
            svar: {
                sendtInnAv: {
                    tidspunkt: '2024-11-15T13:00:20.993Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                        id: '10908697745',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:24.11.14.142-1',
                    aarsak: 'Bekreftelse levert',
                    tidspunktFraKilde: null,
                },
                gjelderFra: '2024-11-15T12:48:25.398Z',
                gjelderTil: '2024-11-15T12:53:25.398Z',
                harJobbetIDennePerioden: true,
                vilFortsetteSomArbeidssoeker: true,
            },
        },
        {
            periodeId: 'e3a33f8c-586e-45c6-b1e8-2e4573983608',
            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
            status: BekreftelseStatus.GYLDIG,
            svar: {
                sendtInnAv: {
                    tidspunkt: '2024-11-16T13:00:20.993Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                        id: '10908697745',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:24.11.14.142-1',
                    aarsak: 'Bekreftelse levert',
                    tidspunktFraKilde: null,
                },
                gjelderFra: '2024-11-16T12:48:25.398Z',
                gjelderTil: '2024-11-16T12:53:25.398Z',
                harJobbetIDennePerioden: true,
                vilFortsetteSomArbeidssoeker: true,
            },
        },
    ],
    'c9437853-e90c-482d-8ecb-1d2dad4766f2': [
        {
            periodeId: 'c9437853-e90c-482d-8ecb-1d2dad4766f2',
            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
            status: BekreftelseStatus.UTENFOR_PERIODE,
            svar: {
                sendtInnAv: {
                    tidspunkt: '2024-11-16T13:00:20.993Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                        id: '10908697745',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:24.11.14.142-1',
                    aarsak: 'Bekreftelse levert',
                    tidspunktFraKilde: null,
                },
                gjelderFra: '2024-11-16T12:48:25.398Z',
                gjelderTil: '2024-11-16T12:53:25.398Z',
                harJobbetIDennePerioden: true,
                vilFortsetteSomArbeidssoeker: true,
            },
        },
    ],
    '9875f6e1-342f-429e-b206-029c7832e4cb': [
        {
            periodeId: '9875f6e1-342f-429e-b206-029c7832e4cb',
            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
            status: BekreftelseStatus.GYLDIG,
            svar: {
                sendtInnAv: {
                    tidspunkt: '2024-11-13T11:09:08.928Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                        id: '10908697745',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:24.11.13.139-1',
                    aarsak: 'Bekreftelse levert',
                    tidspunktFraKilde: null,
                },
                gjelderFra: '2024-11-13T11:01:24.345Z',
                gjelderTil: '2024-11-13T11:06:24.345Z',
                harJobbetIDennePerioden: true,
                vilFortsetteSomArbeidssoeker: true,
            },
        },
    ],
    'af7201e8-9c14-4597-ab43-b848acb00d6b': [
        {
            periodeId: 'af7201e8-9c14-4597-ab43-b848acb00d6b',
            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
            status: BekreftelseStatus.GYLDIG,
            svar: {
                sendtInnAv: {
                    tidspunkt: '2024-11-13T09:39:03.066Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                        id: '10908697745',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:24.11.13.139-1',
                    aarsak: 'Bekreftelse levert',
                    tidspunktFraKilde: null,
                },
                gjelderFra: '2024-11-13T09:34:28.896Z',
                gjelderTil: '2024-11-13T09:39:28.896Z',
                harJobbetIDennePerioden: true,
                vilFortsetteSomArbeidssoeker: false,
            },
        },
        {
            periodeId: 'af7201e8-9c14-4597-ab43-b848acb00d6b',
            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
            status: BekreftelseStatus.UVENTET_KILDE,
            svar: {
                sendtInnAv: {
                    tidspunkt: '2024-11-13T09:36:33.465Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                        id: '10908697745',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:24.11.13.139-1',
                    aarsak: 'Bekreftelse levert',
                    tidspunktFraKilde: null,
                },
                gjelderFra: '2024-11-13T09:29:28.896Z',
                gjelderTil: '2024-11-13T09:34:28.896Z',
                harJobbetIDennePerioden: true,
                vilFortsetteSomArbeidssoeker: false,
            },
        },
        {
            periodeId: 'af7201e8-9c14-4597-ab43-b848acb00d6b',
            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
            status: BekreftelseStatus.GYLDIG,
            svar: {
                sendtInnAv: {
                    tidspunkt: '2024-11-13T09:36:07.810Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                        id: '10908697745',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:24.11.13.139-1',
                    aarsak: 'Bekreftelse levert',
                    tidspunktFraKilde: null,
                },
                gjelderFra: '2024-11-13T09:24:28.896Z',
                gjelderTil: '2024-11-13T09:29:28.896Z',
                harJobbetIDennePerioden: true,
                vilFortsetteSomArbeidssoeker: false,
            },
        },
        {
            periodeId: 'af7201e8-9c14-4597-ab43-b848acb00d6b',
            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
            status: BekreftelseStatus.GYLDIG,
            svar: {
                sendtInnAv: {
                    tidspunkt: '2024-11-13T09:23:43.001Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                        id: '10908697745',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:24.11.13.139-1',
                    aarsak: 'Bekreftelse levert',
                    tidspunktFraKilde: null,
                },
                gjelderFra: '2024-11-13T09:19:28.896Z',
                gjelderTil: '2024-11-13T09:24:28.896Z',
                harJobbetIDennePerioden: true,
                vilFortsetteSomArbeidssoeker: true,
            },
        },
    ],
};

describe('mergeGyldigeBekreftelser', () => {
    const mergedeData = mergeGyldigeBekreftelser(dataAggregertePerioder, dataBekreftelserMedStatus) as any;

    it('Vi har 5 arbeidssøkerperioder', () => {
        expect(mergedeData.length).toEqual(5);
    });

    it('Vi har 0 bekreftelser i første periode', () => {
        expect(mergedeData[0].bekreftelser.length).toEqual(0);
    });

    it('Vi har 1 bekreftelse i andre periode', () => {
        expect(mergedeData[1].bekreftelser.length).toEqual(1);
    });

    it('Vi har 0 bekreftelser i tredje periode', () => {
        expect(mergedeData[2].bekreftelser.length).toEqual(0);
    });

    it('Vi har 1 bekreftelse i fjerde periode', () => {
        expect(mergedeData[3].bekreftelser.length).toEqual(1);
    });

    it('Vi har 3 bekreftelser i femte periode', () => {
        expect(mergedeData[4].bekreftelser.length).toEqual(3);
    });
});
