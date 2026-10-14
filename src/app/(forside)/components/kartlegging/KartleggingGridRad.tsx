'use client';

import { ProfilertTil } from '@navikt/arbeidssokerregisteret-utils';
import { Tag } from '@navikt/ds-react';
import { useModiaContext } from '@/contexts/modia-context';
import { daysSinceDate } from '@/lib/date-utils';
import type { ArbeidssokerKompakt } from '@/model/kartlegging-api';
import { BEKREFTELSE_LABEL, LANGTIDSLEDIG_MAX, LANGTIDSLEDIG_MELLOM } from './constants';

function JaNeiTag({ svar }: { svar: boolean | undefined }) {
    return svar ? (
        <Tag data-color='success' size='small'>
            Ja
        </Tag>
    ) : (
        <Tag data-color='warning' size='small'>
            Nei
        </Tag>
    );
}

function NeiJaTag({ svar }: { svar: boolean | undefined }) {
    return svar ? (
        <Tag data-color='success' size='small'>
            Nei
        </Tag>
    ) : (
        <Tag data-color='warning' size='small'>
            Ja
        </Tag>
    );
}

function DagerTag({ dager }: { dager: number }) {
    const status = dager >= LANGTIDSLEDIG_MAX ? 'danger' : dager >= LANGTIDSLEDIG_MELLOM ? 'warning' : undefined;

    return <span data-dager-status={status}>{dager} dager</span>;
}

function firstToUppercase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

type KartleggingGridRadKolonne = 'navn' | 'dagerLedig' | 'bekreftelseslosning' | 'onskerVeileder';

function KartleggingGridRad({
    arbeidssoker,
    kolonne,
}: {
    arbeidssoker: ArbeidssokerKompakt;
    kolonne: KartleggingGridRadKolonne;
}) {
    const { setFnr } = useModiaContext();
    // Bruker første ledighetsperiode som aktiv periode
    const aktivPeriode = arbeidssoker.ledighetsperioder[0];

    function handleRowClick() {
        if (!arbeidssoker.identitetsnummer) return;
        setFnr(arbeidssoker.identitetsnummer.toString());
    }

    switch (kolonne) {
        case 'navn':
            return (
                <button type='button' onClick={handleRowClick} className='cursor-pointer'>
                    {arbeidssoker.fornavn && firstToUppercase(arbeidssoker.fornavn)}{' '}
                    {arbeidssoker.etternavn && firstToUppercase(arbeidssoker.etternavn)}
                </button>
            );
        case 'dagerLedig':
            return <DagerTag dager={daysSinceDate(aktivPeriode?.ledigSiden || new Date())} />;
        case 'onskerVeileder':
            return (
                <div className='flex items-center gap-1'>
                    {aktivPeriode && aktivPeriode?.egenvurdertTil ? (
                        <NeiJaTag svar={aktivPeriode?.egenvurdertTil === ProfilertTil.ANTATT_BEHOV_FOR_VEILEDNING} />
                    ) : (
                        'Mangler egenvurdering'
                    )}
                </div>
            );
        case 'bekreftelseslosning':
            return <div>{aktivPeriode?.bekreftelsePaaVegneAv.map((e) => BEKREFTELSE_LABEL[e]).join(', ')}</div>;
    }
}

export { DagerTag, JaNeiTag, KartleggingGridRad, NeiJaTag };
