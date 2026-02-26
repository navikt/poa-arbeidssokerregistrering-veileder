'use client';

import { useEffect } from 'react';
import { initFaro } from '@/faro/initFaro';

function InitFaro() {
    useEffect(() => {
        initFaro();
    }, []);
    return null;
}

export { InitFaro };
