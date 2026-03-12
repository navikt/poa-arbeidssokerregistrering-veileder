'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { ComponentType } from 'react';
import NAVSPA from '@/components/navspa';
import { useModiaContext } from '../contexts/modia-context';
import type { DecoratorProps, Environment, UrlFormat } from '../model/internflate-decorator';

const Decorator: ComponentType<DecoratorProps> = NAVSPA.importer('internarbeidsflate-decorator-v3');

const InternflateDecorator: React.FC<{
    decoratorEnv: string;
}> = (props) => {
    const { decoratorEnv } = props;
    const { setFnr } = useModiaContext();
    const pathname = usePathname();
    const router = useRouter();

    const redirectPaths = ['/registrering-arbeidssoeker-sjekk', '/registrering-arbeidssoker', '/oppdater-opplysninger'];

    const onFnrChanged = (fnr: unknown) => {
        if (typeof fnr === 'string' && fnr.length > 0) {
            setFnr(fnr);
        } else {
            setFnr(null);
            if (redirectPaths.includes(pathname)) {
                router.push('/');
            }
        }
    };

    const decoratorProps = {
        appName: 'Arbeidssøkerregisteret',
        fetchActiveEnhetOnMount: true,
        fetchActiveUserOnMount: true,
        showSearchArea: true,
        onFnrChanged: onFnrChanged,
        showEnheter: true,
        proxy: '/modiacontextholder',
        showHotkeys: false,
        environment: decoratorEnv as Environment,
        urlFormat: 'NAV_NO' as UrlFormat,
    };

    return <Decorator {...decoratorProps} />;
};

export { InternflateDecorator };
