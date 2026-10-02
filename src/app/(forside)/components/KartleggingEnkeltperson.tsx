import { lagHentTekstForSprak, ProfilertTil } from '@navikt/arbeidssokerregisteret-utils';
import type { Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { Alert, BodyShort, Heading, InfoCard, Tag } from '@navikt/ds-react';
import { InfoCardContent, InfoCardHeader, InfoCardTitle } from '@navikt/ds-react/InfoCard';
import { daysSinceDate, prettyPrintDatoOgKlokkeslett } from '@/lib/date-utils';
import type { ArbeidssokerKompakt } from '@/model/kartlegging-api';
import { DagerTag, JaNeiTag, NeiJaTag } from './kartlegging/ArbeidssokerRad';
import { BEKREFTELSE_LABEL } from './kartlegging/constants';
import { mapUtfoertAvType } from './mapUtfoertAvType';

const KILDER = {
    nb: {
        ARBEIDSSOEKERREGISTERET: 'Arbeidssøkerregisteret',
        FRISKMELDT_TIL_ARBEIDSFORMIDLING: 'Sykepenger',
        DAGPENGER: 'Dagpenger',
    },
};

type KartleggingProps = {
    arbeidssoker: ArbeidssokerKompakt | null;
    snapshot: Snapshot;
};

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className='grid grid-cols-[1fr_210px] pb-2 mb-2 border-b border-b-ax-bg-neutral-moderate'>{children}</div>
    );
}

function KartleggingEnkeltperson({ arbeidssoker, snapshot }: KartleggingProps) {
    const tekst = lagHentTekstForSprak(KILDER, 'nb');
    const aktivPeriode = arbeidssoker?.ledighetsperioder[0];

    if (!arbeidssoker)
        return (
            <Alert variant={'info'} className={'mb-4'}>
                <Heading level={'3'} size={'small'}>
                    Personen er registrert som arbeidssøker
                </Heading>
                <BodyShort textColor={'subtle'}>
                    Registrert {prettyPrintDatoOgKlokkeslett(snapshot.startet.tidspunkt)} av{' '}
                    {mapUtfoertAvType(snapshot.startet.sendtInnAv.utfoertAv.type)}
                </BodyShort>
            </Alert>
        );
    return (
        <InfoCard data-color='info' className='mb-4'>
            <InfoCardHeader>
                <InfoCardTitle>
                    Personen er registrert som arbeidssøker
                    <BodyShort textColor={'subtle'}>
                        Registrert {prettyPrintDatoOgKlokkeslett(snapshot.startet.tidspunkt)} av{' '}
                        {mapUtfoertAvType(snapshot.startet.sendtInnAv.utfoertAv.type)}
                    </BodyShort>
                </InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
                <Wrapper>
                    <div>Dager helt ledig</div>
                    <div>
                        <DagerTag dager={daysSinceDate(aktivPeriode?.ledigSiden || new Date())} />
                    </div>
                </Wrapper>
                <Wrapper>
                    <div>Bekreftelser kommer fra</div>
                    <div className='flex gap-2'>
                        {aktivPeriode?.bekreftelsePaaVegneAv.map((e) => (
                            <Tag key={e} size='small'>
                                {BEKREFTELSE_LABEL[e]}
                            </Tag>
                        ))}
                    </div>
                </Wrapper>
                <Wrapper>
                    <div className='flex items-center gap-1'>
                        <div>Ønsker veileder</div>
                    </div>
                    <div>
                        {aktivPeriode?.egenvurdertTil ? (
                            <NeiJaTag svar={aktivPeriode.egenvurdertTil === ProfilertTil.ANTATT_BEHOV_FOR_VEILEDNING} />
                        ) : (
                            'IKKE SVART'
                        )}
                    </div>
                </Wrapper>
                <Wrapper>
                    <div className='flex items-center gap-1'>
                        <div>Rapportert arbeid på siste bekreftelse</div>
                    </div>
                    <div>{aktivPeriode ? <JaNeiTag svar={aktivPeriode?.bekreftelseHarJobbet} /> : 'MANGLER DATA'}</div>
                </Wrapper>
            </InfoCardContent>
        </InfoCard>
    );
}

export { KartleggingEnkeltperson };
