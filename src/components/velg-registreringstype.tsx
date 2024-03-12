import { Heading, LinkPanel } from '@navikt/ds-react';

function VelgRegistreringstype() {
    return (
        <>
            <Heading level="1" size="large" className="mb-8">
                Velg registreringstype
            </Heading>
            <div className="flex flex-row justify-between">
                <LinkPanel border href="/registrering-arbeidssoker" className="mr-8">
                    <LinkPanel.Title>Arbeidssøkerregistrering</LinkPanel.Title>
                </LinkPanel>
                <LinkPanel border href="/registrering-mer-sykmeldtoppfolging">
                    <LinkPanel.Title>Mer sykmeldtoppfølging</LinkPanel.Title>
                </LinkPanel>
            </div>
        </>
    );
}

export default VelgRegistreringstype;
