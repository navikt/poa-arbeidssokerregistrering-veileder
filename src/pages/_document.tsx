import { Html, Head, Main, NextScript } from 'next/document';

const brukerMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';

export default function Document() {
    return (
        <Html lang="no">
            <Head>
                {!brukerMock && (
                    <>
                        <link rel="stylesheet" href="/internarbeidsflatedecorator/v2.1/static/css/main.css" />
                        <script defer src="/internarbeidsflatedecorator/v2.1/static/js/head.v2.min.js" />
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
