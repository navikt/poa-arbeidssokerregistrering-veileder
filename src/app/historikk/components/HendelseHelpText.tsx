import type { HendelseType } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { HelpText } from '@navikt/ds-react';
import { getHendelseForklaring } from '@/app/historikk/components/hendelse-forklaringer';

type HendelseHelpTextProps = {
    type: HendelseType;
    source?: string;
    modifier?: string;
};

function HendelseHelpText({ type, source, modifier }: HendelseHelpTextProps) {
    const forklaring = getHendelseForklaring(type, source, modifier);
    if (!forklaring) return null;

    return (
        <HelpText title='Hva betyr dette?' wrapperClassName='whitespace-normal'>
            {forklaring}
        </HelpText>
    );
}

export { HendelseHelpText };
