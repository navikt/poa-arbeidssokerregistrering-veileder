import { Box, Heading } from '@navikt/ds-react';

interface ProfileringProps {
    sisteProfilering: any;
}

function Profilering(props: ProfileringProps) {
    const { sisteProfilering } = props || {};

    if (!sisteProfilering) return null;

    return (
        <Box>
            <Heading level="1" size="small">
                Profilering
            </Heading>
        </Box>
    );
}

export default Profilering;
