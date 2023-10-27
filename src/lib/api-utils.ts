import getConfig from 'next/config';

const { basePath } = getConfig().publicRuntimeConfig;

const getUrl = (path: string) => `${basePath}/${path}`;

export const fetcher = async (path: string, opts?: RequestInit & { onError?: (response: any) => void }) => {
    const response = await fetch(getUrl(path), {
        ...opts,
        credentials: 'include',
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('401');
        } else if (typeof opts?.onError === 'function') {
            return opts.onError(response);
        }
        throw new Error(response.statusText);
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType && /application\/json/.test(contentType)) {
        return await response.json();
    }
};
