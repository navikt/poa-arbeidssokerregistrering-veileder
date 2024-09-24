import { Html, Head, Main, NextScript } from 'next/document';

const brukerMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';

export default function Document() {
    return (
        <Html lang="no">
            <Head>
                {!brukerMock && (
                    <>
                        <link
                            rel="stylesheet"
                            href="https://cdn.nav.no/personoversikt/internarbeidsflate-decorator-v3/dev/latest/dist/index.css"
                        />
                        <script src="https://cdn.nav.no/personoversikt/internarbeidsflate-decorator-v3/dev/latest/dist/bundle.js" />
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
