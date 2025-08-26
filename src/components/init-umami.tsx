import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';
import Script from 'next/script';

export default function InitUmami() {
    const { enableMock, umamiTrackingId } = useConfig() as Config;
    const brukerMock = enableMock === 'enabled';

    if (brukerMock || umamiTrackingId === undefined) {
        return null;
    }

    return (
        <Script
            defer
            strategy="afterInteractive"
            src="https://cdn.nav.no/team-researchops/sporing/sporing.js"
            data-host-url="https://umami.nav.no"
            data-website-id={umamiTrackingId}
        ></Script>
    );
}
