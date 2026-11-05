import { ProfilertTil } from '@navikt/arbeidssokerregisteret-utils';
import type { Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { BodyShort, InfoCard, Tag } from '@navikt/ds-react';
import { InfoCardContent, InfoCardHeader, InfoCardTitle } from '@navikt/ds-react/InfoCard';
import { daysSinceDate, prettyPrintDatoOgKlokkeslett } from '@/lib/date-utils';
import type { ArbeidssokerKompakt } from '@/model/kartlegging-api';
import { DagerTag, JaNeiTag, NeiJaTag } from './kartlegging/ArbeidssokerRad';
import { BEKREFTELSE_LABEL } from './kartlegging/constants';
import { mapUtfoertAvType } from './mapUtfoertAvType';

type KartleggingProps = {
    arbeidssoker: ArbeidssokerKompakt | null;
    snapshot: Snapshot;
};

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className='grid grid-cols-1 gap-y-2 pb-2 mb-2 border-b border-b-ax-bg-neutral-moderate ax-md:grid-cols-[minmax(0,1fr)_210px]'>
            {children}
        </div>
    );
}

function KartleggingEnkeltperson({ arbeidssoker, snapshot }: KartleggingProps) {
    const aktivPeriode = arbeidssoker?.ledighetsperioder[0];

    if (!arbeidssoker)
        return (
            <InfoCard data-color='info' className='mb-4'>
                <InfoCardHeader>
                    <InfoCardTitle>Personen er registrert som arbeidssøker</InfoCardTitle>
                    <BodyShort textColor={'subtle'}>
                        Registrert {prettyPrintDatoOgKlokkeslett(snapshot.startet.tidspunkt)} av{' '}
                        {mapUtfoertAvType(snapshot.startet.sendtInnAv.utfoertAv.type)}
                    </BodyShort>
                </InfoCardHeader>
            </InfoCard>
        );
    return (
        <InfoCard data-color='info' className='mb-4'>
            <InfoCardHeader>
                <InfoCardTitle>Personen er registrert som arbeidssøker</InfoCardTitle>
                <BodyShort textColor={'subtle'}>
                    Registrert {prettyPrintDatoOgKlokkeslett(snapshot.startet.tidspunkt)} av{' '}
                    {mapUtfoertAvType(snapshot.startet.sendtInnAv.utfoertAv.type)}
                </BodyShort>
            </InfoCardHeader>
            <InfoCardContent>
                <Wrapper>
                    <div className='min-w-0'>Dager helt ledig</div>
                    <div className='min-w-0'>
                        <DagerTag dager={daysSinceDate(aktivPeriode?.ledigSiden || new Date())} />
                    </div>
                </Wrapper>
                <Wrapper>
                    <div className='min-w-0'>Bekreftelser kommer fra</div>
                    <div className='flex min-w-0 flex-wrap gap-2'>
                        {aktivPeriode?.bekreftelsePaaVegneAv.map((e) => (
                            <Tag key={e} size='small'>
                                {BEKREFTELSE_LABEL[e]}
                            </Tag>
                        ))}
                    </div>
                </Wrapper>
                <Wrapper>
                    <div className='flex min-w-0 items-center gap-1'>
                        <div>Ønsker veileder</div>
                    </div>
                    <div className='min-w-0'>
                        {aktivPeriode?.egenvurdertTil ? (
                            <NeiJaTag svar={aktivPeriode.egenvurdertTil === ProfilertTil.ANTATT_GODE_MULIGHETER} />
                        ) : (
                            'Mangler egenvurdering'
                        )}
                    </div>
                </Wrapper>
                <Wrapper>
                    <div className='flex min-w-0 items-center gap-1'>
                        <div>Rapportert arbeid på siste bekreftelse</div>
                    </div>
                    <div className='min-w-0'>
                        {aktivPeriode ? <JaNeiTag svar={aktivPeriode?.bekreftelseHarJobbet} /> : 'MANGLER DATA'}
                    </div>
                </Wrapper>
            </InfoCardContent>
        </InfoCard>
    );
}

export { KartleggingEnkeltperson };
