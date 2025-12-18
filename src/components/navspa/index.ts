import { exportEvent, importer } from './navspa';
import { importer as importerAsync } from './async/async-navspa';

export { createAssetManifestParser } from './async/utils';
export type { AsyncSpaConfig } from './async/async-navspa';
export type { ReactAdapter } from './react-adapter';

export const AsyncNavspa = {
    importer: importerAsync,
};

const Navspa = {
    importer,
    exportEvent,
};

export default Navspa;
