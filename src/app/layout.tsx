import Script from 'next/script';
import '../styles/globals.css';
import { InternflateDecorator } from './components/decorator-intern';
import { Visittkort } from './components/visittkort';
import { ModiaProvider } from './contexts/modia-context';
import { hentModiaContext } from './lib/modia-context-api';
import { hentVisittkortScriptUrl } from './lib/visittkort-url';

const enableMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';
const decoratorEnv = process.env.DEKORATOR_ENV ?? 'q2';

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const [modiaContext, visittkortUrl] = await Promise.all([hentModiaContext(), hentVisittkortScriptUrl()]);
    return (
        <html lang='no'>
            <head>
                <link
                    rel='stylesheet'
                    href='https://cdn.nav.no/personoversikt/internarbeidsflate-decorator-v3/dev/latest/dist/index.css'
                />
                <Script
                    src='https://cdn.nav.no/personoversikt/internarbeidsflate-decorator-v3/dev/latest/dist/bundle.js'
                    strategy='beforeInteractive'
                />
            </head>

            <body>
                {visittkortUrl && <Script src={visittkortUrl} strategy='afterInteractive' type='module' />}
                <ModiaProvider initFnr={modiaContext.fnr} initEnhetId={modiaContext.enhetId}>
                    <InternflateDecorator decoratorEnv={decoratorEnv} />
                    <Visittkort brukerMock={enableMock} />
                    <main className='max-w-4xl m-auto p-8'>{children}</main>
                </ModiaProvider>
            </body>
        </html>
    );
}
