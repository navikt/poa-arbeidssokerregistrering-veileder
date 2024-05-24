import { BodyLong, Link } from '@navikt/ds-react';
import TilbakeTilJobb from './skjema/sykmeldt-tilbake-til-jobb';

interface TilbakeTilForsideProps {
    sidenavn: string;
}
const tilbakeTilForside = (props: TilbakeTilForsideProps) => {
    const { sidenavn } = props;
    return (
        <BodyLong className="mb-4">
            <Link href="/">Tilbake til forsiden</Link> / {sidenavn}
        </BodyLong>
    );
};
export default tilbakeTilForside;
