'use client';

import { Heading } from '@navikt/ds-react';
import { useEffect, useRef } from 'react';

export function Kvitteringsoverskrift({ children }: { children: string }) {
    const headingRef = useRef<HTMLHeadingElement>(null);

    // biome-ignore lint/correctness/useExhaustiveDependencies: Focus again only when the receipt title changes.
    useEffect(() => {
        headingRef.current?.focus();
    }, [children]);

    return (
        <Heading ref={headingRef} level='1' size='small' className='mbl' tabIndex={-1}>
            {children}
        </Heading>
    );
}
