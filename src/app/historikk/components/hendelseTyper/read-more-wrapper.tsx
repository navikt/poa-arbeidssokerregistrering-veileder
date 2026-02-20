import { ReadMore } from '@navikt/ds-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useVisningTypeContext } from '../../../contexts/hendelse-visning-context';

type ReadMoreWrapperProps = {
    header: string;
    children: React.ReactNode;
};

/**
 * ReadMoreWrapper
 *
 * En tynn wrapper rundt @navikt/ds-react sin ReadMore som synkroniserer
 * lokal "open"-tilstand mot global visningsmodus fra hendelse-visning-context.
 */
const ReadMoreWrapper: React.FC<ReadMoreWrapperProps> = (props) => {
    const { header, children, ...rest } = props;
    const [open, setOpen] = useState(false);
    const { visningsType } = useVisningTypeContext();

    useEffect(() => {
        setOpen(visningsType === 'expanded');
    }, [visningsType]);

    return (
        <ReadMore header={header} onOpenChange={setOpen} open={open} {...rest}>
            {children}
        </ReadMore>
    );
};

export { ReadMoreWrapper };
