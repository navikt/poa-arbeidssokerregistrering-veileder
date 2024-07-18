import RedirectTilVedlikehold from '../components/redirect-til-vedlikehold';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import DemoPanel from '../components/demo-panel';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';
import ArbeidssoekerstatusOversikt from '../components/arbeidssoekerstatus-oversikt';
import HvaErNytt from '../components/hva-er-nytt';

export default function Home() {
    return (
        <>
            <RedirectTilVedlikehold />
            <HvaErNytt />
            <ArbeidssoekerstatusOversikt />
            <ManglerPersonEllerEnhet />
            <section className="flex flex-col items-center p-8">
                <DemoPanel />
            </section>
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
