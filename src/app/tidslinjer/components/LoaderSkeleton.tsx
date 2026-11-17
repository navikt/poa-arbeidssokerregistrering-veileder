import { Skeleton, VStack } from '@navikt/ds-react';
import type React from 'react';

const loaderkeys = ['loader-1', 'loader-2', 'loader-3'];
const LoaderSkeleton: React.FC = () => {
    return (
        <VStack gap='space-8'>
            {loaderkeys.map((key) => (
                <Skeleton key={key} variant='rectangle' width='100%' height={60} />
            ))}
        </VStack>
    );
};

export { LoaderSkeleton };
