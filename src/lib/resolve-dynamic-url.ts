import queryToString from './query-to-string';

const resolveDynamicUrl = (
    url: string,
    slug?: string | string[],
    query?: Partial<{
        [key: string]: string | string[];
    }>,
) => {
    const queryParams = query ? queryToString(query) : '';

    if (!slug) {
        return `${url}${queryParams}`;
    }

    let path;
    if (Array.isArray(slug)) {
        path = slug.join('/');
    } else {
        path = slug;
    }
    const resolvedUrl = url.replace('[slug]', path);

    return `${resolvedUrl}${queryParams}`;
};

export default resolveDynamicUrl;
