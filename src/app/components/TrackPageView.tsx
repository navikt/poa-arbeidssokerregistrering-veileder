'use client';

import { useEffect } from 'react';
import { loggVisning, type VisningsData } from '@/lib/tracking';

type TrackPageViewProps = {
    data: VisningsData;
};

function TrackPageView({ data }: TrackPageViewProps) {
    const viser = data.viser;
    useEffect(() => {
        loggVisning({ viser });
    }, [viser]);
    return null;
}
export { TrackPageView };
