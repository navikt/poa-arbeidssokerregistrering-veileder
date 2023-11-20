import { AsyncNavspa, AsyncSpaConfig } from '@navikt/navspa';
import { ComponentType } from 'react';
import { Loader } from '@navikt/ds-react';
import { createAssetManifestParser } from '@navikt/navspa/dist/async/utils';
import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';

interface SpaProps {
    enhet?: string;
    fnr: string;
}
interface SpaProps {
    enhet?: string;
    fnr: string;
}
interface VisittKortProps extends SpaProps {
    tilbakeTilFlate: string;
    visVeilederVerktoy: boolean;
}

const DEV_DOMAINS = ['dev', 'app-q1', 'app-q0', 'localhost'];

const erITestMiljo = (): boolean => {
    if (typeof window !== 'undefined') {
        return window.location.hostname.split('.').findIndex((domain) => DEV_DOMAINS.includes(domain)) >= 0;
    }
    return true;
};

const utledSpaUrl = (appName: string): string => {
    return erITestMiljo() ? `https://${appName}.intern.dev.nav.no` : `https://${appName}.intern.nav.no`;
};

const SpaName = 'veilarbvisittkortfs';
const visittkortAsyncConfig: AsyncSpaConfig = {
    appName: SpaName,
    appBaseUrl: utledSpaUrl(SpaName),
    loader: <Loader type="large" />,

    assetManifestParser: (manifest) => {
        const isWebpackManifest = 'entrypoints' in manifest;
        const baseUrl = utledSpaUrl(SpaName);
        if (isWebpackManifest) {
            return createAssetManifestParser(baseUrl)(manifest);
        } else {
            // Vitejs manifest
            const { file, css } = manifest['index.html'];
            const styles = css.map((path: string) => ({ path: `${baseUrl}/${path}` }));
            const entry = { type: 'module', path: `${baseUrl}/${file}` };
            return [entry, ...styles];
        }
    },
};

let _veilarbvisittkortfs;
function hentVisittkortKomponent(): ComponentType<VisittKortProps> {
    if (_veilarbvisittkortfs) {
        return _veilarbvisittkortfs;
    }

    _veilarbvisittkortfs = AsyncNavspa.importer<VisittKortProps>(visittkortAsyncConfig);
    return _veilarbvisittkortfs;
}

const Visittkort = () => {
    const { params } = useParamsFromContext();
    const { fnr, enhetId } = params;
    const { enableMock } = useConfig() as Config;
    const brukerMock = enableMock === 'enabled';

    if (brukerMock) {
        return null;
    }

    const VisittkortSpa = hentVisittkortKomponent();

    return (
        <VisittkortSpa
            tilbakeTilFlate={'veilarbportefoljeflatefs'}
            visVeilederVerktoy={true}
            fnr={fnr}
            enhet={enhetId}
        />
    );
};

export default Visittkort;
