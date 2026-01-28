import { Box } from '@navikt/ds-react';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { Config } from '../model/config';

export const Visittkort = () => {
    const { params } = useParamsFromContext();
    const { fnr, enhetId } = params;
    const { enableMock } = useConfig() as Config;
    const brukerMock = typeof enableMock === 'undefined' || enableMock === 'enabled';

    if (brukerMock || !fnr) {
        return null;
    }

    return (
        <Box>
            <ao-visittkort
                enhet={'1234'}
                fnr={'123123123'}
                tilbakeTilFlate={'http://veilarbportefolje.nav.no'}
                visVeilederVerktoy={'true'}
                key={fnr}
            ></ao-visittkort>
        </Box>
    );
};
