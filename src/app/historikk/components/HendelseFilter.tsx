import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import type { HendelseType } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { Button, Chips } from '@navikt/ds-react';
import type React from 'react';
import { useFilterContext } from '@/app/contexts/filter-hendelse-context';
import { TEKSTER } from '@/app/historikk/components/text';
import { ALLE_HENDELSER } from '@/lib/alle-hendelser';

const HendelseFilter: React.FC = () => {
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const { filters, toggleFilter, resetFiltersToDefault } = useFilterContext();

    const handleToggle = (hendelseType: HendelseType) => {
        toggleFilter(hendelseType);
    };

    return (
        <Chips>
            {ALLE_HENDELSER.map((hendelseType) => (
                <Chips.Toggle
                    key={`${hendelseType}`}
                    selected={filters.includes(hendelseType)}
                    onClick={() => handleToggle(hendelseType)}
                >
                    {tekst(hendelseType)}
                </Chips.Toggle>
            ))}
            <Button size='small' variant='tertiary' onClick={resetFiltersToDefault}>
                Nullstill filter
            </Button>
        </Chips>
    );
};

export { HendelseFilter };
