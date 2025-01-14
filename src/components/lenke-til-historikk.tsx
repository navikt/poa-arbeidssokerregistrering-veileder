import { Box, Link } from '@navikt/ds-react';

import { useParamsFromContext } from '../contexts/params-from-context';

import { loggAktivitet } from '../lib/amplitude';

interface Props {
    harIngenArbeidssoekerperioder: boolean;
}

function LenkeTilHistorikk(props: Props) {
    const { harIngenArbeidssoekerperioder } = props;
    const { params } = useParamsFromContext();
    const { fnr } = params;

    if (harIngenArbeidssoekerperioder) {
        return null;
    }

    if (!fnr) {
        return null;
    }

    return (
        <Box className="mt-4 mb-4 text-end">
            <Link href="/historikk" onClick={() => loggAktivitet({ aktivitet: 'Går til historikk' })}>
                Se tidligere arbeidssøkerperioder og opplysninger
            </Link>
        </Box>
    );
}

export default LenkeTilHistorikk;
