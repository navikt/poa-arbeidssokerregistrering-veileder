import { Heading, Link, BodyShort } from '@navikt/ds-react';

import { useParamsFromContext, ContextParams } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import RedirectTilVedlikehold from '../components/redirect-til-vedlikehold';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import { Config } from '../model/config';
import DemoPanel from '../components/demo-panel';

export default function Home() {
    const { fnr, enhetsId } = useParamsFromContext() as ContextParams;
    const { enableMock } = useConfig() as Config;
    const brukerMock = enableMock === 'enabled';

    return (
        <>
            <RedirectTilVedlikehold />
            <section className="flex flex-col items-center p-8">
                <main className="flex flex-col max-w-4xl w-full" tabIndex={-1} id="maincontent">
                    <Heading size="medium" level="1">
                        Arbeidssøkerregistrering for veileder
                    </Heading>
                    <BodyShort>Fnr: {fnr}</BodyShort>
                    <BodyShort>EnhetsId: {enhetsId}</BodyShort>
                    <div className="flex justify-between">
                        <Link href={`/registrering-arbeidssoker?fnr=${fnr}&enhetsId=${enhetsId}`}>
                            Registrere arbeidssøker
                        </Link>
                        <Link href={`/registrering-reaktivering?fnr=${fnr}&enhetsId=${enhetsId}`}>
                            Reaktiver arbeidssøker
                        </Link>
                        <Link href={`/registrering-mer-sykmeldtoppfolging?fnr=${fnr}&enhetsId=${enhetsId}`}>
                            Registrere for mer sykmeldtoppfølging
                        </Link>
                    </div>
                </main>
                <DemoPanel brukerMock={brukerMock} />
            </section>
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
