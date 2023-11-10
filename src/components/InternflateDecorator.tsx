import NAVSPA from '@navikt/navspa';
import { useParamsFromContext } from '../contexts/params-from-context';

interface InternflateDecoratorProps {
    fnr: string;
    enhetId: string;
}
const Decorator = NAVSPA.importer<InternflateDecoratorProps>('internarbeidsflatefs');
const InternflateDecorator = () => {
    const { fnr, enhetId } = useParamsFromContext();

    return <Decorator fnr={fnr ?? null} enhetId={enhetId} />;
};

export default InternflateDecorator;
