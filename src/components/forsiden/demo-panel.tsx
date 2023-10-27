import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, Heading, Panel } from '@navikt/ds-react';

import { SkjemaSide } from '../../model/skjema';

interface Props {
    brukerMock?: boolean;
}

function DemoPanel({ brukerMock }: Props) {
    const router = useRouter();
    if (!brukerMock) return null;
    const { visGammelDineOpplysninger } = router.query;

    return (
        <Panel className="text-center" style={{ backgroundColor: 'var(--a-orange-200)' }}>
            <Heading level="2" size="xlarge" className={'mbm'}>
                Demovalg
            </Heading>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Panel className={'mxxs'} style={{ backgroundColor: 'var(--a-orange-50)' }}>
                    <div className="text-center">
                        <Heading level="3" size="large">
                            Velg side
                        </Heading>
                        <div className="text-center">
                            <p>
                                <NextLink href={`/skjema/${SkjemaSide.DinSituasjon}`} passHref locale={false}>
                                    <Button>Standard registrering</Button>
                                </NextLink>
                            </p>
                            <p>
                                <NextLink href={`/sykmeldt/`} passHref locale={false}>
                                    <Button variant="secondary">Sykmeldt registrering</Button>
                                </NextLink>
                            </p>
                            <p>
                                <NextLink href={`/mer-oppfolging/`} passHref locale={false}>
                                    <Button variant="secondary">Mer sykmeldt oppfølging</Button>
                                </NextLink>
                            </p>
                            <p>
                                <NextLink href="/kvittering/" passHref locale={false}>
                                    <Button variant="secondary">Kvittering</Button>
                                </NextLink>
                            </p>

                            <p>
                                <NextLink href="/veiledning/registrering/utvandret/" passHref locale={false}>
                                    <Button variant="secondary">Utvandret</Button>
                                </NextLink>
                            </p>
                            <Heading level="4" size="medium">
                                Stoppsituasjoner
                            </Heading>
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
                                <NextLink href="/veiledning/allerede-registrert/" passHref locale={false}>
                                    <Button variant="secondary">Allerede registrert</Button>
                                </NextLink>
                            </p>
                            <p>
                                <NextLink href="/veiledning/sperret/" passHref locale={false}>
                                    <Button variant="secondary">Sperret</Button>
                                </NextLink>
                            </p>
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
                            <Heading level="4" size="medium">
                                Reaktivering
                            </Heading>
                            <p>
                                <NextLink href="/reaktivering" passHref locale={false}>
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
                        </div>
                    </div>
                </Panel>
                <Panel className={'mxxs'} style={{ backgroundColor: 'var(--a-orange-50)' }}>
                    <Heading level="3" size="large">
                        Velg tekstversjon
                    </Heading>
                    <p>
                        <NextLink
                            href={`/${visGammelDineOpplysninger ? '' : '?visGammelDineOpplysninger=true'}`}
                            passHref
                            locale={false}
                        >
                            <Button variant="secondary">
                                Vis {visGammelDineOpplysninger ? 'ny' : 'gammel'} introtekst
                            </Button>
                        </NextLink>
                    </p>
                </Panel>
            </div>
        </Panel>
    );
}

export default DemoPanel;
