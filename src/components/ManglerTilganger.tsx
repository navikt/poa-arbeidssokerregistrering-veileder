import { Alert, BodyLong, Heading } from '@navikt/ds-react';

function ManglerTilganger() {
    return (
        <Alert variant='warning'>
            <Heading level='1' size='small'>
                Mangler tilgang
            </Heading>
            <BodyLong>
                Du har ikke tilgang til å se informasjon om denne personen. Dette kan skyldes at du mangler nødvendige
                rettigheter.
            </BodyLong>
        </Alert>
    );
}
export { ManglerTilganger };
