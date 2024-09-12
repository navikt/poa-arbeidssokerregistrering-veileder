import { Alert, BodyLong, Heading, ReadMore } from '@navikt/ds-react';
import KopierTraceId from './kopierTraceId';

interface FeilmeldingProps {
    feilmelding?: any;
}

function Feilmelding(props: FeilmeldingProps) {
    const { feilmelding } = props;
    const { aarsakTilAvvisning } = feilmelding || {};
    const duManglerTilgang = aarsakTilAvvisning && aarsakTilAvvisning.regel === 'ANSATT_IKKE_TILGANG_TIL_BRUKER';

    if (!feilmelding) return null;
    return (
        <Alert variant="warning" className="mb-8">
            <Heading level="1" size="small" className="mb-4">
                {duManglerTilgang
                    ? 'Du kan ikke registrere denne personen som arbeidssøker'
                    : 'Personen må registreres av en veileder etter at en vurdering er gjort'}
            </Heading>
            {aarsakTilAvvisning && (
                <BodyLong spacing>
                    <strong>Årsak:</strong> {aarsakTilAvvisning.beskrivelse}
                </BodyLong>
            )}
            <ReadMore header="Mener du dette er feil?">
                <KopierTraceId traceId={feilmelding.traceId} />
            </ReadMore>
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
