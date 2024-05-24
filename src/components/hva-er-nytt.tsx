import { BodyLong, ReadMore, List, Link } from '@navikt/ds-react';

import { useFeatureToggles } from '../contexts/featuretoggle-context';

import { loggAktivitet } from '../lib/amplitude';

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
            <List as="ul" title="Dette er de siste endringene:">
                <List.Item>all informasjon om arbeidssøkerperioden samlet på forsiden</List.Item>
                <List.Item>mulighet til å oppdatere opplysningene fra registreringen</List.Item>
                <List.Item>
                    sjekk av hvorvidt en person kan registreres som arbeidssøker gjøres før det eventuelt blir mulig å
                    registrere personen
                </List.Item>
                <List.Item>
                    mer presis informasjon om hvorfor en person eventuelt ikke kan registreres som arbeidssøker
                </List.Item>
                <List.Item>registrering for mer sykmeldtoppfølging er fjernet fra løsningen</List.Item>
            </List>
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
