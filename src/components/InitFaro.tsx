'use client';

import { useEffect } from 'react';
import { initFaro } from '@/lib/faro/initFaro';

function InitFaro() {
    useEffect(() => {
        initFaro();
    }, []);
    return null;
}

export { InitFaro };
