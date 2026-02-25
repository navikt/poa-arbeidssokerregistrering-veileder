'use client';

import { useEffect } from 'react';
import { initFaro } from '@/faro/initFaro';

type FaroWrapperProps = {
    children: React.ReactNode;
};

function FaroWrapper({ children }: FaroWrapperProps) {
    useEffect(() => {
        initFaro();
    }, []);
    return <>{children}</>;
}
export { FaroWrapper };
