'use client';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import {
    ActionMenu,
    Alert,
    BodyShort,
    Box,
    Button,
    Heading,
    HGrid,
    Hide,
    HStack,
    Show,
    Switch,
} from '@navikt/ds-react';
import { use, useMemo, useRef } from 'react';
import { HendelseFilter } from '@/app/historikk/components/HendelseFilter';
import { HistorikkListeTittel } from '@/app/historikk/components/HistorikkListeTittel';
import { HistorikkPeriode } from '@/app/historikk/components/HistorikkPeriode';
import PrintInfoHeader from '@/app/historikk/components/PrintInfoHeader';
import { ManglerTilganger } from '@/components/ManglerTilganger';
import { FilterProvider } from '@/contexts/filter-hendelse-context';
import { useVisningTypeContext } from '@/contexts/hendelse-visning-context';
import { useModiaContext } from '@/contexts/modia-context';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import type { PeriodeResult } from '@/lib/api/oppslag-perioder';

type HistorikkProps = {
    perioderPromise: Promise<PeriodeResult>;
};

const Historikk: React.FC<HistorikkProps> = (props) => {
    const { perioderPromise } = props;
    const { perioder, error, manglerTilgang } = use(perioderPromise);
    const { fnr } = useModiaContext();
    const { toggleVisningsType } = useVisningTypeContext();
    const sidebarRef = useRef<null | HTMLDivElement>(null);

    const sectionIds = useMemo(() => {
        if (!perioder) return [];
        return perioder.map((p) => p.periodeId);
    }, [perioder]);

    useScrollSpy(sidebarRef, sectionIds);

    if (!fnr) return null;

    if (manglerTilgang) {
        return <ManglerTilganger />;
    }

    if (error) return <Alert variant={'error'}>Noe gikk dessverre galt. Prøv igjen senere.</Alert>;

    if (!perioder || perioder.length === 0) {
        return <Alert variant='info'>Ingen arbeidssøkerhistorikk tilgjengelig</Alert>;
    }

    return (
        <FilterProvider>
            <PrintInfoHeader fnr={fnr} />
            <HGrid flexGrow='1' columns={{ xs: 1, md: 'minmax(300px,1fr) 3fr' }}>
                {/* Mobile menu for perioder */}
                <Hide above='md' asChild>
                    <Box
                        as='nav'
                        aria-label='Velg arbeidsøkerperiode'
                        background='default'
                        marginBlock='space-0 space-16'
                        paddingBlock='space-16 space-4'
                        position='sticky'
                        top='space-0'
                        right='space-0'
                        left='space-0'
                        className='skjul-ved-utskrift'
                    >
                        <HStack justify='center'>
                            <ActionMenu>
                                <ActionMenu.Trigger>
                                    <Button
                                        variant='secondary-neutral'
                                        icon={<ChevronDownIcon aria-hidden />}
                                        iconPosition='right'
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
                        </HStack>
                    </Box>
                </Hide>
                {/* Desktop list of perioder */}
                <Show above='md' asChild>
                    <Box
                        as='aside'
                        ref={sidebarRef}
                        paddingInline='space-4'
                        position='sticky'
                        top='space-0'
                        maxHeight='100vh'
                        overflowY='scroll'
                        className='skjul-ved-utskrift'
                    >
                        {/* Sidebar content */}
                        <Heading size='large' level='2'>
                            Arbeidssøkerperioder
                        </Heading>
                        <Box marginBlock='space-0 space-16'>
                            <BodyShort>
                                <b>{perioder.length || 0}</b> {perioder.length === 1 ? 'periode' : 'perioder'} funnet
                            </BodyShort>
                        </Box>
                        {perioder.map((el) => (
                            <HistorikkListeTittel key={el.periodeId} periode={el} />
                        ))}
                    </Box>
                </Show>
                <Box paddingInline={{ xs: 'space-0', md: 'space-16' }}>
                    <div>
                        <HendelseFilter />
                        <Switch onChange={toggleVisningsType}>Vis innhold ekspandert</Switch>
                    </div>
                    {perioder.map((periode) => (
                        <Box key={periode.periodeId} marginBlock='space-0 space-32' paddingBlock='space-0 space-32'>
                            <HistorikkPeriode periode={periode} />
                        </Box>
                    ))}
                </Box>
            </HGrid>
        </FilterProvider>
    );
};

export { Historikk };
