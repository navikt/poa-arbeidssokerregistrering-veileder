'use client';

import { Link, type LinkProps } from '@navikt/ds-react';
import { type MouseEvent, type ReactNode, useCallback } from 'react';
import { type AktivitetData, loggAktivitet } from '@/lib/tracking';

type TrackAktivitetProps = Omit<LinkProps, 'children' | 'href' | 'onClick'> & {
    data: AktivitetData;
    href: string;
    children: ReactNode;
    onClick?: LinkProps['onClick'];
};

function TrackAktivitet({ data, href, children, onClick, ...linkProps }: TrackAktivitetProps) {
    const handleClick = useCallback(
        (e: MouseEvent<HTMLAnchorElement>) => {
            loggAktivitet(data);
            onClick?.(e);
        },
        [data, onClick],
    );

    return (
        <Link {...linkProps} href={href} onClick={handleClick}>
            {children}
        </Link>
    );
}

export { TrackAktivitet };
