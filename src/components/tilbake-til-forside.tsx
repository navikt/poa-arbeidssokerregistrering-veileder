import { BodyLong, Link } from '@navikt/ds-react';
import TilbakeTilJobb from './skjema/sykmeldt-tilbake-til-jobb';
import { useFeatureToggles } from '../contexts/featuretoggle-context';

interface TilbakeTilForsideProps {
    sidenavn: string;
}
const TilbakeTilForside = (props: TilbakeTilForsideProps) => {
    const { sidenavn } = props;
    const { toggles } = useFeatureToggles();
    const brukNyInngang = toggles['arbeidssokerregistrering.bruk-ny-inngang'];
    if (!brukNyInngang) return null;
    return (
        <BodyLong className="mb-4">
            <Link href="/">Tilbake til forsiden</Link> / {sidenavn}
        </BodyLong>
    );
};
export default TilbakeTilForside;
