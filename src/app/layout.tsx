import Script from 'next/script';
import '../styles/globals.css';
import { Visittkort } from './components/visittkort';
import { hentModiaContext } from './lib/modia-context';
import { hentVisittkortScriptUrl } from './lib/visittkort';

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const [modiaContext, visittkortUrl] = await Promise.all([hentModiaContext(), hentVisittkortScriptUrl()]);
    return (
        <html lang="no">
            {visittkortUrl && <Script src={visittkortUrl} strategy="afterInteractive" type="module" />}

            <body>
                <Visittkort modia={modiaContext} />
                {children}
            </body>
        </html>
    );
}
