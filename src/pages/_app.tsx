import { useEffect } from 'react';
import NextApp, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';

import useSprak from '../hooks/useSprak';

import { AmplitudeProvider } from '../contexts/amplitude-context';
import { FeatureToggleProvider } from '../contexts/featuretoggle-context';
import { ErrorProvider } from '../contexts/error-context';
import { GlobalFeilmelding } from '../components/feilmeldinger/feilmeldinger';
import lagHentTekstForSprak, { Tekster } from '../lib/lag-hent-tekst-for-sprak';
import { ConfigProvider } from '../contexts/config-context';
import { ParamsFromContextProvider } from '../contexts/params-from-context';
import { initFaro } from '../faro/initFaro';

import '../styles/globals.css';
import InternflateDecorator from '../components/InternflateDecorator';

const TEKSTER: Tekster<string> = {
    nb: {
        metaTittel: 'Arbeidssøkerregistrering',
        metaDescription: 'Skjema for arbeidssøkerregistrering',
    },
    en: {
        metaTittel: 'Job seeker registration',
        metaDescription: 'Register as job seeker',
    },
};

function MyApp({ Component, pageProps, router }: AppProps) {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());

    useEffect(() => {
        initFaro();
    }, []);

    return (
        <ConfigProvider>
            <FeatureToggleProvider>
                <AmplitudeProvider>
                    <ErrorProvider>
                        <ParamsFromContextProvider>
                            <InternflateDecorator />
                            <section className="flex flex-col items-center p-8">
                                <main
                                    className="flex flex-col max-w-4xl w-full"
                                    lang="nb"
                                    id="maincontent"
                                    role="main"
                                    tabIndex={-1}
                                >
                                    <Head>
                                        <title>{tekst('metaTittel')}</title>
                                        <meta name="description" content={tekst('metaDescription')} />
                                    </Head>
                                    <GlobalFeilmelding />
                                    <Component {...pageProps} />
                                </main>
                            </section>
                        </ParamsFromContextProvider>
                    </ErrorProvider>
                </AmplitudeProvider>
            </FeatureToggleProvider>
        </ConfigProvider>
    );
}

MyApp.getInitialProps = async function getInitialProps(context: AppContext) {
    return NextApp.getInitialProps(context);
};

export default MyApp;
