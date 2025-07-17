import { BekreftelseStatus } from '@navikt/arbeidssokerregisteret-utils';
import type { NextApiRequest, NextApiResponse } from 'next';

const bekreftelserMedStatus = (req: NextApiRequest, res: NextApiResponse): void => {
    res.json(data);
};

const data = {
    bekreftelser: [
        {
            status: BekreftelseStatus.UTENFOR_PERIODE,
            bekreftelse: {
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
        },
        {
            status: BekreftelseStatus.GYLDIG,
            bekreftelse: {
                periodeId: 'e3a33f8c-586e-45c6-b1e8-2e4573983608',
                bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
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
        },
        {
            status: BekreftelseStatus.UVENTET_KILDE,
            bekreftelse: {
                periodeId: 'c9437853-e90c-482d-8ecb-1d2dad4766f2',
                bekreftelsesloesning: 'ARBEIDSSOEKERREGISTERET',
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
        },
        {
            status: BekreftelseStatus.GYLDIG,
            bekreftelse: {
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
        },
        {
            status: BekreftelseStatus.GYLDIG,
            bekreftelse: {
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
        },
        {
            status: BekreftelseStatus.UTENFOR_PERIODE,
            bekreftelse: {
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
        },
        {
            status: BekreftelseStatus.GYLDIG,
            bekreftelse: {
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
        },
        {
            status: BekreftelseStatus.GYLDIG,
            bekreftelse: {
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
        },
    ],
};

export default bekreftelserMedStatus;
