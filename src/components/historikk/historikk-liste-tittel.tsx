import React from 'react';
import { useTidslinjeSelection } from '../../contexts/tidslinje-selection-context';
import classNames from 'classnames';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { Periode } from '@navikt/arbeidssokerregisteret-utils/oppslag/v3';

type HistorikkListeTittelProps = {
    tidslinje: Periode;
};

const HistorikkListeTittel: React.FC<HistorikkListeTittelProps> = (props) => {
    const { tidslinje } = props;
    const { selectedTidslinje, setSelectedTidslinje } = useTidslinjeSelection();

    const formatTitleString = (fromTimeStamp: string, toTimeStamp: string | null) => {
        const fromDate = new Date(fromTimeStamp);
        const isValidDate = (date: Date) => !isNaN(date.getTime());
        const dateOptions: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        };
        const fromStr = isValidDate(fromDate) ? fromDate.toLocaleDateString('nb-NO', dateOptions) : '';
        let toStr = '';
        if (toTimeStamp) {
            const toDate = new Date(toTimeStamp);
            toStr = isValidDate(toDate) ? toDate.toLocaleDateString('nb-NO', dateOptions) : '';
        }
        return `${fromStr} - ${toStr}`;
    };

    const handleClick = () => {
        setSelectedTidslinje(tidslinje);

        // Scroll to the corresponding section
        const targetElement = document.getElementById(tidslinje.periodeId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    const isSelected = selectedTidslinje?.periodeId === tidslinje.periodeId;

    return (
        <button
            className={`w-full ax-md:mb-2 ax-md:rounded p-2 ax-md:p-4 ax-md:transition-transform ax-md:cursor-pointer flex flex-row text-left justify-between ${classNames(
                {
                    'md:translate-x-0.5 z-10 bg-lightblue-100': isSelected,
                    'md:hover:translate-x-0.5 ax-md:hover:bg-lightblue-50': !isSelected,
                },
            )}`}
            onClick={handleClick}
        >
            <h2 className="flex gap-2">{formatTitleString(tidslinje.startet, tidslinje.avsluttet)}</h2>
            <div>
                <ChevronRightIcon title="a11y-title" fontSize="1.5rem" />
            </div>
        </button>
    );
};

export { HistorikkListeTittel };
