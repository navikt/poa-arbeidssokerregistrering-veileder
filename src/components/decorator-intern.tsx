'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useLayoutEffect, useRef } from 'react';
import { useModiaContext } from '../contexts/modia-context';

const REDIRECT_PATHS = ['/registrering-arbeidssoeker-sjekk', '/registrering-arbeidssoker', '/oppdater-opplysninger'];

const InternflateDecorator: React.FC<{
    decoratorEnv: string;
}> = (props) => {
    const { decoratorEnv } = props;
    const { fnr, setFnr } = useModiaContext();
    const pathname = usePathname();
    const router = useRouter();
    const decoratorRef = useRef<InternarbeidsflateDecoratorElement>(null);

    const fnrRef = useRef(fnr);
    fnrRef.current = fnr;

    const pathnameRef = useRef(pathname);
    pathnameRef.current = pathname;

    const handleFnrChanged = useCallback(
        (event: CustomEvent<FnrChangedDetail>) => {
            const { fnr: nyttFnr } = event.detail;
            if (typeof nyttFnr === 'string' && nyttFnr.length > 0) {
                setFnr(nyttFnr);
                if (nyttFnr !== fnrRef.current && REDIRECT_PATHS.includes(pathnameRef.current)) {
                    router.push('/');
                }
            } else {
                setFnr(null);
                router.push('/');
            }
        },
        [setFnr, router],
    );

    useLayoutEffect(() => {
        const el = decoratorRef.current;
        if (!el) return;
        el.addEventListener('fnr-changed', handleFnrChanged);
        return () => {
            el.removeEventListener('fnr-changed', handleFnrChanged);
        };
    }, [handleFnrChanged]);

    return (
        <internarbeidsflate-decorator
            ref={decoratorRef}
            app-name='Arbeidssøkerregisteret'
            environment={decoratorEnv}
            url-format='NAV_NO'
            show-enheter={'true'}
            show-search-area={'true'}
            show-hotkeys={'false'}
            fetch-active-user-on-mount={'true'}
            include-credentials={'true'}
            proxy='/modiacontextholder'
        />
    );
};

export { InternflateDecorator };
