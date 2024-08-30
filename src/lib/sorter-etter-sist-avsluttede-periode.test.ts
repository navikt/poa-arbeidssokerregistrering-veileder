import { sorterEtterSistAvsluttedePeriode } from './sorter-etter-sist-avsluttede-periode';

describe('sorterEtterSistAvsluttedePeriode', () => {
    it('setter åpne perioder først', () => {
        const result = [
            {
                periodeId: '0',
                startet: {
                    tidspunkt: '2024-05-07T08:32:26.915Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.04.25.141-1',
                    aarsak: 'Er over 18 år, er bosatt i Norge i hendhold Folkeregisterloven',
                },
                avsluttet: {
                    tidspunkt: '2024-05-14T11:42:26.902Z',
                    utfoertAv: {
                        type: 'VEILEDER',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.04.25.141-1',
                    aarsak: 'Ansatt har tilgang til bruker',
                },
            },
            {
                periodeId: '1',
                startet: {
                    tidspunkt: '2024-05-14T11:42:43.771Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.04.25.141-1',
                    aarsak: 'Er over 18 år, er bosatt i Norge i hendhold Folkeregisterloven',
                },
                avsluttet: null,
            },
        ].sort(sorterEtterSistAvsluttedePeriode);
        expect(result[0].periodeId).toBe('1');
    });

    it('sorterer etter nyeste avsluttet tidspunkt', () => {
        const result = [
            {
                periodeId: '0',
                startet: {
                    tidspunkt: '2021-01-17T08:32:26.915Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.04.25.141-1',
                    aarsak: 'Er over 18 år, er bosatt i Norge i hendhold Folkeregisterloven',
                },
                avsluttet: {
                    tidspunkt: '2022-09-29T11:42:26.902Z',
                    utfoertAv: {
                        type: 'VEILEDER',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.04.25.141-1',
                    aarsak: 'Ansatt har tilgang til bruker',
                },
            },
            {
                periodeId: '1',
                startet: {
                    tidspunkt: '2024-05-07T08:32:26.915Z',
                    utfoertAv: {
                        type: 'SLUTTBRUKER',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.04.25.141-1',
                    aarsak: 'Er over 18 år, er bosatt i Norge i hendhold Folkeregisterloven',
                },
                avsluttet: {
                    tidspunkt: '2024-05-14T11:42:26.902Z',
                    utfoertAv: {
                        type: 'VEILEDER',
                    },
                    kilde: 'europe-north1-docker.pkg.dev/nais-management-233d/paw/paw-arbeidssokerregisteret-api-inngang:24.04.25.141-1',
                    aarsak: 'Ansatt har tilgang til bruker',
                },
            },
        ].sort(sorterEtterSistAvsluttedePeriode);
        expect(result[0].periodeId).toBe('1');
    });
});
