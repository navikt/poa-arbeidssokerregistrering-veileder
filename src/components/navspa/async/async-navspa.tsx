import loadjs from 'loadjs';
import React, { ReactNode } from 'react';
import { asyncLoadingOfDefinedApp } from '../feilmelding';
import { importer as importerSync, NAVSPAAppConfig, scope, scopeV2 } from '../navspa';
import { createAssetManifestParser, joinPaths } from './utils';

const ASSET_MANIFEST_NAME = 'asset-manifest.json';

export type Asset = {
    path: string;
    /**
     * Any additional asset attributes will be set on the mounted HTMLElement.
     * This can be used set the `rel` attribute on a link tag, or the `type` attribute on a script tag, etc.
     */
    [attribute: string]: string | undefined;
};
export type ManifestObject = { [k: string]: any };
export type AssetManifestParser = (manifestObject: ManifestObject) => Asset[];

export interface PreloadConfig {
    appName: string;
    appBaseUrl: string;
    assetManifestParser?: AssetManifestParser;
}

export interface AsyncSpaConfig extends PreloadConfig {
    config?: NAVSPAAppConfig;
    loader?: NonNullable<ReactNode>;
}

function createLoadJsBundleId(appName: string): string {
    return `async_navspa_${appName}`;
}

export function fetchAssetUrls(appBaseUrl: string, assetManifestParser: AssetManifestParser): Promise<Asset[]> {
    return fetch(joinPaths(appBaseUrl, ASSET_MANIFEST_NAME))
        .then((res) => res.json())
        .then((manifest) => assetManifestParser(manifest));
}

const loadingStatus: { [key: string]: Promise<void> } = {};
export function loadAssets(config: PreloadConfig): Promise<void> {
    const loadJsBundleId = createLoadJsBundleId(config.appName);
    if (!loadingStatus[loadJsBundleId]) {
        if (process.env.NODE_ENV === 'development' && (scope[config.appName] || scopeV2[config.appName])) {
            console.warn(asyncLoadingOfDefinedApp(config.appName));
        }

        const assetManifestParser = config.assetManifestParser || createAssetManifestParser(config.appBaseUrl);
        loadingStatus[loadJsBundleId] = fetchAssetUrls(config.appBaseUrl, assetManifestParser).then((assets) => {
            const paths = assets.map((asset) => asset.path);

            return loadjs(paths, loadJsBundleId, {
                returnPromise: true,
                before: setAssetAttributes(assets),
            });
        });
    }

    return loadingStatus[loadJsBundleId];
}

/**
 * Creates a `before`-callback to set any additional attributes on the assets before they get mounted by `loadjs`.
 */
function setAssetAttributes(assets: Asset[]) {
    const assetAttributes = assets.reduce((assetAttributes: Record<string, any>, { path, ...attributes }) => {
        assetAttributes[path] = attributes;
        return assetAttributes;
    }, {});

    return (path: string, assetElement: HTMLElement) => {
        Object.entries(assetAttributes[path]).forEach(([key, value]) => {
            (assetElement as any)[key] = value;
        });
    };
}

export function preload(config: PreloadConfig) {
    loadAssets(config).catch(console.error);
}

export function importerLazy<P>(config: AsyncSpaConfig): Promise<{ default: React.ComponentType<P> }> {
    return loadAssets(config)
        .catch(console.error)
        .then(() => ({ default: importerSync<P>(config.appName, config.config) }));
}

export function importer<P>(config: AsyncSpaConfig): React.ComponentType<P> {
    const LazyComponent = React.lazy(() => importerLazy(config));
    const loader = config.loader || <></>;
    return (props: P) => (
        <React.Suspense fallback={loader}>
            <LazyComponent {...props} />
        </React.Suspense>
    );
}
