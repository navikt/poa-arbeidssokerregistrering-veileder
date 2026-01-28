import NextLink from 'next/link';
import { Button, Heading, Box } from '@navikt/ds-react';

import { useConfig } from '../contexts/config-context';

import { Config } from '../model/config';

function DemoPanel() {
    const { enableMock } = useConfig() as Config;
    const brukerMock = enableMock === 'enabled';

    if (!brukerMock) return null;

    return (
        <Box className="mt-8 flex flex-col bg-orange-200">
            <Heading level="1" size="medium">
                Demo - hurtigvalg
            </Heading>
            <Box>
                <Heading level="2" size="small" className="bg-orange-100">
                    Registrering
                </Heading>
                <Box className="flex justify-evenly">
                    <NextLink href={`/registrering-arbeidssoker`} passHref locale={false}>
                        <Button variant="secondary">Registrering - arbeidssøker</Button>
                    </NextLink>
                    <NextLink href={`/registrering-arbeidssoeker-sjekk`} passHref locale={false}>
                        <Button variant="secondary">Registrering med sjekk - arbeidssøker</Button>
                    </NextLink>
                    <NextLink href="/kvittering-arbeidssoker/" passHref locale={false}>
                        <Button variant="secondary">Kvittering - arbeidssøker</Button>
                    </NextLink>
                    <NextLink href={`/avslutt-arbeidssoekerperiode`} passHref locale={false}>
                        <Button variant="secondary">Avslutt arbeidssøkerperiode</Button>
                    </NextLink>
                    <NextLink href="/arbeidssoekerperiode-er-avsluttet/" passHref locale={false}>
                        <Button variant="secondary">Kvittering for avsluttet arbeidssøkerperiode</Button>
                    </NextLink>
                </Box>
                <Box>
                    <Heading level="2" size="small" className="bg-orange-100">
                        Feilmeldinger
                    </Heading>
                    <Box className="flex justify-evenly">
                        <NextLink href="/feil/" passHref locale={false}>
                            <Button variant="secondary">Feil</Button>
                        </NextLink>
                        <NextLink href="/veiledning/mangler-tilgang-til-aa-registeret" passHref locale={false}>
                            <Button variant="secondary">Mangler tilgang til aa-registeret</Button>
                        </NextLink>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default DemoPanel;
