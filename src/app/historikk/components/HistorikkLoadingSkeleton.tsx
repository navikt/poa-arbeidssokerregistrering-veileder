import { Box, Heading, HGrid, Show, Skeleton } from '@navikt/ds-react';

const HistorikkInnholdSkeleton: React.FC = () => {
    return (
        <HGrid flexGrow='1' gap='space-16' columns={{ xs: 1, md: 'minmax(300px,1fr) 3fr' }}>
            <Show above='md' asChild>
                <Box>
                    <Heading size='large'>Arbeidssøkerperioder</Heading>
                    <Box marginBlock='space-0 space-16'>
                        <Skeleton variant='rectangle' height={30} />
                    </Box>
                    {Array(5)
                        .fill(0)
                        .map((i) => (
                            <Box key={i} marginBlock='space-0 space-8'>
                                <Skeleton variant='rectangle' height={60} />
                            </Box>
                        ))}
                </Box>
            </Show>
            <Box>
                <Box marginBlock='space-0 space-32'>
                    <Skeleton variant='rounded' height={250} />
                </Box>
                {Array(5)
                    .fill(0)
                    .map((i) => (
                        <Box key={i} marginBlock='space-0 space-8'>
                            <Skeleton variant='rounded' height={60} />
                        </Box>
                    ))}
            </Box>
        </HGrid>
    );
};

export { HistorikkInnholdSkeleton };
