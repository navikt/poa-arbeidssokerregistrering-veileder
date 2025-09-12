import React from 'react';
import { PaVegneAvStoppV1Hendelse } from '../tidslinjer.types';
import { HistorikkInnslagHeader } from '../historikk-innslag-header';

type PaVegneAvStoppetProps = {
    stoppetHendelse: PaVegneAvStoppV1Hendelse;
};

const PaVegneAvStoppet: React.FC<PaVegneAvStoppetProps> = (props) => {
    const { stoppetHendelse } = props;

    return (
        <div>
            <HistorikkInnslagHeader
                date={stoppetHendelse.tidspunkt}
                title={stoppetHendelse.hendelseType}
                source={stoppetHendelse.paVegneAvStoppV1.bekreftelsesloesning}
            />
        </div>
    );
};

export { PaVegneAvStoppet };
