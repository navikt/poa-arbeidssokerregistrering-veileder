'use client';
import { Box, Heading, List, ReadMore } from '@navikt/ds-react';
import { loggAktivitet } from '@/lib/tracking';

function HvaErNytt() {
    const aapnerHvaErNytt = () => {
        loggAktivitet({ aktivitet: 'Leser hva er nytt' });
    };
    return (
        <ReadMore header='Hva er nytt i registreringen for veileder?' className='mb-8' onClick={aapnerHvaErNytt}>
            <div>
                <Heading as='h3' size='small'>
                    Dette er de siste endringene:
                </Heading>
                <Box marginBlock='space-16' asChild>
                    <List data-aksel-migrated-v8 as='ul'>
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
        </ReadMore>
    );
}
export { HvaErNytt };
