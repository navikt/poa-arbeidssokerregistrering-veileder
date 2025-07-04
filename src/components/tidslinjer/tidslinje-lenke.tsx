import { Box, Link } from '@navikt/ds-react';
import { loggAktivitet } from '../../lib/amplitude';

function TidslinjerLenke() {
    return (
        <Box className="mt-4 mb-4 text-start">
            <Link href="/tidslinjer" onClick={() => loggAktivitet({ aktivitet: 'Går til tidslinjer' })}>
                Se tidligere arbeidssøkerperioder og opplysninger
            </Link>
        </Box>
    );
}

export default TidslinjerLenke;
