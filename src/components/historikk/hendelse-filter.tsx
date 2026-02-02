import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { Button, Chips } from '@navikt/ds-react';
import React from 'react';
import { useFilterContext } from '../../contexts/hendelse-context';
import { TEKSTER } from '../tidslinjer/text';
import { HendelseType } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { ALLE_HENDELSER } from '../../lib/alle-hendelser';


const HendelseFilter: React.FC = () => {
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const { filters, toggleFilter, resetFiltersToDefault } = useFilterContext();

    const handleToggle = (hendelseType: HendelseType) => {
        toggleFilter(hendelseType);
    };
    

    return (
        <Chips>
            {ALLE_HENDELSER.map((hendelseType, i) => (
                <Chips.Toggle
                    key={i}
                    selected={filters.includes(hendelseType)}
                    onClick={() => handleToggle(hendelseType)}
                >
                    {tekst(hendelseType)}
                </Chips.Toggle>
            ))}
            <Button size="small" variant="tertiary" onClick={resetFiltersToDefault}>
                Nullstill filter
            </Button>
        </Chips>
    );
};

export { HendelseFilter };
