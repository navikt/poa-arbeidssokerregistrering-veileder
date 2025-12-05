import { AssetManifestParser, ManifestObject } from './async-navspa';

export function createAssetManifestParser(appBaseUrl: string): AssetManifestParser {
    return (manifestObject: ManifestObject) => {
        const pathsToLoad = extractPathsFromCRAManifest(manifestObject);
        return pathsToLoad.map((path) => ({ path: makeAbsolute(appBaseUrl, path) }));
    };
}

/**
 * Extracts paths to load from a Create React App asset manifest.
 * @param manifestObject parsed json from the asset manifest
 */
function extractPathsFromCRAManifest(manifestObject: ManifestObject): string[] {
    const pathsToLoad: string[] = [];

    const { files, entrypoints } = manifestObject as { files: { [name: string]: string }; entrypoints: string[] };

    if (files == null || typeof files !== 'object' || !Array.isArray(entrypoints)) {
        throw new Error('Invalid manifest: ' + JSON.stringify(manifestObject));
    }

    const fileList = Object.entries(files).map(([name, path]) => ({ name, path })) as { name: string; path: string }[];

    entrypoints.forEach((entrypoint) => {
        const matchingFile = fileList.find((file) => file.path.endsWith(entrypoint));

        if (matchingFile) {
            pathsToLoad.push(matchingFile.path);
        } else {
            console.warn('Fant ikke fil i asset-manifest for entrypoint ' + entrypoint);
        }
    });

    return pathsToLoad;
}

export function joinPaths(...paths: string[]): string {
    return paths
        .map((path, idx) => {
            if (path.trim() === '' || path === '/') {
                return null;
            }

            const isFirstPath = idx === 0;
            const isLastPath = idx === paths.length - 1;

            let cleanedPath = path;

            if (cleanedPath.startsWith('/') && !isFirstPath) {
                cleanedPath = cleanedPath.substr(1);
            }

            if (cleanedPath.endsWith('/') && !isLastPath) {
                cleanedPath = cleanedPath.substr(0, path.length - 1);
            }

            return cleanedPath;
        })
        .filter((p) => p != null)
        .join('/');
}

export function makeAbsolute(baseUrl: string, maybeAbsolutePath: string): string {
    if (maybeAbsolutePath.startsWith('http')) {
        return maybeAbsolutePath;
    } else if (baseUrl.startsWith('http')) {
        const url = new URL(baseUrl);
        return joinPaths(url.origin, maybeAbsolutePath);
    } else {
        return joinPaths(window.location.origin, maybeAbsolutePath);
    }
}
