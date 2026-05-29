import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import type { Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { Alert, BodyShort, Detail, Heading, InfoCard, Tag } from '@navikt/ds-react';
import { InfoCardContent, InfoCardHeader, InfoCardTitle } from '@navikt/ds-react/InfoCard';
import type { NokkeltallResult } from '@/lib/api/nokkeltall';
import { prettyPrintDato, prettyPrintDatoOgKlokkeslett } from '@/lib/date-utils';
import { mapUtfoertAvType } from './mapUtfoertAvType';

const KILDER = {
    nb: {
        ARBEIDSSOEKERREGISTERET: 'Arbeidssøkerregisteret',
        FRISKMELDT_TIL_ARBEIDSFORMIDLING: 'Sykepenger',
        DAGPENGER: 'Dagpenger',
    },
};

type NokkeltallProps = {
    nokkeltall: NokkeltallResult | null;
    snapshot: Snapshot;
};

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className='grid grid-cols-[1fr_210px] pb-2 mb-2 border-b border-b-ax-bg-neutral-moderate'>{children}</div>
    );
}

function Dager({ dager }: { dager: number | null }) {
    if (!dager) return <Tag>0 dager</Tag>;
    if (dager >= 130) return <Tag data-color='danger'>{dager} dager</Tag>;
    if (dager >= 190) return <Tag data-color='warning'>{dager} dager</Tag>;
    return <Tag>{dager} dager</Tag>;
}

function Nokkeltall({ nokkeltall, snapshot }: NokkeltallProps) {
    const tekst = lagHentTekstForSprak(KILDER, 'nb');

    if (!nokkeltall)
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
                        <Dager dager={nokkeltall.dagerUtenArbeid} />
                    </div>
                </Wrapper>
                <Wrapper>
                    <div>Bekreftelser kommer fra</div>
                    <div className='flex gap-2'>
                        {nokkeltall.tilhorighet.map((el) => (
                            <Tag key={el}>{tekst(el)}</Tag>
                        ))}
                    </div>
                </Wrapper>
                <Wrapper>
                    <div className='flex items-center gap-1'>
                        <div>Ønsker veileder</div>
                        {nokkeltall.onskerHjelp?.dato && (
                            <Detail>({prettyPrintDato(nokkeltall.onskerHjelp?.dato)})</Detail>
                        )}
                    </div>
                    <div>
                        {nokkeltall.onskerHjelp ? (
                            <Tag data-color={nokkeltall.onskerHjelp.svar ? 'warning' : 'success'}>
                                {nokkeltall.onskerHjelp?.svar ? 'Ja' : 'Nei'}
                            </Tag>
                        ) : (
                            <span>Ingen egenvurdering funnet</span>
                        )}
                    </div>
                </Wrapper>
                <Wrapper>
                    <div className='flex items-center gap-1'>
                        <div>Rapportert arbeid på siste bekreftelse</div>
                        {nokkeltall.bekreftelse?.tidspunkt && (
                            <Detail>({prettyPrintDato(nokkeltall.bekreftelse.tidspunkt)})</Detail>
                        )}
                    </div>
                    <div>
                        {nokkeltall.bekreftelse ? (
                            nokkeltall.bekreftelse?.svar.harJobbetIDennePerioden ? (
                                <Tag data-color='success'>Ja</Tag>
                            ) : (
                                <Tag data-color='warning'>Nei</Tag>
                            )
                        ) : (
                            <span>Ingen bekreftelse funnet</span>
                        )}
                    </div>
                </Wrapper>
            </InfoCardContent>
        </InfoCard>
    );
}

export { Nokkeltall };
