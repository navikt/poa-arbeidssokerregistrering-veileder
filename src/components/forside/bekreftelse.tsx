import { BodyShort, Box, Button, Heading } from '@navikt/ds-react';
import { CheckmarkCircleIcon, TimerStartIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/router';

interface Props {
    harTilgjengeligBekreftelse: boolean;
}

function Bekreftelse(props: Props) {
    const { harTilgjengeligBekreftelse } = props;
    const router = useRouter();

    return (
        <Box className={'mb-4'}>
            <Heading level="3" size="small">
                Bekreftelse
            </Heading>
            {!harTilgjengeligBekreftelse && (
                <div className={'flex'}>
                    <CheckmarkCircleIcon title="a11y-title" fontSize="1.5rem" className={'mr-4'} />
                    <BodyShort textColor={'subtle'}>Ingen ubekreftede arbeidssøkerperiode</BodyShort>
                </div>
            )}
            {harTilgjengeligBekreftelse && (
                <>
                    <div className={'flex mb-4'}>
                        <TimerStartIcon title="a11y-title" fontSize="1.5rem" className={'mr-4'} />
                        <BodyShort textColor={'subtle'}>Personen har en ubekreftet arbeidssøkerperiode</BodyShort>
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
