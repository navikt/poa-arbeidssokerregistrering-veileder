import { Box, Heading } from '@navikt/ds-react';

import Helseproblemer from './helseproblemer';
import AndreProblemer from './andre-problemer';

const Hindringer = () => {
    return (
        <Box className="mb-8" borderWidth="1" padding="4" style={{ backgroundColor: 'var(--a-gray-50)' }}>
            <Heading size="medium" spacing level="1">
                Hindringer
            </Heading>
            <Helseproblemer />
            <AndreProblemer />
        </Box>
    );
};

export default Hindringer;
