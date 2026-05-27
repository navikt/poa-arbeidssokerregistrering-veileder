import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import type { Snapshot } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import { BodyShort, Detail, InfoCard, Tag } from '@navikt/ds-react';
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

function Nokkeltall({ nokkeltall, snapshot }: NokkeltallProps) {
    const tekst = lagHentTekstForSprak(KILDER, 'nb');

    if (!nokkeltall) return null;
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
                        {/*lag variant med 182 (terskel) -> rød */}
                        <Tag>{nokkeltall.dagerUtenArbeid} dager</Tag>
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
                        <Detail>({prettyPrintDato(nokkeltall.onskerHjelp?.dato || '')})</Detail>
                    </div>
                    <div>
                        <Tag data-color='success'>Nei</Tag>
                    </div>
                </Wrapper>
                <Wrapper>
                    <div className='flex items-center gap-1'>
                        <div>Rapportert arbeid på siste bekreftelse</div>
                        <Detail>({prettyPrintDato(nokkeltall.bekreftelse?.tidspunkt || '')})</Detail>
                    </div>
                    <div>
                        {nokkeltall.bekreftelse?.svar.harJobbetIDennePerioden ? (
                            <Tag data-color='success'>Ja</Tag>
                        ) : (
                            <Tag data-color='warning'>Nei</Tag>
                        )}
                    </div>
                </Wrapper>
            </InfoCardContent>
        </InfoCard>
    );
}

export { Nokkeltall };
