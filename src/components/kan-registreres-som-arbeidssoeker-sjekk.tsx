import { Alert, BodyLong, Heading } from '@navikt/ds-react';

interface FeilmeldingProps {
    feilmelding?: any;
}

function Feilmelding(props: FeilmeldingProps) {
    const { feilmelding } = props;
    const { aarsakTilAvvisning } = feilmelding || {};

    if (!feilmelding) return null;

    return (
        <Alert variant="warning" className="mb-8">
            <Heading level="1" size="small" className="mb-4">
                Personen kan ikke registrere seg selv som arbeidssøker på nav.no
            </Heading>
            {aarsakTilAvvisning && <BodyLong spacing>Årsak: {aarsakTilAvvisning.beskrivelse}</BodyLong>}
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
