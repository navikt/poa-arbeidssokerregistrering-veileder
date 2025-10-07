import { HendelseType, lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { Button, Chips } from '@navikt/ds-react';
import React from 'react';
import { useFilterContext } from '../../contexts/hendelse-context';
import { TEKSTER } from '../tidslinjer/text';

type HendelseFilterProps = {
    tilgjengeligeHendelseTyper: HendelseType[];
};

const HendelseFilter: React.FC<HendelseFilterProps> = (props) => {
    const { tilgjengeligeHendelseTyper } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const { filters, toggleFilter, resetFiltersToDefault } = useFilterContext();

    const handleToggle = (hendelseType: HendelseType) => {
        toggleFilter(hendelseType);
    };

    return (
        <div>
            <Chips>
                {tilgjengeligeHendelseTyper.map((hendelseType, i) => (
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
        </div>
    );
};

export { HendelseFilter };
