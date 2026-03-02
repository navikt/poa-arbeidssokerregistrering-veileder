'use client';

import { cloneElement, type MouseEvent, type ReactElement, useCallback } from 'react';
import { type AktivitetData, loggAktivitet } from '@/lib/tracking';

type TrackAktivitetProps = {
    data: AktivitetData;
    children: ReactElement<{ onClick?: (e: MouseEvent) => void }>;
};

function TrackAktivitet({ data, children }: TrackAktivitetProps) {
    const childOnClick = children.props.onClick;

    const handleClick = useCallback(
        (e: MouseEvent) => {
            loggAktivitet(data);
            childOnClick?.(e);
        },
        [data, childOnClick],
    );

    return cloneElement(children, { onClick: handleClick });
}

export { TrackAktivitet };
