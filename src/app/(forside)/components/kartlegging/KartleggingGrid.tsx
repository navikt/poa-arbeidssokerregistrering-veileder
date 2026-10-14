import { Chips, Heading, InlineMessage, LocalAlert, Pagination } from '@navikt/ds-react';
import { DataGrid } from '@navikt/ds-react/PREVIEW';
import { use, useMemo, useState } from 'react';
import { ManglerPersonEllerEnhet } from '@/components/ManglerPersonEllerEnhet';
import type { KartleggingApiKompaktResult } from '@/lib/api/kartlegging';
import { daysSinceDate } from '@/lib/date-utils';
import type { ArbeidssokerKompakt } from '@/model/kartlegging-api';
import { type DagerFilter, ITEMS_PER_PAGE, LANGTIDSLEDIG_MAX, LANGTIDSLEDIG_MELLOM } from './constants';
import styles from './KartleggingGrid.module.css';
import { KartleggingGridRad } from './KartleggingGridRad';

const columns: DataGrid.Columns<ArbeidssokerKompakt> = [
    {
        id: 'navn',
        header: 'Navn',
        isRowHeader: true,
        bodyCell: (arbeidssoker) => <KartleggingGridRad arbeidssoker={arbeidssoker} kolonne='navn' />,
    },
    {
        id: 'dagerLedig',
        header: 'Dager ledig',
        isSortable: true,
        bodyCell: (arbeidssoker) => <KartleggingGridRad arbeidssoker={arbeidssoker} kolonne='dagerLedig' />,
    },
    {
        id: 'onskerVeileder',
        header: 'Ønsker veileder',
        bodyCell: (arbeidssoker) => <KartleggingGridRad arbeidssoker={arbeidssoker} kolonne='onskerVeileder' />,
    },
    {
        id: 'bekreftelseslosning',
        header: 'Bekreftelsesløsning',
        bodyCell: (arbeidssoker) => <KartleggingGridRad arbeidssoker={arbeidssoker} kolonne='bekreftelseslosning' />,
    },
];

function Filters({
    arbeidsokere,
    currentFilter,
    onFilterChange,
}: {
    arbeidsokere: ArbeidssokerKompakt[];
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

function KartleggingGrid({ kartlegging }: { kartlegging: KartleggingApiKompaktResult }) {
    const [page, setPage] = useState(1);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [filter, setFilter] = useState<DagerFilter>('alle');

    const filteredArbeidssokere = useMemo<ArbeidssokerKompakt[]>(() => {
        if (!kartlegging.arbeidssoekere) return [];
        let result = [...kartlegging.arbeidssoekere];

        const ledigSiden = (a: ArbeidssokerKompakt) => a.ledighetsperioder[0]?.ledigSiden || new Date();

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
            const modifier = sortDirection === 'asc' ? 1 : -1;
            return (daysSinceDate(ledigSiden(a)) - daysSinceDate(ledigSiden(b))) * modifier;
        });
        return result;
    }, [kartlegging, filter, sortDirection]);

    const totalPages = Math.ceil(filteredArbeidssokere.length / ITEMS_PER_PAGE);
    const paginatedBrukere = filteredArbeidssokere.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handleFilterChange = (newFilter: DagerFilter) => {
        setFilter(newFilter);
        setPage(1);
    };

    const handleSort = (_sortOrder: DataGrid.Table.SortEntry[], detail: DataGrid.Table.SortChangeDetail) => {
        if (detail.columnId !== 'dagerLedig') return;
        setSortDirection(detail.direction === 'desc' ? 'desc' : 'asc');
        setPage(1);
    };

    return (
        <div>
            <Filters
                arbeidsokere={kartlegging.arbeidssoekere}
                currentFilter={filter}
                onFilterChange={handleFilterChange}
            />
            <div className={styles.gridWrapper}>
                <DataGrid
                    columns={columns}
                    data={paginatedBrukere}
                    getRowId={(arbeidssoker) => arbeidssoker.id.toString()}
                    defaultSettings={{ zebraStripes: true }}
                >
                    <DataGrid.Table
                        aria-label='Arbeidssøkere'
                        layout='auto'
                        sorting={{
                            sortOrder: [{ columnId: 'dagerLedig', direction: sortDirection }],
                            allowMultiSort: false,
                            onSortOrderChange: handleSort,
                        }}
                    />
                </DataGrid>
            </div>
            <div className='py-4'>
                {totalPages > 1 && <Pagination page={page} onPageChange={setPage} count={totalPages} size='small' />}
            </div>
        </div>
    );
}

function Kartlegging({ kartleggingPromise }: { kartleggingPromise: Promise<KartleggingApiKompaktResult | null> }) {
    const data = use(kartleggingPromise);

    if (!data || (data.manglerTilgang && !data.error)) {
        return <ManglerPersonEllerEnhet />;
    }

    return (
        <>
            <Heading size='medium' level='2' className='mb-4'>
                Arbeidssøkere {data.arbeidssoekere && `(${data.arbeidssoekere.length} brukere)`}
            </Heading>
            <LocalAlert status='warning' className='mb-8'>
                <LocalAlert.Header>
                    <LocalAlert.Title>Denne siden er under utvikling</LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>
                    Data skal være korrekte, men vi viser kun de 500 registrerte arbeidssøkerne med lengst ledighet.
                </LocalAlert.Content>
            </LocalAlert>
            {data.arbeidssoekere && data.arbeidssoekere?.length > 0 ? (
                <KartleggingGrid kartlegging={data} />
            ) : (
                <InlineMessage status='info'>Ingen tilgjengelig data</InlineMessage>
            )}
        </>
    );
}

export { Kartlegging };
