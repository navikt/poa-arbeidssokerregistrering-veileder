'use client';
import { Alert, BodyLong, Heading } from '@navikt/ds-react';
import { useModiaContext } from '../contexts/modia-context';

const ManglerPersonEllerEnhet: React.FC = () => {
    const { fnr, enhetId } = useModiaContext();

    if (fnr === undefined && enhetId === undefined) {
        return null;
    }

    if (!fnr) {
        return (
            <Alert variant="warning">
                <Heading level="1" size="small">
                    Fødselsnummer mangler
                </Heading>
                <BodyLong>Du må søke opp en person for å kunne registrere vedkommende</BodyLong>
            </Alert>
        );
    }

    if (!enhetId) {
        return (
            <Alert variant="warning">
                <Heading level="1" size="small">
                    Enhet mangler
                </Heading>
                <BodyLong>Du må velge aktiv enhet.</BodyLong>
            </Alert>
        );
    }

    return null;
};

export { ManglerPersonEllerEnhet };
