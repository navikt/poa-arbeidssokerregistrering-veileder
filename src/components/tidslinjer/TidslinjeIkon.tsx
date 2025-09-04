import React from 'react';
import { Hendelse } from '../../model/tidslinjer';
import { skalHaSoppelbotte, skalHaVarseltrekant } from './helpers';
import { Tooltip } from '@navikt/ds-react';
import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, TrashFillIcon } from '@navikt/aksel-icons';

type TidslinjeIkonProps = {
    hendelser: Hendelse[]
};


const TidslinjeIkon: React.FC<TidslinjeIkonProps> = (props) => {
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

export { TidslinjeIkon };