'use client';

import type { ComponentType } from 'react';
import NAVSPA from '../../components/navspa';
import type { DecoratorProps, Environment, UrlFormat } from '../../model/internflate-decorator';
import { useModiaContext } from '../contexts/modia-context';

const Decorator: ComponentType<DecoratorProps> = NAVSPA.importer('internarbeidsflate-decorator-v3');

const InternflateDecorator: React.FC<{
	decoratorEnv: string;
	enableMock: boolean;
}> = (props) => {
	const { decoratorEnv, enableMock } = props;
	const { setFnr } = useModiaContext();

	const onFnrChanged = (fnr: unknown) => {
		if (typeof fnr === 'string') {
			setFnr(fnr);
		}
	};

	const decoratorProps = {
		appName: 'Arbeidssøkerregisteret',
		fetchActiveEnhetOnMount: true,
		fetchActiveUserOnMount: true,
		showSearchArea: true,
		onFnrChanged: onFnrChanged,
		showEnheter: true,
		proxy: '/modiacontextholder',
		showHotkeys: false,
		environment: decoratorEnv as Environment,
		urlFormat: 'NAV_NO' as UrlFormat,
	};

	if (enableMock) {
		return null;
	}

	return <Decorator {...decoratorProps} />;
};

export { InternflateDecorator };
