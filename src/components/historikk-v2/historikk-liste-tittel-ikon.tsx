import React from 'react';
import { Tooltip } from '@navikt/ds-react';
import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, TrashFillIcon } from '@navikt/aksel-icons';
import { skalHaSoppelbotte, skalHaVarseltrekant } from './helpers';
import { Hendelse } from '../../model/schema-api.types';

type HistorikkListeTittelIkonProps = {
    hendelser: Hendelse[];
};

const HistorikkListeTittelIkon: React.FC<HistorikkListeTittelIkonProps> = (props) => {
    const { hendelser } = props;
    if (skalHaSoppelbotte(hendelser))
        return (
            <Tooltip content="Slettet">
                <TrashFillIcon className="mr-4" color="red" />
            </Tooltip>
        );
    if (skalHaVarseltrekant(hendelser))
        return (
            <Tooltip content="Problematisk">
                <ExclamationmarkTriangleFillIcon className="mr-4" color="orange" />
            </Tooltip>
        );
    return (
        <Tooltip content="Ingen problemer">
            <CheckmarkCircleFillIcon className="mr-4" color="green" />
        </Tooltip>
    );
};

export { HistorikkListeTittelIkon };
