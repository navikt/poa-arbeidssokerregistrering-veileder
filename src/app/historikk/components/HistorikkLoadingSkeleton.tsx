import { Box, Heading, Skeleton } from '@navikt/ds-react';

const HistorikkInnholdSkeleton: React.FC = () => {
    return (
        <div className="flex-1 gap-4 ax-md:grid ax-md:grid-cols-[minmax(300px,1fr)_3fr]">
            <Box className="hidden ax-md:block">
                <Heading size="large">Arbeidssøkerperioder</Heading>
                <Skeleton variant="rectangle" height={30} className="mb-4" />
                {Array(5)
                    .fill(0)
                    .map((i) => (
                        <Box key={i}>
                            <Skeleton variant="rectangle" height={60} className="mb-2" />
                        </Box>
                    ))}
            </Box>
            <Box>
                <Skeleton variant="rounded" height={250} className="mb-8" />
                {Array(5)
                    .fill(0)
                    .map((i) => (
                        <Box key={i}>
                            <Skeleton variant="rounded" height={60} className="mb-2" />
                        </Box>
                    ))}
            </Box>
        </div>
    );
};

export { HistorikkInnholdSkeleton };
