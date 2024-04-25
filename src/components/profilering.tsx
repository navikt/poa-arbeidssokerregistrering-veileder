import { BodyLong, Box, Heading } from '@navikt/ds-react';

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
            <BodyLong>{JSON.stringify(sisteProfilering)}</BodyLong>
        </Box>
    );
}

export default Profilering;
