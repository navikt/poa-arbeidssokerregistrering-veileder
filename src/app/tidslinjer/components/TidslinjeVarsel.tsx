import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, TrashFillIcon } from '@navikt/aksel-icons';
import type { Hendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { Tooltip } from '@navikt/ds-react';
import { skalHaSoppelbotte, skalHaVarseltrekant } from './tidslinje-varsel-utils';

type TidslinjeVarselProps = {
	hendelser: Hendelse[];
};

const TidslinjeVarsel: React.FC<TidslinjeVarselProps> = (props) => {
	const { hendelser } = props;
	if (skalHaSoppelbotte(hendelser))
		return (
			<Tooltip content='Slettet'>
				<TrashFillIcon color='red' />
			</Tooltip>
		);
	if (skalHaVarseltrekant(hendelser))
		return (
			<Tooltip content='Problematisk'>
				<ExclamationmarkTriangleFillIcon color='orange' />
			</Tooltip>
		);
	return (
		<Tooltip content='Ingen problemer'>
			<CheckmarkCircleFillIcon color='green' />
		</Tooltip>
	);
};

export { TidslinjeVarsel };
