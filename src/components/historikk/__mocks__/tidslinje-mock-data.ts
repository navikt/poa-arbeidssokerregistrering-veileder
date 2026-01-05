import {
    Tidslinje,
    JaEllerNei,
    UtdanningGodkjentValg,
    ProfilertTil,
    BekreftelseStatus,
    HendelseType,
    TidslinjerResponse,
    OpplysningerOmArbeidssokerTidslinjer,
    BekreftelseHendelse,
    ArbeidssokerperiodeMetadata,
} from '@navikt/arbeidssokerregisteret-utils';

export const opplysningsHendelse: OpplysningerOmArbeidssokerTidslinjer = {
    opplysningerOmArbeidssoekerId: 'b6ebf6f1-bdf5-4455-93a9-4ed535902201',
    periodeId: 'fd229ec7-ff37-40f0-83eb-65fb236f4cb6',
    sendtInnAv: {
        tidspunkt: '2025-09-12T10:36:33.390Z',
        utfoertAv: {
            type: 'VEILEDER',
            id: 'Z994498',
        },
        kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.09.12.371-1',
        aarsak: 'opplysning om arbeidssøker sendt inn',
    },
    utdanning: {
        nus: '3',
        bestaatt: JaEllerNei.JA,
        godkjent: UtdanningGodkjentValg.JA,
    },
    helse: {
        helsetilstandHindrerArbeid: JaEllerNei.JA,
    },
    jobbsituasjon: {
        beskrivelser: [
            {
                beskrivelse: 'IKKE_VAERT_I_JOBB_SISTE_2_AAR',
                detaljer: {
                    stilling: 'Annen stilling',
                    stilling_styrk08: '00',
                },
            },
        ],
    },
    annet: {
        andreForholdHindrerArbeid: JaEllerNei.JA,
    },
};

export const bekreftelseHendelse: BekreftelseHendelse = {
    status: BekreftelseStatus.GYLDIG,
    bekreftelse: {
        periodeId: '60bea570-6acb-4fc8-b508-1aa6ed99fe46',
        bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
        svar: {
            sendtInnAv: {
                tidspunkt: '2025-09-01T05:24:59.291Z',
                utfoertAv: {
                    type: 'SLUTTBRUKER',
                    id: '24849098329',
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
};

export const avsluttetPeriode: ArbeidssokerperiodeMetadata = {
    tidspunkt: '2025-09-20T14:22:10.123Z',
    utfoertAv: {
        type: 'SLUTTBRUKER',
        id: '24849098329',
    },
    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.04.29.318-1',
    aarsak: '[Bekreftelse] Ønsket ikke lenger å være arbeidssøker',
    tidspunktFraKilde: null,
};

export const sampleTidslinje: Tidslinje = {
    periodeId: 'fd229ec7-ff37-40f0-83eb-65fb236f4cb6',
    identitetsnummer: '24849098329',
    startet: '2025-09-12T10:36:33.501Z',
    avsluttet: null,
    hendelser: [
        {
            hendelseType: HendelseType.opplysninger_v4,
            tidspunkt: '2025-09-12T10:36:33.390Z',
            opplysningerV4: {
                ...opplysningsHendelse,
            },
        },
        {
            hendelseType: HendelseType.periode_startet_v1,
            tidspunkt: '2025-09-12T10:36:33.501Z',
            periodeStartetV1: {
                tidspunkt: '2025-09-12T10:36:33.501Z',
                utfoertAv: {
                    type: 'VEILEDER',
                    id: 'Z994498',
                },
                kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.09.12.371-1',
                aarsak: 'Er over 18 år, er bosatt i Norge i henhold Folkeregisterloven',
                tidspunktFraKilde: null,
            },
        },
        {
            hendelseType: HendelseType.profilering_v1,
            tidspunkt: '2025-09-12T10:36:34.097Z',
            profileringV1: {
                profileringId: 'fd1afda2-118f-4f43-8791-0ebe8b0589d4',
                periodeId: 'fd229ec7-ff37-40f0-83eb-65fb236f4cb6',
                opplysningerOmArbeidssoekerId: 'b6ebf6f1-bdf5-4455-93a9-4ed535902201',
                sendtInnAv: {
                    tidspunkt: '2025-09-12T10:36:34.097Z',
                    utfoertAv: {
                        type: 'SYSTEM',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-profilering:25.09.12.192-1',
                    aarsak: 'opplysninger-mottatt',
                },
                profilertTil: ProfilertTil.ANTATT_BEHOV_FOR_VEILEDNING,
                jobbetSammenhengendeSeksAvTolvSisteManeder: true,
                alder: 25,
            },
        },
        {
            hendelseType: HendelseType.bekreftelse_v1,
            tidspunkt: '2025-09-12T10:36:35.097Z',
            bekreftelseV1: {
                ...bekreftelseHendelse,
            },
        },
    ],
};

export const avsluttetTidslinje: Tidslinje = {
    ...sampleTidslinje,
    avsluttet: '2025-09-20T14:22:10.123Z',
    hendelser: [
        ...sampleTidslinje.hendelser,
        {
            hendelseType: HendelseType.periode_avsluttet_v1,
            tidspunkt: '2025-09-20T14:22:10.123Z',
            periodeAvsluttetV1: {
                ...avsluttetPeriode,
            },
        },
    ],
};

export const avsluttetTidslinjeVeileder: Tidslinje = {
    ...sampleTidslinje,
    avsluttet: '2025-09-20T14:22:10.123Z',
    hendelser: [
        ...sampleTidslinje.hendelser,
        {
            hendelseType: HendelseType.periode_avsluttet_v1,
            tidspunkt: '2025-09-20T14:22:10.123Z',
            periodeAvsluttetV1: {
                tidspunkt: '2025-09-20T14:22:10.123Z',
                utfoertAv: {
                    type: 'VEILEDER',
                    id: 'Z994498',
                },
                kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:25.09.12.371-1',
                aarsak: 'Stopp av periode',
                tidspunktFraKilde: null,
            },
        },
    ],
};

export const tidslinjeMedKunOpplysninger: Tidslinje = {
    ...sampleTidslinje,
    hendelser: [sampleTidslinje.hendelser[0]],
};

export const tidslinjeMedKunBekreftelse: Tidslinje = {
    ...sampleTidslinje,
    hendelser: [sampleTidslinje.hendelser[3]],
};
