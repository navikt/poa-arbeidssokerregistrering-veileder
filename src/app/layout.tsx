import Script from 'next/script';
import '../styles/globals.css';
import { InternflateDecorator } from './components/decorator-intern';
import { Visittkort } from './components/visittkort';
import { ModiaProvider } from './contexts/modia-context';
import { hentModiaContext } from './lib/modia-context-api';
import { hentVisittkortScriptUrl } from './lib/visittkort-url';

// TODO: hent via NAIS
const enableMock = process.env.ENABLE_MOCK === 'enabled';
const decoratorEnv = process.env.DEKORATOR_ENV ?? 'q2';

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const [modiaContext, visittkortUrl] = await Promise.all([hentModiaContext(), hentVisittkortScriptUrl()]);
	return (
		<html lang='no'>
			<head>
				{enableMock && (
					<>
						<link
							rel='stylesheet'
							href='https://cdn.nav.no/personoversikt/internarbeidsflate-decorator-v3/dev/latest/dist/index.css'
						/>
						<Script
							src='https://cdn.nav.no/personoversikt/internarbeidsflate-decorator-v3/dev/latest/dist/bundle.js'
							strategy='beforeInteractive'
						/>
					</>
				)}
			</head>
			{visittkortUrl && <Script src={visittkortUrl} strategy='afterInteractive' type='module' />}

			<body>
				<ModiaProvider initFnr={modiaContext.fnr} initEnhetId={modiaContext.enhetId}>
					<InternflateDecorator decoratorEnv={decoratorEnv} enableMock={enableMock} />
					<Visittkort modia={modiaContext} brukerMock={enableMock} />
					{children}
				</ModiaProvider>
			</body>
		</html>
	);
}
