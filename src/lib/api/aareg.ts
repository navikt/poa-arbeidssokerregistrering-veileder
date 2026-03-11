'use server';

import { logger } from '@navikt/next-logger';
import { nanoid } from 'nanoid';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { authenticatedFetch } from '@/lib/authenticatedFetch';

const brukerMock = process.env.ENABLE_MOCK === 'enabled';

const AAREG_API_URL = `${process.env.AAREG_REST_API}/v2/arbeidstaker/arbeidsforholdoversikt`;
const AAREG_API_SCOPE = `api://${process.env.AAREG_CLUSTER}.arbeidsforhold.${process.env.AAREG_APPNAME}/.default`;
const PAM_ONTOLOGI_URL = process.env.PAM_ONTOLOGI_URL;

type SisteAareg = { konseptId: number; label: string; styrk08: string };

type SisteArbeidsforholdResult = {
    sisteArbeidsforhold: SisteAareg | null;
    error?: { message: string; status?: number };
};

type Arbeidsforhold = {
    startdato: string;
    sluttdato?: string;
    yrke?: { kode: string; beskrivelse: string };
};

/**
 * Henter det nyeste arbeidsforholdet fra Aa-registeret.
 * Prioriterer åpne (uten sluttdato) sortert etter startdato,
 * deretter avsluttede sortert etter sluttdato.
 */
function hentSisteArbeidsforhold(data: { arbeidsforholdoversikter: Arbeidsforhold[] }): string | null {
    const { arbeidsforholdoversikter } = data;

    const aapne = arbeidsforholdoversikter
        .filter((f) => !f.sluttdato)
        .sort((a, b) => new Date(b.startdato).getTime() - new Date(a.startdato).getTime());

    const avsluttede = arbeidsforholdoversikter
        .filter((f): f is Arbeidsforhold & { sluttdato: string } => !!f.sluttdato)
        .sort((a, b) => new Date(b.sluttdato).getTime() - new Date(a.sluttdato).getTime());

    const siste = aapne[0] ?? avsluttede[0];
    return siste?.yrke?.kode ?? null;
}

/**
 * Konverterer en styrk98-kode til styrk08 via PAM ontologi.
 */
async function konverterStyrk98TilStyrk08(
    styrk98: string,
): Promise<{ konseptId: number; label: string; styrk08: string } | null> {
    const callId = nanoid();
    const url = `${PAM_ONTOLOGI_URL}/ontologi/styrk98/konverter/${styrk98}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Nav-Consumer-Id': 'arbeidssokerregistrering-for-veileder',
                'Nav-Call-Id': callId,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            logger.warn(`Konvertering av styrk98 ${styrk98} feilet: ${response.status} ${response.statusText}`);
            return null;
        }

        const konseptListe = await response.json();
        return konseptListe[0] ?? null;
    } catch (e) {
        logger.error(e, `Feil ved oppslag mot PAM ontologi for styrk98 ${styrk98}`);
        return null;
    }
}

/**
 * Henter brukerens siste arbeidsforhold fra Aa-registeret og konverterer styrk98 → styrk08.
 * Returnerer null dersom bruker ikke har noen arbeidsforhold eller konvertering feiler.
 */
async function getSisteArbeidsforholdFraAareg(identitetsnummer: string | null): Promise<SisteArbeidsforholdResult> {
    logger.info(`Starter forsøke på å hente siste arbeidsforhold`);
    if (!identitetsnummer) {
        logger.warn(`Ingen identitetsnummer, ikke mulig å hente siste arbeidsforhold`);
        return { sisteArbeidsforhold: null };
    }

    if (brukerMock) {
        logger.info(`Mock: returnerer hardkodet arbeidsforhold`);
        await new Promise((res) => setTimeout(res, 300));
        return {
            sisteArbeidsforhold: {
                konseptId: -1,
                label: 'KONTORLEDER',
                styrk08: '1231',
            },
        };
    }
    try {
        logger.info(`Henter headers for aareg-kall`);
        const requestHeaders = await headers();
        logger.info(`Headers hentet OK, kaller authenticatedFetch mot aareg`);

        const result = await authenticatedFetch<{ arbeidsforholdoversikter: Arbeidsforhold[] }>({
            url: AAREG_API_URL,
            scope: AAREG_API_SCOPE,
            headers: requestHeaders,
            method: 'POST',
            body: {
                arbeidstakerId: identitetsnummer,
                arbeidsforholdstatuser: ['AKTIV', 'AVSLUTTET'],
            },
            extraHeaders: {
                'Nav-Aareg-Kontekst': 'SAKSBEHANDLER',
            },
        });
        logger.info(`authenticatedFetch returnerte, ok=${result.ok}`);

        if (!result.ok) {
            const { error, status } = result;
            if (status === 403) {
                logger.warn(`Ingen tilgang til aareg, omdirigerer til veiledning`);
                redirect('/veiledning/mangler-tilgang-til-aa-registeret');
            }
            logger.warn(`Feil fra aareg: ${error?.message}, status: ${status}`);
            return { sisteArbeidsforhold: null, error: { message: error?.message ?? 'Ukjent feil', status } };
        }

        const data = result.data;
        if (!data?.arbeidsforholdoversikter?.length) {
            return { sisteArbeidsforhold: null };
        }

        const styrk98 = hentSisteArbeidsforhold(data);
        if (!styrk98) {
            return { sisteArbeidsforhold: null };
        }

        const konsept = await konverterStyrk98TilStyrk08(styrk98);
        if (!konsept) {
            return { sisteArbeidsforhold: null };
        }

        return { sisteArbeidsforhold: konsept };
    } catch (e) {
        // Re-throw Next.js redirect errors
        if (
            e &&
            typeof e === 'object' &&
            'digest' in e &&
            typeof (e as any).digest === 'string' &&
            (e as any).digest.startsWith('NEXT_REDIRECT')
        ) {
            throw e;
        }
        logger.error(e, `Uventet feil i getSisteArbeidsforholdFraAareg`);
        return { sisteArbeidsforhold: null, error: { message: 'Uventet feil' } };
    }
}

export { getSisteArbeidsforholdFraAareg, type SisteArbeidsforholdResult };
