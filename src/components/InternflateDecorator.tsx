import NAVSPA from '@navikt/navspa';
import { useParamsFromContext } from '../contexts/params-from-context';
import { ComponentType } from 'react';
import { DecoratorConfig } from '../model/internflate-decorator';

const brukerMock = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'enabled';
let _internarbeidsflatefs;

function hentDecoratorKomponent(): ComponentType<DecoratorConfig> {
    if (_internarbeidsflatefs) {
        return _internarbeidsflatefs;
    }

    _internarbeidsflatefs = NAVSPA.importer('internarbeidsflatefs');
    return _internarbeidsflatefs;
}

const InternflateDecorator = () => {
    const { params, setParams } = useParamsFromContext();
    const { fnr, enhetId } = params;

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

    const Decorator = hentDecoratorKomponent();

    return <Decorator {...props} />;
};

export default InternflateDecorator;
