import NextLink from 'next/link';
import { Button, Heading, Box } from '@navikt/ds-react';

function DemoPanel() {
    const enableMock = process.env.ENABLE_MOCK === 'enabled';

    if (!enableMock) return null;

    return (
        <section className="flex flex-col items-center p-8">
            <Box className="mt-8 flex flex-col bg-ax-warning-300">
                <Heading level="1" size="medium">
                    Demo - hurtigvalg
                </Heading>
                <Box>
                    <Heading level="2" size="small" className="bg-ax-warning-200">
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
                        <Heading level="2" size="small" className="bg-ax-warning-200">
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
        </section>
    );
}

export default DemoPanel;
