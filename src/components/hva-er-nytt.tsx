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
            <BodyLong>
                <List as="ul" title="I korte trekk er dette endret:">
                    <List.Item>alle spørsmål er nå samlet på en side</List.Item>
                    <List.Item>
                        tydelig skille mellom registrering av arbeidssøker og registrering for mer sykmeldtoppfølging
                    </List.Item>
                    <List.Item>feilmeldinger tilpasset veileder</List.Item>
                </List>
            </BodyLong>
            <BodyLong>
                Dersom du ønsker å se hvordan registreringen ser ut for personbrukere kan det gjøres ved å bruke de
                ulike demoløsningene.
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
            </BodyLong>
        </ReadMore>
    );
}
