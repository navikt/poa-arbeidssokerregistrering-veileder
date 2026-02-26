import { BodyLong, Heading, Page } from '@navikt/ds-react';
import { PageBlock } from '@navikt/ds-react/Page';

export const metadata = {
    title: '404 - Fant ikke siden',
    description: 'Siden eksisterer ikke',
};

export default function NotFound() {
    return (
        <Page>
            <PageBlock width='xl'>
                <Heading size='large' level='1'>
                    Fant ikke siden
                </Heading>
                <BodyLong>Siden du leter etter eksisterer ikke.</BodyLong>
            </PageBlock>
        </Page>
    );
}
