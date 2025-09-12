import React from 'react';
import { prettyPrintDatoOgKlokkeslettKortform } from '../../lib/date-utils';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { TEKSTER } from '../tidslinjer/text';
import { Source } from './source';

type HistorikkInnslagHeaderProps = {
    date: string;
    title: string;
    source: string;
};

const HistorikkInnslagHeader: React.FC<HistorikkInnslagHeaderProps> = (props) => {
    const { date, title, source } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');

    return (
        <div className="flex flex-wrap sm:grid sm:grid-cols-[min-content_auto_min-content] gap-2">
            {/* <div className='flex gap-2 items-center pb-2'> */}
            <div className="whitespace-nowrap border-r-2 border-gray-600 pr-3">
                {prettyPrintDatoOgKlokkeslettKortform(date, 'nb', true)}
            </div>
            {/* <div>|</div> */}
            <h3>{tekst(title)}</h3>
            {/* <div>|</div> */}
            <Source source={source} />
        </div>
    );
};

export { HistorikkInnslagHeader };
