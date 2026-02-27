'use client';

import {
    DinSituasjon,
    lagHentTekstForSprak,
    SisteStillingValg,
    SPORSMAL_TEKSTER,
    SporsmalId,
} from '@navikt/arbeidssokerregisteret-utils';
import { BodyLong, Box, Button, Heading, ReadMore } from '@navikt/ds-react';
import { useState } from 'react';
import { StillingsSok } from '@/app/components/skjema/StillingsSok';
import RadioGruppe from '@/components/radio-gruppe/radio-gruppe';
import type { RegistreringState } from '@/model/registrering';

type SisteJobbProps = {
    registrering: RegistreringState;
    setRegistrering: (data: Partial<RegistreringState>) => void;
    doValidate: boolean;
};

type StillingssokValue = {
    konseptId: number;
    label: string;
    styrk08: string[] | string;
};

const SITUASJONER_MED_SISTE_STILLING = [
    DinSituasjon.AKKURAT_FULLFORT_UTDANNING,
    DinSituasjon.JOBB_OVER_2_AAR,
    DinSituasjon.USIKKER_JOBBSITUASJON,
];

function normaliserStyrk08(value: StillingssokValue) {
    return {
        ...value,
        styrk08: Array.isArray(value.styrk08) ? (value.styrk08[0] ?? '-1') : value.styrk08,
    };
}

function SisteJobb({ registrering, setRegistrering, doValidate }: SisteJobbProps) {
    const tekst = lagHentTekstForSprak(SPORSMAL_TEKSTER, 'nb');
    const [visStillingsSok, setVisStillingsSok] = useState(false);

    const dinSituasjon = registrering.dinSituasjon;
    const visSisteStilling = dinSituasjon !== undefined && SITUASJONER_MED_SISTE_STILLING.includes(dinSituasjon);
    const visSisteJobb = registrering.sisteStilling !== SisteStillingValg.HAR_IKKE_HATT_JOBB;
    const visFeilmeldingSisteStilling = doValidate && !Object.keys(registrering).includes(SporsmalId.sisteStilling);

    const onCloseStillingssok = (value?: StillingssokValue) => {
        if (value) {
            setRegistrering({ [SporsmalId.sisteJobb]: normaliserStyrk08(value) });
        }
        setVisStillingsSok(false);
    };

    return (
        <Box className='mb-8' borderWidth='1' padding='space-16' style={{ backgroundColor: 'var(--ax-neutral-100)' }}>
            <Heading spacing size='medium' level='1'>
                Hva er din siste jobb?
            </Heading>

            {visSisteStilling && (
                <div className='mb-2'>
                    <RadioGruppe
                        valg={[
                            { tekst: tekst(SisteStillingValg.HAR_HATT_JOBB), value: SisteStillingValg.HAR_HATT_JOBB },
                            {
                                tekst: tekst(SisteStillingValg.HAR_IKKE_HATT_JOBB),
                                value: SisteStillingValg.HAR_IKKE_HATT_JOBB,
                            },
                        ]}
                        valgt={registrering.sisteStilling}
                        onSelect={(val: SisteStillingValg) => setRegistrering({ [SporsmalId.sisteStilling]: val })}
                        visFeilmelding={visFeilmeldingSisteStilling}
                    />
                </div>
            )}

            {visSisteJobb && (
                <div className='mb-4'>
                    <Heading spacing size='small' level='2'>
                        Stilling
                    </Heading>
                    <BodyLong>Følgende informasjon er registrert i Aa-registeret om siste stilling.</BodyLong>
                    <BodyLong className='mb-4'>Hvis opplysningen er feil, kan du endre under.</BodyLong>

                    {visStillingsSok ? (
                        <StillingsSok onClose={onCloseStillingssok} />
                    ) : (
                        <div>
                            {registrering.sisteJobb?.label}
                            <Button variant='tertiary' className='ml-2' onClick={() => setVisStillingsSok(true)}>
                                Endre
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <ReadMore header='Hva bruker vi informasjonen om siste stilling til?'>
                <div style={{ maxWidth: '34rem' }}>
                    Vi bruker opplysningene til å lage offentlig statistikk om arbeidsmarkedet. Hvis opplysningene er
                    feil, kan du endre dem. Da får NAV riktigere statistikk. Vær oppmerksom på at opplysningene er
                    hentet fra Arbeidsgiver- og arbeidstakerregisteret (Aa-registeret). Endrer du opplysninger hos NAV,
                    blir de bare lagret hos oss. I Aa-registeret er det kun arbeidsgivere som kan endre.
                </div>
            </ReadMore>
        </Box>
    );
}

export { SisteJobb };
