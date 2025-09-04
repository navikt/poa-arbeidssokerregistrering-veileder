import React from 'react';
import { Tidslinje } from '../../model/tidslinjer';
import { TidslinjeIkon } from './TidslinjeIkon';
import { useTidslinjeSelection } from '../../contexts/tidslinje-selection-context';
import classNames from 'classnames';
import { ChevronRightIcon } from '@navikt/aksel-icons';


type TidslinjeTittelV2Props = {
    tidslinje: Tidslinje;
};

const TidslinjeTittelV2: React.FC<TidslinjeTittelV2Props> = (props) => {
    const { tidslinje } = props;
    const { selectedTidslinje, setSelectedTidslinje } = useTidslinjeSelection();

    const formatTitleString = (fromTimeStamp: string, toTimeStamp: string) => {
        const fromDate = new Date(fromTimeStamp);
        const toDate = new Date(toTimeStamp);

        const isValidDate = (date: Date) => !isNaN(date.getTime());

        const fromStr = isValidDate(fromDate) ? fromDate.toLocaleDateString() : '';
        const toStr = isValidDate(toDate) ? toDate.toLocaleDateString() : '';

        return `${fromStr} - ${toStr}`;
    };

    const handleClick = () => {
        setSelectedTidslinje(tidslinje);
    };

    const isSelected = selectedTidslinje?.periodeId === tidslinje.periodeId;

    return (
        <button
            className={`w-full mb-2 rounded p-4 transition-transform cursor-pointer flex flex-row text-left justify-between ${classNames({
                'translate-x-0.5 z-10 bg-lightblue-100': isSelected,
                'hover:translate-x-0.5 hover:bg-lightblue-50': !isSelected,
            })}`}
            onClick={handleClick}
        >
            <h2 className='flex gap-2'>
                {formatTitleString(tidslinje.startet, tidslinje.avsluttet)}
                <TidslinjeIkon hendelser={tidslinje.hendelser} />
            </h2>
            <div>
                <ChevronRightIcon title="a11y-title" fontSize="1.5rem" />
            </div>
        </button>
    );
};

export { TidslinjeTittelV2 };