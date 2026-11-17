import { BodyLong, Box, Link } from '@navikt/ds-react';

type TilbakeTilForsideProps = {
    sidenavn: string;
};

function TilbakeTilForside(props: TilbakeTilForsideProps) {
    const { sidenavn } = props;
    return (
        <Box marginBlock='space-0 space-16' className='skjul-ved-utskrift'>
            <BodyLong>
                <Link href='/'>Tilbake til forsiden</Link> / {sidenavn}
            </BodyLong>
        </Box>
    );
}

export { TilbakeTilForside };
