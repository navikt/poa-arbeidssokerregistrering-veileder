import { Alert, BodyLong, Heading } from '@navikt/ds-react';
import KopierTraceId from './kopierTraceId';

interface FeilmeldingProps {
    feilmelding?: any;
}

function Feilmelding(props: FeilmeldingProps) {
    const { feilmelding } = props;
    const { aarsakTilAvvisning } = feilmelding || {};
    const duManglerTilgang = aarsakTilAvvisning && aarsakTilAvvisning.regel === 'ANSATT_IKKE_TILGANG';

    if (!feilmelding) return null;

    return (
        <Alert variant="warning" className="mb-8">
            <Heading level="1" size="small" className="mb-4">
                {duManglerTilgang
                    ? 'Du kan ikke registrere denne personen som arbeidssøker'
                    : 'Personen kan ikke registrere seg selv som arbeidssøker på nav.no'}
            </Heading>
            {aarsakTilAvvisning && <BodyLong spacing>Årsak: {aarsakTilAvvisning.beskrivelse}</BodyLong>}
            <KopierTraceId traceId={feilmelding.traceId} />
        </Alert>
    );
}

interface KanRegistreresProps {
    feilmelding?: any;
    kanStarteArbeidssoekerperiode: boolean;
}

function KanRegistreresSomArbeidssoeker(props: KanRegistreresProps) {
    const { feilmelding, kanStarteArbeidssoekerperiode } = props;

    if (kanStarteArbeidssoekerperiode) return null;

    return <Feilmelding feilmelding={feilmelding} />;
}

export default KanRegistreresSomArbeidssoeker;
