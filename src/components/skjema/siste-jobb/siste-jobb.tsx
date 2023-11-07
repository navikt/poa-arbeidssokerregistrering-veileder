import { BodyLong, Button, Heading, Panel, ReadMore } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import useSprak from '../../../hooks/useSprak';
import { useRegistrering } from '../../../contexts/registrering-context';

import lagHentTekstForSprak, { Tekster } from '../../../lib/lag-hent-tekst-for-sprak';
import StillingsSok from './stillings-sok';
import SisteStilling from './siste-stilling';
import { SisteJobb } from '../../../model/skjema';
import { DinSituasjon, SisteStillingValg, SporsmalId } from '../../../model/sporsmal';
import { fetcher } from '../../../lib/api-utils';

import styles from '../../../styles/skjema.module.css';
import { useParamsFromContext } from '../../../contexts/params-from-context';

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

const SisteJobb = () => {
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());
    const { registrering, setRegistrering } = useRegistrering();
    const [visStillingsSok, settVisStillingsSok] = useState<boolean>(false);
    const { fnr } = useParamsFromContext();
    const onCloseStillingssok = (value?: any) => {
        if (value) {
            setRegistrering({ [SporsmalId.sisteJobb]: value });
        }
        settVisStillingsSok(false);
    };

    const { data: sisteArbeidsforhold, error } = useSWR(`api/sistearbeidsforhold?fnr=${fnr}`, fetcher);

    const visSisteJobb = registrering.sisteStilling !== SisteStillingValg.HAR_IKKE_HATT_JOBB;
    const visSisteStilling = registrering.dinSituasjon
        ? [
              DinSituasjon.AKKURAT_FULLFORT_UTDANNING,
              DinSituasjon.JOBB_OVER_2_AAR,
              DinSituasjon.USIKKER_JOBBSITUASJON,
          ].includes(registrering.dinSituasjon)
        : false;

    useEffect(() => {
        if (sisteArbeidsforhold && !registrering.sisteJobb) {
            setRegistrering({ [SporsmalId.sisteJobb]: sisteArbeidsforhold });
        }
    }, [registrering, sisteArbeidsforhold]);

    useEffect(() => {
        if (error && !registrering.sisteJobb) {
            setRegistrering({ [SporsmalId.sisteJobb]: annenStilling });
        }
    }, [error, registrering]);

    return (
        <Panel className={`${styles.panel} mbm`} border={true}>
            <div>
                <Heading spacing size={'medium'} level="1">
                    {tekst('tittel')}
                </Heading>

                {visSisteStilling && (
                    <SisteStilling
                        onChange={(value) => setRegistrering({ [SporsmalId.sisteJobb]: value })}
                        valgt={registrering.sisteStilling}
                    />
                )}

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
        </Panel>
    );
};

export default SisteJobb;
