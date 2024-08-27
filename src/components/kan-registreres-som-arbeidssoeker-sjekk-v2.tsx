import { Alert, BodyLong, Heading, ReadMore, List } from '@navikt/ds-react';
import KopierTraceId from './kopierTraceId';

interface FeilmeldingProps {
    feilmelding?: any;
}

function Feilmelding(props: FeilmeldingProps) {
    const { feilmelding } = props;
    const { aarsakTilAvvisning } = feilmelding || {};
    const aarsaker = aarsakTilAvvisning.regler ? aarsakTilAvvisning.regler.map((regel) => regel.id) : [];
    const duManglerTilgang = aarsakTilAvvisning && aarsaker.includes('ANSATT_IKKE_TILGANG');

    if (!feilmelding) return null;

    return (
        <Alert variant="warning" className="mb-8">
            <Heading level="1" size="small" className="mb-4">
                {duManglerTilgang
                    ? 'Du kan ikke registrere denne personen som arbeidssøker'
                    : 'Personen må registreres manuelt av en veileder etter at en vurdering er gjort'}
            </Heading>
            {aarsakTilAvvisning && aarsaker && (
                <List as="ul" title="Årsaker">
                    {aarsakTilAvvisning.regler.map((regel) => (
                        <List.Item>{regel.beskrivelse}</List.Item>
                    ))}
                </List>
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
