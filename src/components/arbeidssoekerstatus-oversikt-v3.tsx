import { useEffect, useState } from 'react';
import { Box, Heading, Loader } from '@navikt/ds-react';
import { useRouter } from 'next/router';

import { useParamsFromContext } from '../contexts/params-from-context';
import { useConfig } from '../contexts/config-context';

import { Config } from '../model/config';

import KanRegistreresSomArbeidssoekerSjekk from './kan-registreres-som-arbeidssoeker-sjekk-v2';
import VelgRegistreringsKnapp from './velg-registreringsknapp-v2';
import VurderingskriterierForArbeidssoekerregistrering from './vurderingskriterier-for-arbeidssoekerregistrering-v2';
import AarsakerTilAtPersonenIkkeKanRegistreres from './aarsaker-til-at-personen-ikke-kan-registreres-v2';
import ArbeidssoekerMaaRegistreresIArena from './arbeidssoeker-maa-registreres-i-arena-foerst-v2';
import TilbakeTilForside from './tilbake-til-forside';

interface KanStartePeriodeProps {
    kanStarteArbeidssoekerperiode: boolean;
}

function RedirectTilRegistreringOmPeriodeKanStartes(props: KanStartePeriodeProps) {
    const router = useRouter();
    const { kanStarteArbeidssoekerperiode } = props;

    if (kanStarteArbeidssoekerperiode) {
        router.push('/registrering-arbeidssoker');
    }

    return null;
}

function ArbeidssoekerstatusOversiktV3() {
    const { params } = useParamsFromContext();
    const { enableMock } = useConfig() as Config;
    const { fnr, enhetId } = params;
    const brukerMock = enableMock === 'enabled';
    const [kanStarteArbeidssoekerperiode, setKanStarteArbeidssoekerperiode] = useState<boolean>(false);
    const [harSjekketOmPeriodeKanStartes, setHarSjekketOmPeriodeKanStartes] = useState<boolean>(false);
    const [visSjekkliste, setVisSjekkliste] = useState<boolean>(false);
    const [error, setError] = useState<any>(undefined);

    const sjekkKanStarteArbeidssoekerperiodeUrl = brukerMock
        ? '/api/mocks/kan-starte-arbeidssoekerperiode-v2'
        : '/api/kan-starte-arbeidssoekerperiode-v2';

    async function apiKall() {
        const payload = JSON.stringify({
            identitetsnummer: fnr,
        });

        try {
            const response = await fetch(sjekkKanStarteArbeidssoekerperiodeUrl, {
                method: 'PUT',
                body: payload,
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            if (response.ok) {
                setKanStarteArbeidssoekerperiode(true);
                setHarSjekketOmPeriodeKanStartes(true);
            } else {
                // noinspection ExceptionCaughtLocallyJS
                setKanStarteArbeidssoekerperiode(false);
                setHarSjekketOmPeriodeKanStartes(true);
                setVisSjekkliste(true);
                const data = await response.json();
                setError(data);
            }
        } catch (err: unknown) {
            setError(err);
        }
    }

    useEffect(() => {
        if (fnr && enhetId) {
            setKanStarteArbeidssoekerperiode(false);
            setHarSjekketOmPeriodeKanStartes(false);
            setVisSjekkliste(false);
            setError(undefined);
            apiKall();
        }
    }, [fnr, enhetId]);

    if (!fnr || !enhetId) return null;
    if (!harSjekketOmPeriodeKanStartes) {
        return (
            <div className={'flex place-content-center'}>
                <Loader size={'2xlarge'} />
            </div>
        );
    }

    return (
        <Box>
            <RedirectTilRegistreringOmPeriodeKanStartes kanStarteArbeidssoekerperiode={kanStarteArbeidssoekerperiode} />
            {visSjekkliste && (
                <>
                    <TilbakeTilForside sidenavn="Arbeidssøkerregistrering" />
                    <Heading level="1" size="large" className="mb-8 text-left">
                        Arbeidssøkerregistrering
                    </Heading>
                    <KanRegistreresSomArbeidssoekerSjekk
                        feilmelding={error}
                        kanStarteArbeidssoekerperiode={kanStarteArbeidssoekerperiode}
                    />
                    <AarsakerTilAtPersonenIkkeKanRegistreres feilmelding={error} />
                    <VurderingskriterierForArbeidssoekerregistrering feilmelding={error} />
                    <ArbeidssoekerMaaRegistreresIArena feilmelding={error} />
                    <VelgRegistreringsKnapp
                        feilmelding={error}
                        kanStarteArbeidssoekerperiode={kanStarteArbeidssoekerperiode}
                    />
                </>
            )}
        </Box>
    );
}

export default ArbeidssoekerstatusOversiktV3;
