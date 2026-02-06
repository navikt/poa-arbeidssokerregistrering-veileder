import type React from 'react';
import type { ModiaContext } from '../lib/models';

type VisittkortProps = {
	modia: ModiaContext;
	brukerMock: boolean;
};

const Visittkort: React.FC<VisittkortProps> = (props) => {
	const { modia, brukerMock } = props;

	if (brukerMock || !modia.fnr) {
		return null;
	}

	return (
		<ao-visittkort
			enhet={modia.enhetId}
			fnr={modia.fnr}
			tilbakeTilFlate={'veilarbportefoljeflatefs'}
			visVeilederVerktoy={'false'}
			key={modia.fnr}
		></ao-visittkort>
	);
};

export { Visittkort };
