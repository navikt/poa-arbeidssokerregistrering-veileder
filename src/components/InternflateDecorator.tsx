import NAVSPA from '@navikt/navspa';
import { ComponentType } from 'react';
import { useRouter } from 'next/router';

import { useParamsFromContext } from '../contexts/params-from-context';
import { DecoratorProps, Environment, UrlFormat } from '../model/internflate-decorator';
import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';

const Decorator: ComponentType<DecoratorProps> = NAVSPA.importer('internarbeidsflate-decorator-v3');

const routesSomIkkeSkalRefreshes = ['/avslutt-arbeidssoekerperiode', '/sykmeldtoppfoelging'];

const InternflateDecorator = () => {
    const { params } = useParamsFromContext();
    const { fnr, enhetId } = params;
    const { enableMock, decoratorEnv } = useConfig() as Config;
    const router = useRouter();
    const brukerMock = typeof enableMock === 'undefined' || enableMock === 'enabled';

    const onFnrChanged = (fnr) => {
        // setParams({ fnr: fnr });
        if (!routesSomIkkeSkalRefreshes.includes(router.pathname)) {
            router.push('/');
        }
    };

    const onEnhetChanged = (enhet) => {
        // setParams({ enhetId: enhet });
        if (!routesSomIkkeSkalRefreshes.includes(router.pathname)) {
            router.push('/');
        }
    };

    const props = {
        appName: 'Arbeidssøkerregisteret for veileder',
        syncEnhetOnMount: true,
        fnr: fnr,
        showSearchArea: true,
        onFnrChanged: onFnrChanged,
        enhet: enhetId,
        showEnheter: true,
        onEnhetChanged: onEnhetChanged,
        proxy: '/modiacontextholder',
        showHotkeys: false,
        environment: decoratorEnv as Environment,
        urlFormat: 'NAV_NO' as UrlFormat,
    };

    if (brukerMock) {
        return null;
    }

    return <Decorator {...props} />;
};

export default InternflateDecorator;
