import { useFeatureToggles } from '../contexts/featuretoggle-context';

import RedirectTilVedlikehold from '../components/redirect-til-vedlikehold';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import DemoPanel from '../components/demo-panel';
import RedirectTilSkjema from '../components/redirect-til-skjema';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';
import ArbeidssoekerstatusOversikt from '../components/arbeidssoekerstatus-oversikt';
import HvaErNytt from '../components/hva-er-nytt';

export default function Home() {
    const { toggles } = useFeatureToggles();
    const brukNyInngang = toggles['arbeidssokerregistrering.bruk-ny-inngang'];

    return (
        <>
            <RedirectTilVedlikehold />
            <HvaErNytt />
            {brukNyInngang ? <ArbeidssoekerstatusOversikt /> : <RedirectTilSkjema />}
            <ManglerPersonEllerEnhet />
            <section className="flex flex-col items-center p-8">
                <DemoPanel />
            </section>
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
