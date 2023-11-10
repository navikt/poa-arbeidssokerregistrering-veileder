import { Heading } from '@navikt/ds-react';

import { useConfig } from '../contexts/config-context';

import { withAuthenticatedPage } from '../auth/withAuthentication';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';
import { Config } from '../model/config';
import DemoPanel from '../components/demo-panel';

export default function RegistreringMerSykmeldtOppfolging() {
    const { enableMock } = useConfig() as Config;
    const brukerMock = enableMock === 'enabled';

    return (
        <section className="flex flex-col items-center p-8">
            <main className="flex flex-col max-w-4xl w-full" tabIndex={-1} id="maincontent">
                <ManglerPersonEllerEnhet />
                <Heading size="medium" level="1">
                    Registrering for mer sykmeldtoppfølging
                </Heading>
            </main>
            <DemoPanel brukerMock={brukerMock} />
        </section>
    );
}

export const getServerSideProps = withAuthenticatedPage();
