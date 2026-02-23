import { ChevronRightIcon } from '@navikt/aksel-icons';
import type { Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';
import type React from 'react';
import { getFormatedDateString } from '@/app/historikk/components/helpers';

type HistorikkListeTittelProps = {
    periode: Periode;
};

const HistorikkListeTittel: React.FC<HistorikkListeTittelProps> = (props) => {
    const { periode } = props;

    const handleClick = () => {
        // Scroll to the corresponding section
        const targetElement = document.getElementById(periode.periodeId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <button
            data-nav-target={periode.periodeId}
            className={`w-full ax-md:mb-2 ax-md:rounded p-2 ax-md:p-4 ax-md:transition-transform
			  ax-md:cursor-pointer flex flex-row text-left justify-between
        md:hover:translate-x-0.5 ax-md:hover:bg-ax-accent-100
        aria-current:md:translate-x-0.5 aria-current:z-10 aria-current:bg-ax-accent-200`}
            type='button'
            onClick={handleClick}
        >
            <h2 className='flex gap-2'>{`${getFormatedDateString(periode.startet) || '--'} - ${getFormatedDateString(periode.avsluttet) || 'Pågående'}`}</h2>
            <div>
                <ChevronRightIcon fontSize='1.5rem' aria-hidden />
            </div>
        </button>
    );
};

export { HistorikkListeTittel };
