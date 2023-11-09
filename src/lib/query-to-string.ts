const queryToString = (
    query: Partial<{
        [key: string]: string | string[];
    }>,
): string => {
    const keys = Object.keys(query);
    if (keys.length === 0) {
        return '';
    }

    return keys
        .reduce((str, key) => {
            if (query[key]) {
                return `${str}${key}=${query[key]}&`;
            }

            return str;
        }, '?')
        .slice(0, -1);
};

export default queryToString;
