import { BodyLong, Link } from '@navikt/ds-react';

type TilbakeTilForsideProps = {
    sidenavn: string;
};

function TilbakeTilForside(props: TilbakeTilForsideProps) {
    const { sidenavn } = props;
    return (
        <BodyLong className='mb-4 print:hidden'>
            <Link href='/'>Tilbake til forsiden</Link> / {sidenavn}
        </BodyLong>
    );
}
export { TilbakeTilForside };
