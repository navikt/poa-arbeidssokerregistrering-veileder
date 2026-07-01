'use client';

import { ProfilertTil } from '@navikt/arbeidssokerregisteret-utils';
import { Table, Tag } from '@navikt/ds-react';
import { useModiaContext } from '@/contexts/modia-context';
import { daysSinceDate } from '@/lib/date-utils';
import type { Arbeidssoker } from '@/model/kartlegging-api';
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

function DagerTag({ dager }: { dager: number }) {
    if (dager >= LANGTIDSLEDIG_MAX)
        return (
            <Tag data-color='danger' size='small'>
                {dager} dager
            </Tag>
        );
    if (dager >= LANGTIDSLEDIG_MELLOM)
        return (
            <Tag data-color='warning' size='small'>
                {dager} dager
            </Tag>
        );
    return <Tag size='small'>{dager} dager</Tag>;
}

function firstToUppercase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function ArbeidssokerRad({ arbeidssoker }: { arbeidssoker: Arbeidssoker }) {
    const { setFnr } = useModiaContext();
    // Bruker første ledighetsperiode som aktiv periode
    const aktivPeriode = arbeidssoker.ledighetsperioder[0];

    function handleRowClick() {
        if (!arbeidssoker.identitetsnummer) return;
        setFnr(arbeidssoker.identitetsnummer.toString());
    }

    return (
        <Table.Row key={arbeidssoker.arbeidssoekerId}>
            <Table.DataCell>
                <button type='button' onClick={handleRowClick}>
                    {firstToUppercase(arbeidssoker.fornavn)} {firstToUppercase(arbeidssoker.etternavn)}
                </button>
            </Table.DataCell>
            <Table.DataCell>
                <DagerTag dager={daysSinceDate(aktivPeriode?.ledigSiden)} />
            </Table.DataCell>
            <Table.DataCell>
                {aktivPeriode?.bekreftelsePaaVegneAv.map((e) => (
                    <Tag key={e} size='small'>
                        {BEKREFTELSE_LABEL[e]}
                    </Tag>
                ))}
            </Table.DataCell>
            <Table.DataCell>
                <div className='flex items-center gap-1'>
                    <JaNeiTag
                        svar={aktivPeriode?.egenvurdering?.egenvurdertTil === ProfilertTil.ANTATT_BEHOV_FOR_VEILEDNING}
                    />
                </div>
            </Table.DataCell>
            <Table.DataCell>
                <div className='flex items-center gap-1'>
                    <JaNeiTag svar={aktivPeriode?.bekreftelse?.harJobbet} />
                </div>
            </Table.DataCell>
        </Table.Row>
    );
}

export { ArbeidssokerRad };
