import { BodyLong, Link } from '@navikt/ds-react';

interface TilbakeTilForsideProps {
    sidenavn: string;
}
const TilbakeTilForside = (props: TilbakeTilForsideProps) => {
    const { sidenavn } = props;
    return (
        <BodyLong className="mb-4 print:hidden">
            <Link href="/">Tilbake til forsiden</Link> / {sidenavn}
        </BodyLong>
    );
};
export default TilbakeTilForside;
