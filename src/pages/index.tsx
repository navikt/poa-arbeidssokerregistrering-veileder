import { Heading, Link, BodyShort } from '@navikt/ds-react';

import { useParamsFromContext, ContextParams } from '../contexts/params-from-context';

import RedirectTilVedlikehold from '../components/redirect-til-vedlikehold';

export default function Home() {
    const { fnr, enhetsId } = useParamsFromContext() as ContextParams;

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
                        <Link href="/registrering-arbeidssoker">Registrere arbeidssøker</Link>
                        <Link href="/registrering-reaktivering">Reaktiver arbeidssøker</Link>
                        <Link href="/registrering-mer-sykmeldtoppfolging">Registrere for mer sykmeldtoppfølging</Link>
                    </div>
                </main>
            </section>
        </>
    );
}
