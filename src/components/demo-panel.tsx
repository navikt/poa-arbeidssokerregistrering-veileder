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
                    <NextLink href="/kvittering-arbeidssoker/" passHref locale={false}>
                        <Button variant="secondary">Kvittering - arbeidssøker</Button>
                    </NextLink>
                    <NextLink href={`/avslutt-arbeidssoekerperiode`} passHref locale={false}>
                        <Button variant="secondary">Avslutt arbeidssøkerperiode</Button>
                    </NextLink>
                    <NextLink href="/arbeidssoekerperiode-er-avsluttet/" passHref locale={false}>
                        <Button variant="secondary">Kvittering for avsluttet arbeidssøkerperiode</Button>
                    </NextLink>
                    <NextLink href={`/registrering-mer-sykmeldtoppfolging`} passHref locale={false}>
                        <Button variant="secondary">Registrering - sykmeldtoppfølging</Button>
                    </NextLink>
                    <NextLink href="/kvittering-mer-sykmeldtoppfolging/" passHref locale={false}>
                        <Button variant="secondary">Kvittering - sykmeldtoppfølging</Button>
                    </NextLink>
                </Box>
                <Box>
                    <Heading level="2" size="small" className="bg-orange-100">
                        Stoppsituasjoner
                    </Heading>
                    <Box className="flex justify-evenly">
                        <NextLink href="/veiledning/registrering/mangler-arbeidstillatelse/" passHref locale={false}>
                            <Button variant="secondary">Mangler arbeidstillatelse</Button>
                        </NextLink>
                        <NextLink href="/veiledning/registrering/utvandret/" passHref locale={false}>
                            <Button variant="secondary">Utvandret</Button>
                        </NextLink>
                        <NextLink href="/veiledning/allerede-registrert/" passHref locale={false}>
                            <Button variant="secondary">Allerede registrert</Button>
                        </NextLink>
                        <NextLink href="/veiledning/sperret/" passHref locale={false}>
                            <Button variant="secondary">Sperret</Button>
                        </NextLink>
                    </Box>
                </Box>
                <Box>
                    <Heading level="2" size="small" className="bg-orange-100">
                        Feilmeldinger
                    </Heading>
                    <Box className="flex justify-evenly">
                        <NextLink href="/vedlikehold/" passHref locale={false}>
                            <Button variant="secondary">Vedlikehold</Button>
                        </NextLink>

                        <NextLink href="/feil/" passHref locale={false}>
                            <Button variant="secondary">Feil</Button>
                        </NextLink>

                        <NextLink href="/veiledning/mangler-tilgang-til-aa-registeret" passHref locale={false}>
                            <Button variant="secondary">Mangler tilgang til aa-registeret</Button>
                        </NextLink>
                    </Box>
                </Box>
                <Box>
                    <Heading level="2" size="small" className="bg-orange-100">
                        Reaktivering
                    </Heading>
                    <Box className="flex justify-evenly">
                        <NextLink href="/registrering-reaktivering" passHref locale={false}>
                            <Button variant="secondary">Reaktivering</Button>
                        </NextLink>
                        <NextLink href="/veiledning/reaktivering/utvandret/" passHref locale={false}>
                            <Button variant="secondary">Utvandret Reaktivering</Button>
                        </NextLink>
                        <NextLink href="/kvittering-reaktivering/" passHref locale={false}>
                            <Button variant="secondary">Kvittering Reaktivering</Button>
                        </NextLink>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default DemoPanel;
