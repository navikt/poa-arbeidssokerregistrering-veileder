import { withAuthenticatedPage } from '../auth/withAuthentication';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';
import ArbeidssoekerstatusOversiktV3 from '../components/arbeidssoekerstatus-oversikt-v3';
import DemoLabel from '../components/demo-label';

export default function Home() {
    return (
        <>
            <DemoLabel />
            <ArbeidssoekerstatusOversiktV3 />
            <ManglerPersonEllerEnhet />
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
