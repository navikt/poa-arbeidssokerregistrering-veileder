import { Chips, Heading, InlineMessage, LocalAlert, Pagination, Table } from '@navikt/ds-react';
import { use, useMemo, useState } from 'react';
import { ManglerPersonEllerEnhet } from '@/components/ManglerPersonEllerEnhet';
import type { KartleggingApiResult } from '@/lib/api/kartlegging';
import { daysSinceDate } from '@/lib/date-utils';
import type { Arbeidssoker } from '@/model/kartlegging-api';
import { ArbeidssokerRad } from './ArbeidssokerRad';
import { type DagerFilter, ITEMS_PER_PAGE, LANGTIDSLEDIG_MAX, LANGTIDSLEDIG_MELLOM } from './constants';

type SortState = {
    orderBy: string;
    direction: 'ascending' | 'descending';
};

function Filters({
    arbeidsokere,
    currentFilter,
    onFilterChange,
}: {
    arbeidsokere: Arbeidssoker[];
    currentFilter: DagerFilter;
    onFilterChange: (selectedFilter: DagerFilter) => void;
}) {
    return (
        <Chips size='small' className='mb-4'>
            <Chips.Toggle selected={currentFilter === 'alle'} onClick={() => onFilterChange('alle')}>
                {`Alle (${arbeidsokere.length})`}
            </Chips.Toggle>
            <Chips.Toggle
                selected={currentFilter === 'kritisk'}
                onClick={() => onFilterChange('kritisk')}
                data-color='danger'
            >
                {`≥${LANGTIDSLEDIG_MAX} dager (${arbeidsokere.filter((b) => daysSinceDate(b.ledighetsperioder[0]?.ledigSiden) >= LANGTIDSLEDIG_MAX).length})`}
            </Chips.Toggle>
            <Chips.Toggle
                selected={currentFilter === 'moderat'}
                onClick={() => onFilterChange('moderat')}
                data-color='warning'
            >
                {`${LANGTIDSLEDIG_MELLOM}-${LANGTIDSLEDIG_MAX - 1} dager (${arbeidsokere.filter((b) => daysSinceDate(b.ledighetsperioder[0]?.ledigSiden) >= LANGTIDSLEDIG_MELLOM && daysSinceDate(b.ledighetsperioder[0]?.ledigSiden) < LANGTIDSLEDIG_MAX).length})`}
            </Chips.Toggle>
            <Chips.Toggle selected={currentFilter === 'lav'} onClick={() => onFilterChange('lav')}>
                {`<${LANGTIDSLEDIG_MELLOM} dager (${arbeidsokere.filter((b) => daysSinceDate(b.ledighetsperioder[0]?.ledigSiden) < LANGTIDSLEDIG_MELLOM).length})`}
            </Chips.Toggle>
        </Chips>
    );
}

function KartleggingListe({ kartlegging }: { kartlegging: KartleggingApiResult }) {
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<SortState>({ orderBy: 'dagerLedig', direction: 'descending' });
    const [filter, setFilter] = useState<DagerFilter>('alle');

    const filteredArbeidssokere = useMemo<Arbeidssoker[]>(() => {
        if (!kartlegging.arbeidssoekere) return [];
        let result = [...kartlegging.arbeidssoekere];

        const ledigSiden = (a: Arbeidssoker) => a.ledighetsperioder[0]?.ledigSiden;

        // FILTERING
        if (filter === 'kritisk') {
            result = result.filter((i) => daysSinceDate(ledigSiden(i)) >= LANGTIDSLEDIG_MAX);
        } else if (filter === 'moderat') {
            result = result.filter((i) => {
                const iLedig = daysSinceDate(ledigSiden(i));
                return iLedig >= LANGTIDSLEDIG_MELLOM && iLedig < LANGTIDSLEDIG_MAX;
            });
        } else if (filter === 'lav') {
            result = result.filter((i) => daysSinceDate(ledigSiden(i)) < LANGTIDSLEDIG_MELLOM);
        }

        // SORTING
        result.sort((a, b) => {
            const modifier = sort.direction === 'ascending' ? 1 : -1;
            if (sort.orderBy === 'dagerLedig') {
                return (daysSinceDate(ledigSiden(a)) - daysSinceDate(ledigSiden(b))) * modifier;
            }
            return 0;
        });
        return result;
    }, [kartlegging, filter, sort]);

    const totalPages = Math.ceil(filteredArbeidssokere.length / ITEMS_PER_PAGE);
    const paginatedBrukere = filteredArbeidssokere.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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
        <div>
            <Filters
                arbeidsokere={kartlegging.arbeidssoekere}
                currentFilter={filter}
                onFilterChange={handleFilterChange}
            />
            <Table size='medium' zebraStripes sort={sort} onSortChange={handleSort}>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Navn</Table.ColumnHeader>
                        <Table.ColumnHeader sortKey='dagerLedig' sortable>
                            Dager ledig
                        </Table.ColumnHeader>
                        <Table.ColumnHeader>Bekreftelsesløsning</Table.ColumnHeader>
                        <Table.ColumnHeader>Ønsker veileder</Table.ColumnHeader>
                        <Table.ColumnHeader>Rapportert arbeid</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {paginatedBrukere.map((arbeidssoker) => (
                        <ArbeidssokerRad key={arbeidssoker.arbeidssoekerId} arbeidssoker={arbeidssoker} />
                    ))}
                </Table.Body>
            </Table>
            <div className='py-4'>
                {totalPages > 1 && <Pagination page={page} onPageChange={setPage} count={totalPages} size='small' />}
            </div>
        </div>
    );
}

function Kartlegging({ kartleggingPromise }: { kartleggingPromise: Promise<KartleggingApiResult | null> }) {
    const data = use(kartleggingPromise);

    if (!data || (data.manglerTilgang && !data.error)) {
        return <ManglerPersonEllerEnhet />;
    }

    return (
        <>
            <LocalAlert status='warning' className='mb-4'>
                <LocalAlert.Header>
                    <LocalAlert.Title>Beta - Kartlegging</LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>
                    Listen under viser kun statisk test-data, dette er ikke ekte data. Formålet er å kunne se hvordan
                    kartleggingen kan se ut.
                </LocalAlert.Content>
            </LocalAlert>
            <Heading size='medium' level='2' className='mb-4'>
                Arbeidssøkere {data.arbeidssoekere && `(${data.arbeidssoekere.length} brukere)`}
            </Heading>
            {data.arbeidssoekere && data.arbeidssoekere?.length > 0 ? (
                <KartleggingListe kartlegging={data} />
            ) : (
                <InlineMessage status='info'>Ingen tilgjengelig data</InlineMessage>
            )}
        </>
    );
}

export { Kartlegging };
