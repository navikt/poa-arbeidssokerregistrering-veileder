import { Heading } from '@navikt/ds-react';

import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';

import { RegistreringProvider } from '../contexts/registrering-context';
import DinSituasjon from '../components/skjema/din-situasjon';
import SisteJobb from '../components/skjema/siste-jobb/siste-jobb';
import UtdanningsNiva from '../components/skjema/utdanning';
import UtdanningGodkjent from '../components/skjema/utdanning-godkjent';
import UtdanningBestatt from '../components/skjema/utdanning-bestatt';
import Helseproblemer from '../components/skjema/helseproblemer';
import AndreProblemer from '../components/skjema/andre-problemer';
import { RegistrerArbeidssokerKnapp } from '../components/skjema/registrer-arbeidssoker-knapp';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';
import DemoPanel from '../components/demo-panel';

export default function RegistreringArbeidssoker() {
    const { enableMock } = useConfig() as Config;
    const brukerMock = enableMock === 'enabled';

    return (
        <>
            <ManglerPersonEllerEnhet />
            <Heading size="medium" level="1" className="mb-2">
                Arbeidssøkerregistrering
            </Heading>
            <RegistreringProvider>
                <DinSituasjon />
                <SisteJobb />
                <UtdanningsNiva />
                <UtdanningGodkjent />
                <UtdanningBestatt />
                <Helseproblemer />
                <AndreProblemer />
                <RegistrerArbeidssokerKnapp />
            </RegistreringProvider>
            <DemoPanel brukerMock={brukerMock} />
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
