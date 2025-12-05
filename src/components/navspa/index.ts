import { importer, eksporter, exportEvent, setAdapter } from './navspa';
import { importer as importerAsync, importerLazy, preload } from './async/async-navspa';

export { createAssetManifestParser } from './async/utils';
export type { AsyncSpaConfig } from './async/async-navspa';
export type { ReactAdapter } from './react-adapter';

export const AsyncNavspa = {
    importer: importerAsync,
    importerLazy,
    preload,
};

export const Navspa = {
    importer,
    eksporter,
    exportEvent,
    setAdapter,
};

export default Navspa;
