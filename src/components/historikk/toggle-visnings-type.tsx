import { Switch } from '@navikt/ds-react';
import React from 'react';
import { useVisningTypeContext } from '../../contexts/hendelse-visning-context';

const ToggleVisningsType: React.FC = () => {
    const { toggleVisningsType } = useVisningTypeContext();

    return <Switch onChange={toggleVisningsType}>Vis innhold ekspandert</Switch>;
};

export { ToggleVisningsType };
