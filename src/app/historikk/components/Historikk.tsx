'use client';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Alert, BodyShort, Box, Button, Heading, Switch } from '@navikt/ds-react';
import { use, useMemo, useRef } from 'react';
import { FilterProvider } from '@/app/contexts/filter-hendelse-context';
import { useVisningTypeContext, VisningsTypeProvider } from '@/app/contexts/hendelse-visning-context';
import { useModiaContext } from '@/app/contexts/modia-context';
import { HendelseFilter } from '@/app/historikk/components/HendelseFilter';
import { HistorikkListeTittel } from '@/app/historikk/components/HistorikkListeTittel';
import { HistorikkPeriode } from '@/app/historikk/components/HistorikkPeriode';
import PrintInfoHeader from '@/app/historikk/components/PrintInfoHeader';
import { useScrollSpy } from '@/app/hooks/useScrollSpy';
import type { PeriodeResult } from '@/app/lib/oppslag/perioder';
import TilbakeTilForside from '@/components/tilbake-til-forside';

type HistorikkProps = {
    perioderPromise: Promise<PeriodeResult>;
};

const Historikk: React.FC<HistorikkProps> = (props) => {
    const { perioderPromise } = props;
    const { perioder, error } = use(perioderPromise);
    const { fnr } = useModiaContext();
    const { toggleVisningsType } = useVisningTypeContext();
    const sidebarRef = useRef<null | HTMLDivElement>(null);

    const sectionIds = useMemo(() => {
        if (!perioder) return [];
        return perioder.map((p) => p.periodeId);
    }, [perioder]);

    useScrollSpy(sidebarRef, sectionIds);

    if (!fnr) return null;

    if (error)
        return (
            <Alert variant={'error'}>Noe gikk dessverre galt. Prøv igjen senere.{JSON.stringify(error.message)}</Alert>
        );

    if (!perioder || perioder.length === 0) {
        return <Alert variant="info">Ingen arbeidssøkerhistorikk tilgjengelig</Alert>;
    }

    return (
        <FilterProvider>
            <VisningsTypeProvider>
                <PrintInfoHeader fnr={fnr} />
                <div className="flex-1 ax-md:grid ax-md:grid-cols-[minmax(300px,1fr)_3fr]">
                    {/* Mobile menu for perioder */}
                    <Box
                        as={'nav'}
                        aria-label="Velg arbeidsøkerperiode"
                        className="md:hidden bg-ax-bg-default mb-4 print:hidden sticky top-0 right-0 left-0 pt-4 pb-1 text-center"
                    >
                        <ActionMenu>
                            <ActionMenu.Trigger>
                                <Button
                                    variant="secondary-neutral"
                                    icon={<ChevronDownIcon aria-hidden />}
                                    iconPosition="right"
                                >
                                    {perioder.length === 1 ? 'Arbeidssøkerperiode' : 'Arbeidssøkerperioder'}(
                                    {perioder?.length ?? 0})
                                </Button>
                            </ActionMenu.Trigger>
                            <ActionMenu.Content>
                                {perioder.map((el) => (
                                    <ActionMenu.Item key={el.periodeId}>
                                        <HistorikkListeTittel periode={el} />
                                    </ActionMenu.Item>
                                ))}
                            </ActionMenu.Content>
                        </ActionMenu>
                    </Box>
                    {/* Desktop list of perioder */}
                    <div
                        ref={sidebarRef}
                        className="hidden ax-md:block px-1 print:hidden sticky top-0 max-h-screen overflow-y-scroll"
                    >
                        {/* Sidebar content */}
                        <Heading size="large">Arbeidssøkerperioder</Heading>
                        <BodyShort className="mb-4">
                            <b>{perioder.length || 0}</b> {perioder.length === 1 ? 'periode' : 'perioder'} funnet
                        </BodyShort>
                        {perioder.map((el) => (
                            <HistorikkListeTittel key={el.periodeId} periode={el} />
                        ))}
                    </div>
                    <div className="md:p-4">
                        <TilbakeTilForside sidenavn="Arbeidssøkerhistorikk" />
                        <div className="py-4 mb-6">
                            <HendelseFilter />
                            <Switch onChange={toggleVisningsType}>Vis innhold ekspandert</Switch>
                        </div>
                        {perioder.map((periode) => (
                            <div key={periode.periodeId} className="mb-8 pb-8">
                                <HistorikkPeriode periode={periode} />
                            </div>
                        ))}
                    </div>
                </div>
            </VisningsTypeProvider>
        </FilterProvider>
    );
};

export { Historikk };
