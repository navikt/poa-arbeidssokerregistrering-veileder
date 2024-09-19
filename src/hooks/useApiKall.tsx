import { useEffect, useReducer } from 'react';

function useApiKall<T>(url: string, method: 'PUT' | 'POST', body: string | null) {
    type Type = { data: T; isLoading: boolean; error: any };
    const [state, dispatch] = useReducer((s: Type, a: Partial<Type>) => ({ ...s, ...a }), {
        isLoading: true,
        data: null,
        error: null,
    });

    useEffect(() => {
        if (!body) {
            return;
        }

        fetch(url, {
            method,
            body,
            headers: {
                'Content-type': 'application/json',
            },
            credentials: 'include',
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            })
            .then((data) => dispatch({ isLoading: false, data }))
            .catch((error) => dispatch({ isLoading: false, error }));
    }, [body]);

    return state;
}

export default useApiKall;
