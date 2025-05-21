import { Bekreftelse, lagHentTekstForSprak, Sprak } from '@navikt/arbeidssokerregisteret-utils';
import { Heading, Box, BodyShort, Accordion } from '@navikt/ds-react';

import { prettyPrintDato, prettyPrintDatoOgKlokkeslett } from '../../lib/date-utils';

const TEKSTER = {
    nb: {
        periode: 'Periode',
        av: 'av',
        innsendt: 'Innsendt',
        jobbet: 'Jobbet i perioden',
        fortsette: 'Vil fortsatt være arbeidssøker',
        SLUTTBRUKER: 'bruker',
        SYSTEM: 'Nav',
        VEILEDER: 'veileder',
    },
};

function AlleBekreftelser(props: { bekreftelser: Bekreftelse[]; sprak: Sprak }) {
    const { bekreftelser, sprak } = props;

    if (bekreftelser.length === 0) return null;

    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    return (
        <>
            {bekreftelser.map(({ periodeId, svar }, index) => {
                return (
                    <Box
                        key={index + periodeId}
                        className="p-4 border-b border-b-surface-neutral-active last:border-b-0"
                    >
                        <Heading size="small" level="3">
                            {prettyPrintDato(svar.gjelderFra, sprak, true)} -{' '}
                            {prettyPrintDato(svar.gjelderTil, sprak, true)}
                        </Heading>
                        <dl>
                            <dt className="font-semibold">{tekst('innsendt')}</dt>
                            <dd>
                                {prettyPrintDatoOgKlokkeslett(svar.sendtInnAv.tidspunkt, sprak, true)} {tekst('av')}{' '}
                                {tekst(svar.sendtInnAv.utfoertAv.type)}{' '}
                                {svar.sendtInnAv.utfoertAv.type === 'VEILEDER'
                                    ? `(${svar.sendtInnAv.utfoertAv.id})`
                                    : ''}
                            </dd>
                            <dt className="font-semibold">{tekst('jobbet')}</dt>
                            <dd>{svar.harJobbetIDennePerioden ? 'Ja' : 'Nei'}</dd>
                            <dt className="font-semibold">{tekst('fortsette')}</dt>
                            <dd>{svar.vilFortsetteSomArbeidssoeker ? 'Ja' : 'Nei'}</dd>
                        </dl>
                    </Box>
                );
            })}
        </>
    );
}

export function BekreftelseHistorikk(props: { bekreftelser: Bekreftelse[]; sprak: Sprak }) {
    const { bekreftelser, sprak } = props;

    if (bekreftelser.length === 0) return null;

    return (
        <Box>
            <Heading level="2" size="medium">
                Arbeidsøkerperioden bekreftet
            </Heading>
            <Accordion>
                <Accordion.Item>
                    <Accordion.Header>Vis alle innsendte bekreftelser</Accordion.Header>
                    <Accordion.Content>
                        <AlleBekreftelser bekreftelser={bekreftelser} sprak={sprak} />
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
        </Box>
    );
}
