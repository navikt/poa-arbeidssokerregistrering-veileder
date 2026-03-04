import { BodyLong, Box, Heading, List } from '@navikt/ds-react';
import type { ApiRegelId } from '@/app/lib/models/kan-starte-periode';

interface VurderingskriterierProps {
    regler: ApiRegelId[];
}

type Tiltak = {
    id: string;
    beskrivelse: string;
};

const TILTAKSLISTE: Partial<Record<ApiRegelId, Tiltak[]>> = {
    UNDER_18_AAR: [
        {
            id: '02dd3c41-e39b-401e-8746-f33924c3be2b',
            beskrivelse: 'Det kreves samtykke fra foresatte for å kunne registrere mindreårige som arbeidssøkere',
        },
    ],
    UKJENT_ALDER: [
        {
            id: 'd4bc30ee-d2e6-488e-9fd5-acad67e26f99',
            beskrivelse: 'Systemene vår kan ikke bekrefte personens alder',
        },
    ],
    IKKE_BOSATT_I_NORGE_I_HENHOLD_TIL_FOLKEREGISTERLOVEN: [
        {
            id: '773558b7-5336-4cc9-8df0-0c811e38dcd0',
            beskrivelse: 'Adressene vi finner i våre systemer oppfyller ikke kravene til registrering',
        },
    ],
    ER_EU_EOES_STATSBORGER_MED_STATUS_IKKE_BOSATT: [
        {
            id: 'e70c919a-673a-4fca-803b-fa1e412f90c1',
            beskrivelse: 'Personen står som utflyttet i registerene',
        },
    ],
};

/**
 * Vurderingskriterier og tiltak for myke regler som KAN overstyres av veileder.
 *
 * Vises kun når `RegistreringSjekk` har bestemt at alle regler kan overstyres
 * (`klassifisering.kanAlleReglerOverstyres`) og ansatt har tilgang.
 *
 * Ren presentasjonskomponent — mottar de aktuelle `regler` direkte fra parent.
 */
function VurderingskriterierForArbeidssoekerregistrering({ regler }: VurderingskriterierProps) {
    const tiltaksliste = regler.reduce<Tiltak[]>((liste, regel) => {
        const tiltak = TILTAKSLISTE[regel];
        if (tiltak) {
            liste.push(...tiltak);
        }
        return liste;
    }, []);

    if (tiltaksliste.length === 0) return null;

    return (
        <Box>
            <div>
                <Heading as='h3' size='xsmall'>
                    Hvorfor må jeg gjøre en vurdering av om personen skal kunne registreres?
                </Heading>
                <Box marginBlock='space-12' asChild>
                    <List as='ul' size='small'>
                        {tiltaksliste.map((tiltak) => (
                            <List.Item key={tiltak.id}>{tiltak.beskrivelse}</List.Item>
                        ))}
                    </List>
                </Box>
            </div>
            <BodyLong spacing>Du må opprette et notat og dokumentere vurderingene i Gosys.</BodyLong>
        </Box>
    );
}

export default VurderingskriterierForArbeidssoekerregistrering;
