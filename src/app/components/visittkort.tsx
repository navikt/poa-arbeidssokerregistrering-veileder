'use client';

import { useModiaContext } from '../contexts/modia-context';

type VisittkortProps = {
	brukerMock: boolean;
};

const Visittkort: React.FC<VisittkortProps> = (props) => {
	const { brukerMock } = props;
	const modia = useModiaContext();

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
