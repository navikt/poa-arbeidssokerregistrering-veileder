import type { PeriodeAvsluttetHendelse } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { Alert, BodyShort, Box, Button, Heading } from '@navikt/ds-react';
import Link from 'next/link';
import { HistorikkLenke } from '@/app/(forside)/components/HistorikkLenke';
import { TidslinjerLenke } from '@/app/(forside)/components/TidslinjerLenke';
import { mapUtfoertAvType } from '@/components/forside/mapUtfoertAvType';
import { prettyPrintDatoOgKlokkeslett } from '@/lib/date-utils';
import { oversettSluttaarsak } from '@/lib/oversett-sluttaarsak';

type IkkeAktivPeriodeProps = {
    avsluttetHendelse?: PeriodeAvsluttetHendelse;
};

function IkkeAktivPeriode({ avsluttetHendelse }: IkkeAktivPeriodeProps) {
    const sluttaarsak = oversettSluttaarsak('nb');

    return (
        <>
            <Alert variant='warning'>Personen er ikke registrert som arbeidssøker</Alert>
            <Box className={'mt-4'}>
                {avsluttetHendelse !== undefined ? (
                    <>
                        <Heading level={'3'} size={'medium'}>
                            Sist registrert som arbeidssøker
                        </Heading>
                        <BodyShort textColor={'subtle'} size={'small'}>
                            Arbeidssøkerperioden ble avsluttet{' '}
                            {prettyPrintDatoOgKlokkeslett(avsluttetHendelse.tidspunkt)} av{' '}
                            {mapUtfoertAvType(avsluttetHendelse.sendtInnAv.utfoertAv.type)}
                        </BodyShort>
                        <BodyShort textColor={'subtle'} size={'small'}>
                            Sluttårsak: {sluttaarsak(avsluttetHendelse.sendtInnAv.aarsak ?? 'fortsatt aktiv')}
                        </BodyShort>
                        <Box className='flex justify-between'>
                            <HistorikkLenke />
                            <TidslinjerLenke />
                        </Box>
                    </>
                ) : (
                    <Heading level={'3'} size={'medium'}>
                        Har ikke vært registrert som arbeidssøker
                    </Heading>
                )}
            </Box>
            <Box className={'mt-4'}>
                <Link href='/registrering-arbeidssoeker-sjekk' passHref>
                    <Button as='a' variant={'secondary'}>
                        Start registrering som arbeidssøker
                    </Button>
                </Link>
            </Box>
        </>
    );
}
export { IkkeAktivPeriode };
