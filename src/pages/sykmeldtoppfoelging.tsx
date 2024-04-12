import { Box, Heading, List, Button } from '@navikt/ds-react';
import { useRouter } from 'next/router';

import { useParamsFromContext } from '../contexts/params-from-context';

import RedirectTilVedlikehold from '../components/redirect-til-vedlikehold';
import ManglerPersonEllerEnhet from '../components/feilmeldinger/mangler-person-eller-enhet';
import { withAuthenticatedPage } from '../auth/withAuthentication';

export default function MerSykmeldtoppfoelging() {
    const router = useRouter();
    const { params } = useParamsFromContext();
    const { fnr } = params;

    return (
        <Box className="flex flex-col items-center p-8">
            <RedirectTilVedlikehold />
            <Heading level="1" size="large" className="mb-8 text-center">
                Registrering for mer sykmeldtoppfølging
            </Heading>
            <ManglerPersonEllerEnhet />
            {fnr && (
                <Box>
                    <List as="ul" title="Velg denne registreringen hvis">
                        <List.Item>Personen har arbeidsgiver og en aktiv sykemelding</List.Item>
                        <List.Item>Personen skal ha oppfølging etter at sykefraværet er over</List.Item>
                        <List.Item>Personen er ikke arbeidssøker</List.Item>
                    </List>
                    <Button
                        variant="secondary-neutral"
                        onClick={() => router.push('/kan-registreres-for-sykmeldtoppfoelging')}
                    >
                        Start registrering for mer sykmeldtoppfølging
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export const getServerSideProps = withAuthenticatedPage();
