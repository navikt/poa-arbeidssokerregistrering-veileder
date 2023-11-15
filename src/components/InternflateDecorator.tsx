import NAVSPA from '@navikt/navspa';
import { useParamsFromContext } from '../contexts/params-from-context';
import { ComponentType } from 'react';
import { DecoratorConfig } from '../model/internflate-decorator';

const brukerMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';
const Decorator: ComponentType<DecoratorConfig> = NAVSPA.importer('internarbeidsflatefs');
const InternflateDecorator = () => {
    const { params, setParams } = useParamsFromContext();
    const { fnr, enhetId } = params;

    const onFnrChanged = (fnr) => {
        setParams({ fnr: fnr });
        console.log('onFnrChanged', fnr);
    };

    const onEnhetChanged = (enhet) => {
        setParams({ enhetId: enhet });
        console.log('onEnhetChanged', enhet);
    };

    const props = {
        appname: 'Arbeidssøkerregistrering veileder',
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
