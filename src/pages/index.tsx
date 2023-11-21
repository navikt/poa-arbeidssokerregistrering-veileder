import RedirectTilVedlikehold from '../components/redirect-til-vedlikehold';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import DemoPanel from '../components/demo-panel';
import RedirectTilSkjema from '../components/redirect-til-skjema';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';

export default function Home() {
    return (
        <>
            <RedirectTilVedlikehold />
            <RedirectTilSkjema />
            <ManglerPersonEllerEnhet />
            <section className="flex flex-col items-center p-8">
                <DemoPanel />
            </section>
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
