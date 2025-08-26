import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
    const brukerMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';
    const umamiTrackingId = process.env.NEXT_PUBLIC_UMAMI_TRACKING_ID;
    return (
        <Html lang="no">
            <Head>
                {!brukerMock && (
                    <>
                        <link
                            rel="stylesheet"
                            href="https://cdn.nav.no/personoversikt/internarbeidsflate-decorator-v3/dev/latest/dist/index.css"
                        />
                        <script
                            src="https://cdn.nav.no/personoversikt/internarbeidsflate-decorator-v3/dev/latest/dist/bundle.js"
                            async
                        />
                        <Script
                            defer
                            strategy="afterInteractive"
                            src="https://cdn.nav.no/team-researchops/sporing/sporing.js"
                            data-host-url="https://umami.nav.no"
                            data-website-id={umamiTrackingId}
                        ></Script>
                    </>
                )}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
