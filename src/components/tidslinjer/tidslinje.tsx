import React from 'react';
import { Tidslinje as TidslinjeData } from '../../model/tidslinjer';
import { Accordion, BodyLong, BodyShort, Box, Heading, HGrid, List } from '@navikt/ds-react';
import { TidslinjeIkon } from './TidslinjeIkon';
import { prettyPrintDato, prettyPrintDatoOgKlokkeslettKortform } from '../../lib/date-utils';
import { HendelseVisning } from './hendelse';
import { snakeToCamel } from './helpers';
import { TEKSTER } from './text';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { Opplysninger } from './hendelseTyper/opplysninger';
import { OpplysningerV4Hendelse, PeriodeStartetV1Hendelse } from './tidslinjer.types';
import { PeriodeStart } from './hendelseTyper/periodeStart';

type TidslinjeProps = {
    tidslinje: TidslinjeData;
};

const Tidslinje: React.FC<TidslinjeProps> = (props) => {
    const { tidslinje } = props;
    const tekst = lagHentTekstForSprak(TEKSTER, 'nb');
    const erAvsluttet = tidslinje.avsluttet !== undefined;

    return (
        <div>
            <Heading size='large' level={'2'} className="flex items-center gap-4 mb-6">
                {prettyPrintDato(tidslinje.startet, 'nb', true)} -{' '}
                {tidslinje.avsluttet ? prettyPrintDato(tidslinje.avsluttet, 'nb', true) : 'fortsatt pågående'}
                <TidslinjeIkon hendelser={tidslinje.hendelser} />
            </Heading>
            <BodyLong size="medium">
                Denne arbeidssøkerperioden har {tidslinje.hendelser.length} hendelser.
            </BodyLong>
            <BodyLong size="medium" className='flex flex-row gap-4 mb-4'>
                <div>
                    {tidslinje.hendelser.length} hendelser
                </div>
                <div>
                    &#8226;
                </div>
                <div>
                    Perioden er {erAvsluttet ? 'avsluttet' : 'pågående'}
                </div>
            </BodyLong>

            <Accordion>
                {tidslinje.hendelser.map((hendelse, index) => (
                    //! Dersom vi ønsker å huske hvilken som er åpen, kan droppe å legge til tidspunkt på key
                    <Accordion.Item key={index + hendelse.tidspunkt}>
                        <Accordion.Header>
                            <div>
                                {tekst(hendelse.hendelseType)}
                                {/* {' - '} */}
                                {/* <span>{prettyPrintDatoOgKlokkeslettKortform(hendelse.tidspunkt, 'nb', true)}</span> */}
                            </div>
                        </Accordion.Header>
                        <Accordion.Content className=' bg-surface-warning-subtle/30_ py-4'>
                            {/* TODO: lage hendelseTyper som enums */}
                            {hendelse.hendelseType === 'opplysninger_v4' && (
                                <Opplysninger opplysninger={hendelse as OpplysningerV4Hendelse} />
                            )}
                            {hendelse.hendelseType === 'periode_startet_v1' && (
                                <PeriodeStart periode={hendelse as PeriodeStartetV1Hendelse} />
                            )}
                        </Accordion.Content>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
};

export { Tidslinje };