import { BodyLong, Button, Heading, Panel, ReadMore } from '@navikt/ds-react';
import lagHentTekstForSprak, { Tekster } from '../../../lib/lag-hent-tekst-for-sprak';
import useSprak from '../../../hooks/useSprak';
import { useEffect, useState } from 'react';
import StillingsSok from './stillings-sok';
import { SkjemaKomponentProps } from '../skjema-felleskomponenter';
import { SisteJobb } from '../../../model/skjema';
import useSWR from 'swr';
import { fetcher } from '../../../lib/api-utils';
import styles from '../../../styles/skjema.module.css';

const TEKSTER: Tekster<string> = {
    nb: {
        tittel: 'Hva er din siste jobb?',
        registrert: 'Følgende informasjon er registrert i Aa-registeret om din siste stilling.',
        feilOpplysninger: 'Hvis opplysningen er feil, kan du endre under.',
        brukesTilTittel: 'Hva bruker vi informasjonen om din siste stilling til?',
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

const SisteJobb = (props: SkjemaKomponentProps<SisteJobb> & { children?: JSX.Element; visSisteJobb: boolean }) => {
    const { onChange, visSisteJobb } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, useSprak());
    const [visStillingsSok, settVisStillingsSok] = useState<boolean>(false);
    const onCloseStillingssok = (value?: any) => {
        if (value) {
            onChange(value);
        }
        settVisStillingsSok(false);
    };

    const { data: sisteArbeidsforhold, error } = useSWR('api/sistearbeidsforhold/', fetcher);

    useEffect(() => {
        if (sisteArbeidsforhold && !props.valgt) {
            onChange(sisteArbeidsforhold);
        }
    }, [onChange, props.valgt, sisteArbeidsforhold]);

    useEffect(() => {
        if (error && !props.valgt) {
            onChange(annenStilling);
        }
    }, [error, onChange, props.valgt]);

    return (
        <Panel className={`${styles.panel} mbm`} border={true}>
            <div>
                <Heading spacing size={'medium'} level="1">
                    {tekst('tittel')}
                </Heading>
                <BodyLong>{tekst('registrert')}</BodyLong>
                <BodyLong className="mbm">{tekst('feilOpplysninger')}</BodyLong>

                {props.children}

                {visSisteJobb && (
                    <div className="mbs">
                        <Heading spacing size={'small'} level="2">
                            {tekst('stilling')}
                        </Heading>
                        {visStillingsSok ? (
                            <StillingsSok onClose={onCloseStillingssok} />
                        ) : (
                            <div>
                                {props.valgt?.label}
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
