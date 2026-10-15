import { Alert, Box } from '@navikt/ds-react';
import { use } from 'react';
import { Bekreftelse } from '@/app/(forside)/components/Bekreftelse';
import { HistorikkLenke } from '@/app/(forside)/components/HistorikkLenke';
import { Opplysninger } from '@/app/(forside)/components/Opplysninger';
import { TidslinjerLenke } from '@/app/(forside)/components/TidslinjerLenke';
import { ManglerTilganger } from '@/components/ManglerTilganger';
import type { BekreftelseApiResult } from '@/lib/api/bekreftelse';
import type { KartleggingApiEnkeltpersonKompaktResult } from '@/lib/api/kartlegging-enkeltperson';
import type { SnapshotResult } from '@/lib/api/oppslag-snapshot';
import { IkkeAktivPeriode } from './IkkeAktivPeriode';
import { KartleggingEnkeltperson } from './KartleggingEnkeltperson';

type ForsideProps = {
    snapshotPromise: Promise<SnapshotResult>;
    bekreftelserPromise: Promise<BekreftelseApiResult>;
    kartleggingEnkeltpersonPromise: Promise<KartleggingApiEnkeltpersonKompaktResult | null>;
};

function Forside({ snapshotPromise, bekreftelserPromise, kartleggingEnkeltpersonPromise }: ForsideProps) {
    const { snapshot, error: snapshotError, notFound, manglerTilgang: manglerSnapTilgang } = use(snapshotPromise);
    const {
        bekreftelser,
        error: bekreftelserError,
        manglerTilgang: manglerBekreftelseTilgang,
    } = use(bekreftelserPromise);
    const kartleggingResult = use(kartleggingEnkeltpersonPromise);
    const arbeidssoekere = kartleggingResult?.arbeidssoekere;
    const arbeidssoeker = arbeidssoekere ? arbeidssoekere[0] : null;

    if (manglerBekreftelseTilgang || manglerSnapTilgang || kartleggingResult?.manglerTilgang) {
        return <ManglerTilganger />;
    }

    if (snapshotError || bekreftelserError || kartleggingResult?.error) {
        return <Alert variant={'error'}>Noe gikk dessverre galt. Prøv igjen senere</Alert>;
    }

    if (!snapshot || snapshot.avsluttet || notFound) {
        return <IkkeAktivPeriode avsluttetHendelse={snapshot?.avsluttet} />;
    }

    return (
        <div>
            <KartleggingEnkeltperson arbeidssoker={arbeidssoeker ?? null} snapshot={snapshot} />
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
