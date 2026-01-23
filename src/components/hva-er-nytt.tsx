import { BodyLong, ReadMore, List, Link, Heading, Box } from '@navikt/ds-react';

import { useFeatureToggles } from '../contexts/featuretoggle-context';

import { loggAktivitet } from '../lib/tracking';

export default function HvaErNytt() {
    const { toggles } = useFeatureToggles();
    const visHvaErNytt = toggles['arbeidssokerregistrering-for-veileder.vis-hva-er-nytt'];

    const aapnerHvaErNytt = () => {
        loggAktivitet({ aktivitet: 'Leser hva er nytt' });
    };

    if (!visHvaErNytt) {
        return null;
    }

    return (
        <ReadMore header="Hva er nytt i registreringen for veileder?" className="mb-8" onClick={aapnerHvaErNytt}>
            <div>
                <Heading as="h3" size="small">
                    Dette er de siste endringene:
                </Heading>
                <Box marginBlock="space-16" asChild>
                    <List data-aksel-migrated-v8 as="ul">
                        <List.Item>all informasjon om arbeidssøkerperioden samlet på forsiden</List.Item>
                        <List.Item>mulighet til å oppdatere opplysningene fra registreringen</List.Item>
                        <List.Item>
                            sjekk av hvorvidt en person kan registreres som arbeidssøker gjøres før det eventuelt blir
                            mulig å registrere personen
                        </List.Item>
                        <List.Item>
                            du må bekrefte at eventuelle sjekker av opplysninger og vurderinger er gjort før
                            registrering kan starte
                        </List.Item>
                        <List.Item>
                            mer presis informasjon om hvorfor en person eventuelt ikke kan registreres som arbeidssøker
                        </List.Item>
                        <List.Item>
                            registrering for mer sykmeldtoppfølging er fjernet fra løsningen og har egen inngang fra
                            andre systemer
                        </List.Item>
                    </List>
                </Box>
            </div>
            {/*
              <BodyLong>
                Dersom du ønsker å se hvordan registreringen ser ut for personbrukere kan det gjøres ved å bruke de
                ulike demoløsningene.
            </BodyLong>
            <List as="ul">
                <List.Item>
                    <Link href="https://arbeid.ekstern.dev.nav.no/arbeid/registrering">
                        Registrering av arbeidssøker - demo
                    </Link>
                </List.Item>
                <List.Item>
                    <Link href="https://arbeid.ekstern.dev.nav.no/arbeid/registrering/mer-oppfolging">
                        Tilbud om registrering for mer sykmeldtoppfølging - demo
                    </Link>
                </List.Item>
                <List.Item>
                    <Link href="https://demo.ekstern.dev.nav.no/syk/meroppfolging/reg/0">
                        Registrering for mer sykmeldtoppfølging - demo
                    </Link>
                </List.Item>
            </List>
             */}
        </ReadMore>
    );
}
