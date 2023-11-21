import NAVSPA from '@navikt/navspa';
import { useParamsFromContext } from '../contexts/params-from-context';
import { ComponentType } from 'react';
import { DecoratorConfig } from '../model/internflate-decorator';
import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';

const Decorator: ComponentType<DecoratorConfig> = NAVSPA.importer('internarbeidsflatefs');
const InternflateDecorator = () => {
    const { params, setParams } = useParamsFromContext();
    const { fnr, enhetId } = params;
    const { enableMock } = useConfig() as Config;
    const brukerMock = typeof enableMock === 'undefined' || enableMock === 'enabled';

    const onFnrChanged = (fnr) => {
        setParams({ fnr: fnr });
    };

    const onEnhetChanged = (enhet) => {
        setParams({ enhetId: enhet });
    };

    const props = {
        appname: 'Arbeidssøkerregistrering for veileder',
        toggles: {
            visVeileder: true,
        },
        fnr: {
            display: 'SOKEFELT',
            value: fnr,
            skipModal: false,
            ignoreWsEvents: false,
            onChange: onFnrChanged,
        },
        enhet: {
            display: 'ENHET',
            value: enhetId,
            skipModal: true,
            ignoreWsEvents: true,
            onChange: onEnhetChanged,
        },
        useProxy: true,
    };

    if (brukerMock) {
        return null;
    }

    return <Decorator {...props} />;
};

export default InternflateDecorator;
