import { Heading, Link, BodyShort } from '@navikt/ds-react';

import { useParamsFromContext, ContextParams } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import RedirectTilVedlikehold from '../components/redirect-til-vedlikehold';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import { Config } from '../model/config';
import DemoPanel from '../components/demo-panel';
import RedirectTilSkjema from '../components/redirect-til-skjema';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';

export default function Home() {
    const { fnr, enhetId } = useParamsFromContext() as ContextParams;
    const { enableMock } = useConfig() as Config;
    const brukerMock = enableMock === 'enabled';

    return (
        <>
            <RedirectTilVedlikehold />
            <RedirectTilSkjema />
            <ManglerPersonEllerEnhet />
            <section className="flex flex-col items-center p-8">
                <main className="flex flex-col max-w-4xl w-full" tabIndex={-1} id="maincontent">
                    <Heading size="medium" level="1">
                        Arbeidssøkerregistrering for veileder
                    </Heading>
                    <BodyShort>Fnr: {fnr}</BodyShort>
                    <BodyShort>EnhetId: {enhetId}</BodyShort>
                    <div className="flex justify-between">
                        <Link href={`/registrering-arbeidssoker`}>Registrere arbeidssøker</Link>
                        <Link href={`/registrering-reaktivering`}>Reaktiver arbeidssøker</Link>
                        <Link href={`/registrering-mer-sykmeldtoppfolging`}>Registrere for mer sykmeldtoppfølging</Link>
                    </div>
                </main>
                <DemoPanel brukerMock={brukerMock} />
            </section>
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
