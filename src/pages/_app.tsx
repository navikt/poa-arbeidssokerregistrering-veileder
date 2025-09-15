import { useEffect } from 'react';
import NextApp, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';

import useSprak from '../hooks/useSprak';
import { FeatureToggleProvider } from '../contexts/featuretoggle-context';
import { ErrorProvider } from '../contexts/error-context';
import { GlobalFeilmelding } from '../components/feilmeldinger/feilmeldinger';
import { lagHentTekstForSprak, Tekster } from '@navikt/arbeidssokerregisteret-utils';
import { ConfigProvider } from '../contexts/config-context';
import { ParamsFromContextProvider } from '../contexts/params-from-context';
import { initFaro } from '../faro/initFaro';
import InternflateDecorator from '../components/InternflateDecorator';
import Visittkort from '../components/visittkort';

import '../styles/globals.css';
import InitUmami from '../components/init-umami';
import InitAmplitude from '../components/init-amplitude';

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
                <ErrorProvider>
                    <ParamsFromContextProvider>
                        <div className={pageProps.skjulDekoratorVedPrint ? 'print:hidden' : null}>
                            <InternflateDecorator />
                            <Visittkort />
                        </div>
                        <InitAmplitude />
                        <InitUmami />
                        <section className="flex flex-col items-center p-8 h-screen">
                            <main
                                className="flex flex-col max-w-4xl w-full flex-1"
                                lang="nb"
                                id="maincontent"
                                role="main"
                                tabIndex={-1}
                                data-route={router.pathname}
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
            </FeatureToggleProvider>
        </ConfigProvider>
    );
}

MyApp.getInitialProps = async function getInitialProps(context: AppContext) {
    return NextApp.getInitialProps(context);
};

export default MyApp;
