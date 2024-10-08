import { BodyLong, Box, Button, Heading, ReadMore } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';

import useSprak from '../../../hooks/useSprak';
import { useRegistrering } from '../../../contexts/registrering-context';
import { useParamsFromContext } from '../../../contexts/params-from-context';

import StillingsSok from './stillings-sok-v2';
import SisteStilling from './siste-stilling';
import { fetcher } from '../../../lib/api-utils';
import {
    DinSituasjon,
    lagHentTekstForSprak,
    SisteJobb,
    SisteStillingValg,
    SporsmalId,
    Tekster,
} from '@navikt/arbeidssokerregisteret-utils';

const TEKSTER: Tekster<string> = {
    nb: {
        tittel: 'Hva er din siste jobb?',
        registrert: 'Følgende informasjon er registrert i Aa-registeret om siste stilling.',
        feilOpplysninger: 'Hvis opplysningen er feil, kan du endre under.',
        brukesTilTittel: 'Hva bruker vi informasjonen om siste stilling til?',
        brukesTilInnhold:
            'Vi bruker opplysningene til å lage offentlig statistikk om arbeidsmarkedet. Hvis opplysningene er feil, kan du endre dem. Da får NAV riktigere statistikk. Vær oppmerksom på at opplysningene er hentet fra Arbeidsgiver- og arbeidstakerregisteret (Aa-registeret). Endrer du opplysninger hos NAV, blir de bare lagret hos oss. I Aa-registeret er det kun arbeidsgivere som kan endre.',
        stilling: 'Stilling',
    },
};

const annenStilling: SisteJobb = {
    label: 'Annen stilling',
    konseptId: -1,
    styrk08: '-1',
};

type StillingssokValue = {
    konseptId: number;
    label: string;
    styrk08: string[] | string;
};

function stringifyStyrk08(value: StillingssokValue) {
    return {
        ...value,
        styrk08: Array.isArray(value.styrk08) ? value.styrk08[0] : value.styrk08,
    };
}

const SisteJobbSkjema = () => {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());
    const { registrering, setRegistrering } = useRegistrering();
    const [visStillingsSok, settVisStillingsSok] = useState<boolean>(false);
    const { params } = useParamsFromContext();
    const { fnr } = params;
    const router = useRouter();

    const onCloseStillingssok = (value?: StillingssokValue) => {
        if (value) {
            setRegistrering({
                [SporsmalId.sisteJobb]: stringifyStyrk08(value),
            });
        }
        settVisStillingsSok(false);
    };

    const sisteArbeidsforholdUrl = 'api/sistearbeidsforhold-fra-aareg-v2';

    const {
        data: sisteArbeidsforhold,
        error,
        isLoading,
    } = useSWRImmutable(`${sisteArbeidsforholdUrl}`, (url) => fetcher(url, { headers: { 'Nav-Personident': fnr } }));

    const visSisteJobb = registrering.sisteStilling !== SisteStillingValg.HAR_IKKE_HATT_JOBB;

    const visSisteStilling = registrering.dinSituasjon
        ? [
              DinSituasjon.AKKURAT_FULLFORT_UTDANNING,
              DinSituasjon.JOBB_OVER_2_AAR,
              DinSituasjon.USIKKER_JOBBSITUASJON,
          ].includes(registrering.dinSituasjon)
        : false;

    useEffect(() => {
        if (!registrering.sisteJobb) {
            if (sisteArbeidsforhold) {
                setRegistrering({ [SporsmalId.sisteJobb]: stringifyStyrk08(sisteArbeidsforhold) });
            } else if (!sisteArbeidsforhold && !isLoading) {
                // 204 fra server
                setRegistrering({ [SporsmalId.sisteJobb]: annenStilling });
            }
        }
    }, [registrering, sisteArbeidsforhold, isLoading]);

    useEffect(() => {
        if (error && error.status === 403) {
            router.push('/veiledning/mangler-tilgang-til-aa-registeret');
        }
    }, [error]);

    useEffect(() => {
        if (error && !registrering.sisteJobb) {
            setRegistrering({ [SporsmalId.sisteJobb]: annenStilling });
        }
    }, [error, registrering]);

    return (
        <Box className="mb-8" borderWidth="1" padding="4" style={{ backgroundColor: 'var(--a-gray-50)' }}>
            <div>
                <Heading spacing size={'medium'} level="1">
                    {tekst('tittel')}
                </Heading>

                {visSisteStilling && <SisteStilling />}

                {visSisteJobb && (
                    <div className="mbs">
                        <Heading spacing size={'small'} level="2">
                            {tekst('stilling')}
                        </Heading>
                        <BodyLong>{tekst('registrert')}</BodyLong>
                        <BodyLong className="mbm">{tekst('feilOpplysninger')}</BodyLong>

                        {visStillingsSok ? (
                            <StillingsSok onClose={onCloseStillingssok} />
                        ) : (
                            <div>
                                {registrering.sisteJobb?.label}
                                <Button variant="tertiary" className="mls" onClick={() => settVisStillingsSok(true)}>
                                    Endre
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <ReadMore header={tekst('brukesTilTittel')}>
                    <div style={{ maxWidth: '34rem' }}>{tekst('brukesTilInnhold')}</div>
                </ReadMore>
            </div>
        </Box>
    );
};

export default SisteJobbSkjema;
