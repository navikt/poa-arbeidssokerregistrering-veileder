import { useParamsFromContext } from '../contexts/params-from-context';
import useApiKall from '../hooks/useApiKall';
import { useConfig } from '../contexts/config-context';
import { Config } from '../model/config';
import { SamletInformasjon } from '@navikt/arbeidssokerregisteret-utils';
import { Alert, BodyShort, Box, Button, Heading } from '@navikt/ds-react';
import LenkeTilHistorikk from './lenke-til-historikk';
import VelgRegistreringsKnapp from './velg-registreringsknapp-v2';
import ArbeidssoekerstatusOversiktV2 from './arbeidssoekerstatus-oversikt-v2';
import { useRouter } from 'next/router';

function NyForside() {
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const router = useRouter();
    const brukerMock = enableMock === 'enabled';

    const hentSamletInformasjonUrl = brukerMock
        ? '/api/mocks/oppslag-samlet-informasjon'
        : '/api/oppslag-samlet-informasjon';

    const { fnr } = params;
    const { data: samletInformasjon } = useApiKall<SamletInformasjon>(
        hentSamletInformasjonUrl,
        'POST',
        JSON.stringify({ foedselsnummer: fnr }),
    );

    const harAktivPeriode = samletInformasjon?.arbeidssoekerperioder[0]?.avsluttet === null;
    const harOpplysninger = samletInformasjon?.opplysningerOmArbeidssoeker.length > 0;

    if (!harAktivPeriode) {
        return (
            <>
                <Alert variant="warning">Personen er ikke registrert som arbeidssøker</Alert>
                {harOpplysninger ? (
                    <div className={'mt-4'}>
                        <Heading level={'3'} size={'medium'}>
                            Sist registrert som arbeidssøker
                        </Heading>
                        <BodyShort textColor={'subtle'} size={'small'}>
                            {samletInformasjon.opplysningerOmArbeidssoeker[0]?.sendtInnAv.tidspunkt} av{' '}
                            {samletInformasjon.opplysningerOmArbeidssoeker[0]?.sendtInnAv.kilde}
                        </BodyShort>
                        <LenkeTilHistorikk harIngenArbeidssoekerperioder={true} />
                    </div>
                ) : (
                    <Heading level={'3'} size={'medium'} className={'mt-4'}>
                        Har ikke vært registrert som arbeidssøker
                    </Heading>
                )}

                <Box className={'mt-4'}>
                    <Button variant="secondary-neutral" onClick={() => router.push('/registrering-arbeidssoker')}>
                        Registrer som arbeidssøker
                    </Button>
                </Box>
            </>
        );
    } else {
        return <ArbeidssoekerstatusOversiktV2 />;
    }
}

export default NyForside;
