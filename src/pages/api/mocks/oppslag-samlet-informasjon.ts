import type { NextApiRequest, NextApiResponse } from 'next';

const data = {
    arbeidssoekerperioder: [
        {
            periodeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            startet: {
                tidspunkt: '2021-09-29T11:22:33.444Z',
                utfoertAv: {
                    type: 'UKJENT_VERDI',
                    id: '12345678910',
                },
                kilde: 'string',
                aarsak: 'string',
                tidspunktFraKilde: {
                    tidspunkt: '2021-09-29T11:20:33.444Z',
                    avviksType: 'UKJENT_VERDI',
                },
            },
            avsluttet: null,
            // avsluttet: {
            //     tidspunkt: '2024-05-14T11:42:26.902Z',
            //     utfoertAv: {
            //         type: 'VEILEDER',
            //     },
            //     kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.04.25.141-1',
            //     aarsak: 'Ansatt har tilgang til bruker',
            // },
        },
    ],
    opplysningerOmArbeidssoeker: [
        {
            opplysningerOmArbeidssoekerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            periodeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            sendtInnAv: {
                tidspunkt: '2021-09-29T11:22:33.444Z',
                utfoertAv: {
                    type: 'UKJENT_VERDI',
                    id: '12345678910',
                },
                kilde: 'string',
                aarsak: 'string',
                tidspunktFraKilde: {
                    tidspunkt: '2021-09-29T11:20:33.444Z',
                    avviksType: 'UKJENT_VERDI',
                },
            },
            utdanning: {
                nus: 'string',
                bestaatt: 'JA',
                godkjent: 'JA',
            },
            helse: {
                helsetilstandHindrerArbeid: 'JA',
            },
            annet: {
                andreForholdHindrerArbeid: 'JA',
            },
            jobbsituasjon: [
                {
                    beskrivelse: 'UKJENT_VERDI',
                    detaljer: {
                        prosent: '25',
                    },
                },
            ],
        },
    ],
    profilering: [
        {
            profileringId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            periodeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            opplysningerOmArbeidssoekerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            sendtInnAv: {
                tidspunkt: '2021-09-29T11:22:33.444Z',
                utfoertAv: {
                    type: 'UKJENT_VERDI',
                    id: '12345678910',
                },
                kilde: 'string',
                aarsak: 'string',
                tidspunktFraKilde: {
                    tidspunkt: '2021-09-29T11:20:33.444Z',
                    avviksType: 'UKJENT_VERDI',
                },
            },
            profilertTil: 'UKJENT_VERDI',
            jobbetSammenhengendeSeksAvTolvSisteManeder: true,
            alder: 0,
        },
    ],
    bekreftelser: [
        {
            periodeId: '54a85267-5607-43e1-903b-bd0fa313fda5',
            bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
            svar: {
                sendtInnAv: {
                    tidspunkt: '2024-10-23T11:58:03.470Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                        id: '13915299967',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssoekerregisteret-api-bekreftelse:24.10.23.114-1',
                    aarsak: 'Bekreftelse levert',
                    tidspunktFraKilde: null,
                },
                gjelderFra: '2024-10-23T11:57:11.536Z',
                gjelderTil: '2024-10-21T12:25:11.536Z',
                harJobbetIDennePerioden: false,
                vilFortsetteSomArbeidssoeker: true,
            },
        },
    ],
};

const oppslagSamletInformasjon = (req: NextApiRequest, res: NextApiResponse): void => {
    res.json(data);
};

export default oppslagSamletInformasjon;
