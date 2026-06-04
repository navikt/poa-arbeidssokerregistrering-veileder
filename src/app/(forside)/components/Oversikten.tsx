'use client';

import { Chips, Detail, Heading, InlineMessage, Pagination, Table, Tag, VStack } from '@navikt/ds-react';
import { use, useMemo, useState } from 'react';
import { ManglerPersonEllerEnhet } from '@/components/ManglerPersonEllerEnhet';
import type { OversiktenApiResult } from '@/lib/api/oversikten';

type Bekreftelsesloesning = 'ARBEIDSSOEKERREGISTERET' | 'DAGPENGER' | 'FRISKMELDT_TIL_ARBEIDSFORMIDLING';

const BEKREFTELSE_LABEL: Record<Bekreftelsesloesning, string> = {
    ARBEIDSSOEKERREGISTERET: 'Arbeidssøkerregisteret',
    DAGPENGER: 'Dagpenger',
    FRISKMELDT_TIL_ARBEIDSFORMIDLING: 'Sykepenger',
};

type SortState = {
    orderBy: string;
    direction: 'ascending' | 'descending';
};
const LANGTIDSLEDIG_MAX = 180;
const LANGTIDSLEDIG_MELLOM = 150;

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

function JaNeiTag({ svar }: { svar: boolean }) {
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

type DagerFilter = 'alle' | 'kritisk' | 'moderat' | 'lav';

const ITEMS_PER_PAGE = 10;

function FilteredTableView({ oversikten }: { oversikten: OversiktenApiResult }) {
    const [sort, setSort] = useState<SortState>({ orderBy: 'dagerLedig', direction: 'descending' });
    const [filter, setFilter] = useState<DagerFilter>('alle');
    const [page, setPage] = useState(1);

    const filteredBrukere = useMemo(() => {
        if (!oversikten.oversikt) return [];
        let result = [...oversikten.oversikt];

        if (filter === 'kritisk') result = result.filter((b) => b.dagerLedig >= LANGTIDSLEDIG_MAX);
        else if (filter === 'moderat')
            result = result.filter((b) => b.dagerLedig >= LANGTIDSLEDIG_MELLOM && b.dagerLedig < LANGTIDSLEDIG_MAX);
        else if (filter === 'lav') result = result.filter((b) => b.dagerLedig < LANGTIDSLEDIG_MELLOM);

        result.sort((a, b) => {
            const modifier = sort.direction === 'ascending' ? 1 : -1;
            if (sort.orderBy === 'dagerLedig') return (a.dagerLedig - b.dagerLedig) * modifier;
            if (sort.orderBy === 'navn') return a.navn.localeCompare(b.navn) * modifier;
            return 0;
        });

        return result;
    }, [oversikten, filter, sort]);

    const totalPages = Math.ceil(filteredBrukere.length / ITEMS_PER_PAGE);
    const paginatedBrukere = filteredBrukere.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handleFilterChange = (newFilter: DagerFilter) => {
        setFilter(newFilter);
        setPage(1);
    };

    const handleSort = (sortKey: string) => {
        setSort((prev) =>
            prev.orderBy === sortKey
                ? { orderBy: sortKey, direction: prev.direction === 'ascending' ? 'descending' : 'ascending' }
                : { orderBy: sortKey, direction: 'ascending' },
        );
    };

    return (
        <VStack gap='space-16'>
            <div className='flex flex-wrap items-center gap-4'>
                <Chips size='small'>
                    <Chips.Toggle selected={filter === 'alle'} onClick={() => handleFilterChange('alle')}>
                        {`Alle (${oversikten.oversikt?.length})`}
                    </Chips.Toggle>
                    <Chips.Toggle
                        selected={filter === 'kritisk'}
                        onClick={() => handleFilterChange('kritisk')}
                        data-color='danger'
                    >
                        {`≥${LANGTIDSLEDIG_MAX} dager (${oversikten.oversikt?.filter((b) => b.dagerLedig >= LANGTIDSLEDIG_MAX).length})`}
                    </Chips.Toggle>
                    <Chips.Toggle
                        selected={filter === 'moderat'}
                        onClick={() => handleFilterChange('moderat')}
                        data-color='warning'
                    >
                        {`${LANGTIDSLEDIG_MELLOM}-${LANGTIDSLEDIG_MAX - 1} dager (${oversikten.oversikt?.filter((b) => b.dagerLedig >= LANGTIDSLEDIG_MELLOM && b.dagerLedig < LANGTIDSLEDIG_MAX).length})`}
                    </Chips.Toggle>
                    <Chips.Toggle selected={filter === 'lav'} onClick={() => handleFilterChange('lav')}>
                        {`<${LANGTIDSLEDIG_MELLOM} dager (${oversikten.oversikt?.filter((b) => b.dagerLedig < LANGTIDSLEDIG_MELLOM).length})`}
                    </Chips.Toggle>
                </Chips>
            </div>
            <Table size='medium' zebraStripes sort={sort} onSortChange={handleSort}>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader sortKey='navn' sortable>
                            Navn
                        </Table.ColumnHeader>
                        <Table.ColumnHeader sortKey='dagerLedig' sortable>
                            Dager ledig
                        </Table.ColumnHeader>
                        <Table.ColumnHeader>Bekreftelsesløsning</Table.ColumnHeader>
                        <Table.ColumnHeader>Ønsker veileder</Table.ColumnHeader>
                        <Table.ColumnHeader>Rapportert arbeid</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {paginatedBrukere.map((bruker) => (
                        <Table.Row key={bruker.id}>
                            <Table.DataCell>{bruker.navn}</Table.DataCell>
                            <Table.DataCell>
                                <DagerTag dager={bruker.dagerLedig} />
                            </Table.DataCell>
                            <Table.DataCell>
                                <Tag size='small'>{BEKREFTELSE_LABEL[bruker.bekreftelsesloesning]}</Tag>
                            </Table.DataCell>
                            <Table.DataCell>
                                <div className='flex items-center gap-1'>
                                    <JaNeiTag svar={bruker.onskerVeileder.svar} />
                                    <Detail>({bruker.onskerVeileder.dato})</Detail>
                                </div>
                            </Table.DataCell>
                            <Table.DataCell>
                                <div className='flex items-center gap-1'>
                                    <JaNeiTag svar={bruker.rapportertArbeid.svar} />
                                    <Detail>({bruker.rapportertArbeid.dato})</Detail>
                                </div>
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            {totalPages > 1 && <Pagination page={page} onPageChange={setPage} count={totalPages} size='small' />}
        </VStack>
    );
}

function Oversikten({ oversiktenPromise }: { oversiktenPromise: Promise<OversiktenApiResult> }) {
    const data = use(oversiktenPromise);

    if (data.manglerTilgang && !data.error) {
        return <ManglerPersonEllerEnhet />;
    }

    return (
        <>
            <Heading size='medium' level='2'>
                Arbeidssøkere {data.oversikt && `(${data.oversikt.length} brukere)`}
            </Heading>
            {data.oversikt && data.oversikt?.length > 0 ? (
                <FilteredTableView oversikten={data} />
            ) : (
                <InlineMessage status='info'>Ingen tilgjengelig data</InlineMessage>
            )}
        </>
    );
}

export { Oversikten };
