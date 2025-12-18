import { BekreftelseStatus, Hendelse, Sprak, Tidslinje } from '@navikt/arbeidssokerregisteret-utils';
import { BodyShort, Accordion, Box, HGrid, Tooltip } from '@navikt/ds-react';
import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, TrashFillIcon } from '@navikt/aksel-icons';

import { prettyPrintDato } from '../../lib/date-utils';
import { HendelseVisning } from './hendelse';

interface TidslinjerProps {
    sprak: Sprak;
    tidslinjer: Tidslinje[];
}

function skalHaVarseltrekant(hendelser: Hendelse[]) {
    const bekreftelser = hendelser.filter((hendelse) => ['bekreftelse_v1'].includes(hendelse.hendelseType));
    const avslutninger = hendelser.filter((hendelse) => ['periode_avsluttet_v1'].includes(hendelse.hendelseType));
    const paVegneAv = hendelser.filter((hendelse) =>
        ['pa_vegne_av_start_v1', 'pa_vegne_av_stopp_v1'].includes(hendelse.hendelseType),
    );
    const paVegneAvStopp = hendelser.filter((hendelse) => ['pa_vegne_av_stopp_v1'].includes(hendelse.hendelseType));

    const fristBrutt = paVegneAvStopp.map((hendelse) => hendelse.paVegneAvStoppV1.fristBrutt).includes(true);

    const problematiskeBekreftelser = bekreftelser.filter(
        (hendelse) => hendelse.bekreftelseV1.status !== BekreftelseStatus.GYLDIG,
    );
    const problematiskeAvslutninger = avslutninger.filter(
        (hendelse) => hendelse.periodeAvsluttetV1.utfoertAv.type === 'SYSTEM',
    );

    const problematiskePaVegneAv = paVegneAv.length > 0 && paVegneAv[0].hendelseType === 'pa_vegne_av_stopp_v1';

    return (
        problematiskeAvslutninger.length > 0 ||
        problematiskeBekreftelser.length > 0 ||
        problematiskePaVegneAv ||
        fristBrutt
    );
}

function skalHaSoppelbotte(hendelser: Hendelse[]) {
    const avslutninger = hendelser.filter((hendelse) => ['periode_avsluttet_v1'].includes(hendelse.hendelseType));
    const problematiskeAvslutninger = avslutninger.filter(
        (hendelse) => hendelse.periodeAvsluttetV1.aarsak === 'Feilregistrering',
    );
    return problematiskeAvslutninger.length > 0;
}

const TidslinjeIkon = ({ hendelser }: { hendelser: Hendelse[] }) => {
    if (skalHaSoppelbotte(hendelser))
        return (
            <Tooltip content="Slettet">
                <TrashFillIcon className="mr-4" color="red" />
            </Tooltip>
        );
    if (skalHaVarseltrekant(hendelser))
        return (
            <Tooltip content="Problematisk">
                <ExclamationmarkTriangleFillIcon className="mr-4" color="orange" />
            </Tooltip>
        );
    return (
        <Tooltip content="Ingen problemer">
            <CheckmarkCircleFillIcon className="mr-4" color="green" />
        </Tooltip>
    );
};

function TidslinjeBox(props: Tidslinje) {
    const { startet, avsluttet, hendelser } = props;
    hendelser.reverse();
    return (
        <Accordion className="mb-4">
            <Accordion.Item>
                <Accordion.Header>
                    <Box className="flex flex-row">
                        <TidslinjeIkon hendelser={hendelser} />
                        <BodyShort>
                            {prettyPrintDato(startet, 'nb', true)} -{' '}
                            {avsluttet ? prettyPrintDato(avsluttet, 'nb', true) : 'fortsatt pågående'}
                        </BodyShort>
                    </Box>
                </Accordion.Header>
                <Accordion.Content>
                    {hendelser.length > 0 && (
                        <Box className="font-semibold bg-slate-100">
                            <HGrid gap={'4'} columns={4}>
                                <span>Tidspunkt</span>
                                <span>Hendelse</span>
                                <span>Kilde</span>
                                <span>Status</span>
                            </HGrid>
                        </Box>
                    )}
                    {hendelser.map((hendelse, index) => (
                        <div
                            key={`${hendelse}-${index}-background`}
                            style={{ background: index % 2 !== 0 ? 'var(--a-surface-subtle)' : undefined }}
                        >
                            <HendelseVisning {...hendelse} key={`${hendelse}-${index}`} />
                        </div>
                    ))}
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
}

export function TidslinjerWrapper(props: TidslinjerProps) {
    const { tidslinjer } = props;

    if (!tidslinjer || tidslinjer.length === 0) {
        return <BodyShort spacing>Ingen arbeidssøkerperioder funnet</BodyShort>;
    }

    return (
        <>
            {tidslinjer.map((tidslinje, index) => (
                <TidslinjeBox {...tidslinje} key={`${tidslinje.periodeId}-${index}`} />
            ))}
        </>
    );
}
