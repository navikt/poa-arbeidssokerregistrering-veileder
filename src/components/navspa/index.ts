import { importer as importerAsync } from './async/async-navspa';
import { exportEvent, importer } from './navspa';

export type { AsyncSpaConfig } from './async/async-navspa';
export { createAssetManifestParser } from './async/utils';

export const AsyncNavspa = {
    importer: importerAsync,
};

const Navspa = {
    importer,
    exportEvent,
};

export default Navspa;
