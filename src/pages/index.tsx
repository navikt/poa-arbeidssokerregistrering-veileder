import RedirectTilVedlikehold from '../components/redirect-til-vedlikehold';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import DemoPanel from '../components/demo-panel';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';
import HvaErNytt from '../components/hva-er-nytt';
import DemoLabel from '../components/demo-label';
import NyForside from '../components/forside/ny-forside';

export default function Home() {
    return (
        <>
            <RedirectTilVedlikehold />
            <DemoLabel />
            <HvaErNytt />
            <NyForside />
            <ManglerPersonEllerEnhet />
            <section className="flex flex-col items-center p-8">
                <DemoPanel />
            </section>
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
