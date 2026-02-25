import { Alert, BodyShort, Box, Heading } from '@navikt/ds-react';
import { use } from 'react';
import { Bekreftelse } from '@/app/(forside)/components/Bekreftelse';
import { HistorikkLenke } from '@/app/(forside)/components/HistorikkLenke';
import { Opplysninger } from '@/app/(forside)/components/Opplysninger';
import { TidslinjerLenke } from '@/app/(forside)/components/TidslinjerLenke';
import type { BekreftelseApiResult } from '@/app/lib/bekreftelser/bekreftelse';
import type { SnapshotResult } from '@/app/lib/oppslag/snapshot';
import { mapUtfoertAvType } from '@/components/forside/mapUtfoertAvType';
import { prettyPrintDatoOgKlokkeslett } from '@/lib/date-utils';

type ForsideProps = {
    snapshotPromise: Promise<SnapshotResult>;
    bekreftelserPromise: Promise<BekreftelseApiResult>;
};

function Forside({ snapshotPromise, bekreftelserPromise }: ForsideProps) {
    const { snapshot, error: snapshotError } = use(snapshotPromise);
    const { bekreftelser, error: bekreftelserError } = use(bekreftelserPromise);

    // !TODO: returner noe som gir mening
    if (snapshotError || bekreftelserError) return 'error';
    if (!snapshot) return 'mangeler data';

    return (
        <div>
            <Alert variant={'info'} className={'mb-4'}>
                <Heading level={'3'} size={'small'}>
                    Personen er registrert som arbeidssøker
                </Heading>
                <BodyShort textColor={'subtle'}>
                    Registrert {prettyPrintDatoOgKlokkeslett(snapshot.startet.tidspunkt)} av{' '}
                    {mapUtfoertAvType(snapshot.startet.sendtInnAv.utfoertAv.type)}
                </BodyShort>
            </Alert>
            <Opplysninger
                opplysninger={snapshot.opplysning}
                sisteArbeidssoekerperiodeId={snapshot.id}
                egenvurderinger={snapshot.egenvurdering}
            />
            <Bekreftelse antallTilgjengeligBekreftelser={bekreftelser?.length} />
            <Box className='flex justify-between'>
                <HistorikkLenke />
                <TidslinjerLenke />
            </Box>
        </div>
    );
}

export { Forside };
