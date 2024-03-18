import { useFeatureToggles } from '../contexts/featuretoggle-context';

import RedirectTilVedlikehold from '../components/redirect-til-vedlikehold';
import { withAuthenticatedPage } from '../auth/withAuthentication';
import DemoPanel from '../components/demo-panel';
import RedirectTilSkjema from '../components/redirect-til-skjema';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';
import VelgRegistreringstype from '../components/velg-registreringstype';

export default function Home() {
    const { toggles } = useFeatureToggles();
    const brukNyInngang = toggles['arbeidssokerregistrering.bruk-ny-inngang'];

    return (
        <>
            <RedirectTilVedlikehold />
            {brukNyInngang ? <VelgRegistreringstype /> : <RedirectTilSkjema />}
            <ManglerPersonEllerEnhet />
            <section className="flex flex-col items-center p-8">
                <DemoPanel />
            </section>
        </>
    );
}

export const getServerSideProps = withAuthenticatedPage();
