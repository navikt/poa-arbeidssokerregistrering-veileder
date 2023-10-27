import { Alert, Detail, Heading, HelpText, Label, Link, Panel } from '@navikt/ds-react';
import useSprak from '../hooks/useSprak';
import lagHentTekstForSprak, { Tekster } from '../lib/lag-hent-tekst-for-sprak';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Kontaktinformasjon as KontaktInfo } from '../model/kontaktinformasjon';
import useSWR from 'swr';
import { fetcher } from '../lib/api-utils';

const TEKSTER: Tekster<string> = {
    nb: {
        tlfHosKRR: 'Telefonnummer lagret hos Kontakt- og reservasjonsregisteret',
        kildeKRR: 'Kilde: Kontakt- og reservasjonsregisteret',
        tlfHosNAV: 'Telefonnummer lagret hos NAV',
        kildeNAV: 'Kilde: NAV',
        endreOpplysninger: 'Endre opplysninger',
        ingenOpplysninger: 'Ingen kontaktopplysninger funnet!',
        leggInnOpplysninger: 'Legg inn kontaktopplysninger',
        hjelpetekst: 'Pass på at kontaktopplysningene dine er oppdatert, ellers kan vi ikke nå deg.',
    },
    en: {
        tlfHosKRR: 'Phone number registered with the common contact register',
        kildeKRR: 'Source: The common contact register',
        tlfHosNAV: 'Phone number registered with NAV',
        kildeNAV: 'Source: NAV',
        endreOpplysninger: 'Change contact details',
        ingenOpplysninger: 'We could not find any contact information!',
        leggInnOpplysninger: 'Enter contact details',
        hjelpetekst: 'Please make sure your contact details are updated or we will be unable to reach you.',
    },
};

export const Kontaktinformasjon = () => {
    const { data } = useSWR<KontaktInfo>('api/kontaktinformasjon/', fetcher);
    const tlfKrr = data?.telefonnummerHosKrr;
    const tlfNav = data?.telefonnummerHosNav;
    const sprak = useSprak();
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    if (tlfKrr || tlfNav) {
        return (
            <>
                {tlfKrr && <Telefonnummer kilde="KRR" telefonnummer={tlfKrr} />}
                {tlfNav && <Telefonnummer kilde="NAV" telefonnummer={tlfNav} />}
                <EndreOpplysningerLink tekst={tekst('endreOpplysninger')} />
            </>
        );
    } else
        return (
            <>
                <Alert variant="error" inline className="mbm">
                    <div style={{ display: 'flex' }}>
                        {tekst('ingenOpplysninger')}
                        <HelpText>{tekst('hjelpetekst')}</HelpText>
                    </div>
                </Alert>
                <EndreOpplysningerLink tekst={tekst('leggInnOpplysninger')} />
            </>
        );
};

type Kilde = 'KRR' | 'NAV';

const Telefonnummer = (props: { kilde: Kilde; telefonnummer: string }) => {
    const sprak = useSprak();
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    return (
        <Panel border className="mbm">
            <Heading level="2" size={'small'}>
                {tekst(`tlfHos${props.kilde}`)}
            </Heading>
            <Label>{props.telefonnummer}</Label>
            <Detail size={'small'}>{tekst(`kilde${props.kilde}`)}</Detail>
        </Panel>
    );
};

const EndreOpplysningerLink = (props: { tekst: string }) => {
    return (
        <Link href="https://www.nav.no/person/personopplysninger/#kontaktinformasjon" target="_blank">
            {props.tekst}
            <ExternalLinkIcon />
        </Link>
    );
};
