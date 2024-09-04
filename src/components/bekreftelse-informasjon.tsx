import { BodyLong, Box, Button, Heading, ReadMore } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { formaterDato } from '../lib/date-utils';

const aktivPeriode = {
    periodeId: '1',
    rapporteringsId: '2',
    gjelderFra: '2024-09-01T10:36:40.474Z',
    gjelderTil: '2024-09-13T10:36:40.474Z',
};

const historiskePerioderListe = [
    {
        periodeId: '11',
        rapporteringsId: '22',
        gjelderFra: '2023-01-01T10:36:40.474Z',
        gjelderTil: '2023-02-13T10:36:40.474Z',
    },
    {
        periodeId: '112',
        rapporteringsId: '221',
        gjelderFra: '2023-03-01T10:36:40.474Z',
        gjelderTil: '2023-04-13T10:36:40.474Z',
    },
    {
        periodeId: '113',
        rapporteringsId: '222',
        gjelderFra: '2023-05-01T10:36:40.474Z',
        gjelderTil: '2023-06-13T10:36:40.474Z',
    },
    {
        periodeId: '114',
        rapporteringsId: '223',
        gjelderFra: '2023-07-01T10:36:40.474Z',
        gjelderTil: '2023-08-13T10:36:40.474Z',
    },
    {
        periodeId: '115',
        rapporteringsId: '225',
        gjelderFra: '2023-08-01T10:36:40.474Z',
        gjelderTil: '2023-09-13T10:36:40.474Z',
    },
    {
        periodeId: '116',
        rapporteringsId: '226',
        gjelderFra: '2023-10-01T10:36:40.474Z',
        gjelderTil: '2023-11-13T10:36:40.474Z',
    },
    {
        periodeId: '117',
        rapporteringsId: '227',
        gjelderFra: '2024-02-01T10:36:40.474Z',
        gjelderTil: '2024-03-13T10:36:40.474Z',
    },
];

const HistoriskePerioder = ({ perioder }: { perioder: any[] }) => {
    const [visAlle, settVisAlle] = useState<boolean>(false);

    if (perioder.length == 0) {
        return null;
    }

    const visVisAlleLenke = perioder.length > 5 && !visAlle;

    return (
        <ReadMore header={'Vis tidligere bekreftede perioder'}>
            <ul>
                {perioder.map((p, idx) => {
                    if (idx > 4 && !visAlle) {
                        return null;
                    }

                    return (
                        <li key={p.periodeId}>
                            Fra {formaterDato(p.gjelderFra)} - {formaterDato(p.gjelderTil)}
                        </li>
                    );
                })}
            </ul>
            {visVisAlleLenke && (
                <Button variant={'tertiary'} size={'xsmall'} onClick={() => settVisAlle(true)}>
                    Vis alle
                </Button>
            )}
        </ReadMore>
    );
};

function BekreftelseInformasjon() {
    const [tilgjengeligeRapporter, settTilgjengeligeRapporter] = useState<any>();
    const [historiskePerioder, settHistoriskePerioder] = useState<any>([]);

    const router = useRouter();

    useEffect(() => {
        settTilgjengeligeRapporter(aktivPeriode);
        settHistoriskePerioder(
            historiskePerioderListe.sort((a, b) => {
                return new Date(b.gjelderTil).getTime() - new Date(a.gjelderTil).getTime();
            }),
        );
    }, []);

    return (
        <Box>
            <Heading level="1" size="small">
                Bekreftelse
            </Heading>
            {tilgjengeligeRapporter && (
                <>
                    <BodyLong>
                        Ubekreftet arbeidssøkerstatus for perioden fra {formaterDato(tilgjengeligeRapporter.gjelderFra)}{' '}
                        - {formaterDato(tilgjengeligeRapporter.gjelderTil)}
                    </BodyLong>
                    <Button variant={'secondary-neutral'} onClick={() => router.push('/bekreftelse')}>
                        Bekreft arbeidssøkerperiode
                    </Button>
                </>
            )}
            {!tilgjengeligeRapporter && <BodyLong>Ingen ubekreftede perioder.</BodyLong>}
            <HistoriskePerioder perioder={historiskePerioder} />
        </Box>
    );
}

export default BekreftelseInformasjon;
