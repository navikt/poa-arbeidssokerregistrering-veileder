import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, Heading, Box } from '@navikt/ds-react';

interface Props {
    brukerMock?: boolean;
}

function DemoPanel({ brukerMock }: Props) {
    const router = useRouter();
    if (!brukerMock) return null;

    return (
        <Box className="mt-8 flex flex-col">
            <Heading level="1" size="medium" className={'mbm'}>
                Demovalg
            </Heading>
            <Box className={'bg-orange-300'}>
                <Heading level="1" size="small">
                    Velg side
                </Heading>
                <Box className="flex justify-between">
                    <NextLink href={`/registrering-arbeidssoker`} passHref locale={false}>
                        <Button>Arbeidssøker registrering</Button>
                    </NextLink>
                    <NextLink href="/kvittering-arbeidssoker/" passHref locale={false}>
                        <Button variant="secondary">Kvittering registrert arbeidssøker</Button>
                    </NextLink>

                    <p>
                        <NextLink href={`/registrering-mer-sykmeldtoppfolging`} passHref locale={false}>
                            <Button variant="secondary">Mer sykmeldt oppfølging</Button>
                        </NextLink>
                    </p>
                    <p>
                        <NextLink href="/kvittering-mer-sykmeldtoppfolging/" passHref locale={false}>
                            <Button variant="secondary">Kvittering registrert for mer sykmeldtoppfølging</Button>
                        </NextLink>
                    </p>
                </Box>
                <Box>
                    <Heading level="2" size="small">
                        Stoppsituasjoner
                    </Heading>
                    <Box className="flex justify-between">
                        <p>
                            <NextLink
                                href="/veiledning/registrering/mangler-arbeidstillatelse/"
                                passHref
                                locale={false}
                            >
                                <Button variant="secondary">Mangler arbeidstillatelse</Button>
                            </NextLink>
                        </p>
                        <p>
                            <NextLink href="/veiledning/registrering/utvandret/" passHref locale={false}>
                                <Button variant="secondary">Utvandret</Button>
                            </NextLink>
                        </p>
                        <p>
                            <NextLink href="/veiledning/allerede-registrert/" passHref locale={false}>
                                <Button variant="secondary">Allerede registrert</Button>
                            </NextLink>
                        </p>
                        <p>
                            <NextLink href="/veiledning/sperret/" passHref locale={false}>
                                <Button variant="secondary">Sperret</Button>
                            </NextLink>
                        </p>
                    </Box>
                </Box>
                <Box>
                    <Heading level="4" size="medium">
                        Feilmeldinger
                    </Heading>
                    <p>
                        <NextLink href="/vedlikehold/" passHref locale={false}>
                            <Button variant="secondary">Vedlikehold</Button>
                        </NextLink>
                    </p>
                    <p>
                        <NextLink href="/feil/" passHref locale={false}>
                            <Button variant="secondary">Feil</Button>
                        </NextLink>
                    </p>
                </Box>
                <Box>
                    <Heading level="4" size="medium">
                        Reaktivering
                    </Heading>
                    <p>
                        <NextLink href="/registrering-reaktivering" passHref locale={false}>
                            <Button variant="secondary">Reaktivering</Button>
                        </NextLink>
                    </p>
                    <p>
                        <NextLink href="/veiledning/reaktivering/utvandret/" passHref locale={false}>
                            <Button variant="secondary">Utvandret Reaktivering</Button>
                        </NextLink>
                    </p>
                    <p>
                        <NextLink href="/kvittering-reaktivering/" passHref locale={false}>
                            <Button variant="secondary">Kvittering Reaktivering</Button>
                        </NextLink>
                    </p>
                </Box>
            </Box>
        </Box>
    );
}

export default DemoPanel;
