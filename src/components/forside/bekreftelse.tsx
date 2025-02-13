import { Box, Button, Heading } from '@navikt/ds-react';
import { CheckmarkCircleIcon, TimerStartIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/router';

interface Props {
    harTilgjengeligBekreftelse: boolean;
}

function Bekreftelse(props: Props) {
    const { harTilgjengeligBekreftelse } = props;
    const router = useRouter();

    return (
        <Box>
            <Heading level="3" size="small">
                Bekreftelse
            </Heading>
            {!harTilgjengeligBekreftelse && (
                <div className={'flex'}>
                    <CheckmarkCircleIcon title="a11y-title" fontSize="1.5rem" className={'mr-4'} />
                    Ingen ubekreftede arbeidssøkerperiode
                </div>
            )}
            {harTilgjengeligBekreftelse && (
                <>
                    <div className={'flex'}>
                        <TimerStartIcon title="a11y-title" fontSize="1.5rem" className={'mr-4'} />
                        Personen har en ubekreftet arbeidssøkerperiode
                    </div>
                    <Button variant={'secondary'} onClick={() => router.push('/bekreftelse')}>
                        Bekreft arbeidssøkerperiode på vegne av bruker
                    </Button>
                </>
            )}
        </Box>
    );
}

export default Bekreftelse;
