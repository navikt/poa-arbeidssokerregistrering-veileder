import { BodyLong, Box, Button, Heading } from '@navikt/ds-react';
import { useRouter } from 'next/router';

interface Props {}

function BekreftelseInformasjon(props: Props) {
    const router = useRouter();
    return (
        <Box>
            <Heading level="1" size="small">
                Bekreftelse
            </Heading>
            <BodyLong>Neste periode som må bekreftes er fra 03. september - 17. september</BodyLong>
            <Button variant={'secondary-neutral'} onClick={() => router.push('/bekreftelse')}>
                Send inn bekreftelse
            </Button>
        </Box>
    );
}

export default BekreftelseInformasjon;
