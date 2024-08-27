import { useFeatureToggles } from '../contexts/featuretoggle-context';

import RedirectTilVedlikehold from '../components/redirect-til-vedlikehold';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import DemoPanel from '../components/demo-panel';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';
import ArbeidssoekerstatusOversikt from '../components/arbeidssoekerstatus-oversikt';
import ArbeidssoekerstatusOversiktV2 from '../components/arbeidssoekerstatus-oversikt-v2';
import HvaErNytt from '../components/hva-er-nytt';

export default function Home() {
    const { toggles } = useFeatureToggles();
    const brukV2API = toggles['arbeidssoekerregistrering.bruk-v2-inngang'];

    return (
        <>
            <RedirectTilVedlikehold />
            <HvaErNytt />
            {brukV2API ? <ArbeidssoekerstatusOversiktV2 /> : <ArbeidssoekerstatusOversikt />}
            <ManglerPersonEllerEnhet />
            <section className="flex flex-col items-center p-8">
                <DemoPanel />
            </section>
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
