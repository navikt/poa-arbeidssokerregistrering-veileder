export type UuScenario = {
    id: string;
    readyText: string;
    role?: 'alert' | 'heading' | 'table' | 'button' | 'radiogroup' | 'progressbar';
    notes?: string;
};

export const uuScenarios: UuScenario[] = [
    { id: 'uu--office', readyText: 'Arbeidssøkere (101 brukere)', role: 'table' },
    { id: 'uu--office-empty', readyText: 'Ingen tilgjengelig data' },
    {
        id: 'uu--office-access-denied',
        readyText: 'Fødselsnummer mangler',
        role: 'alert',
        notes: 'Kartlegging renders its existing missing-context fallback for an access-denied result.',
    },
    {
        id: 'uu--office-error',
        readyText: 'Ingen tilgjengelig data',
        notes: 'The current office component renders its empty-data view when the API result contains an error.',
    },
    { id: 'uu--person-error', readyText: 'Noe gikk dessverre galt. Prøv igjen senere', role: 'alert' },
    { id: 'uu--person-empty', readyText: 'Personen er ikke registrert som arbeidssøker', role: 'alert' },
    { id: 'uu--loading', readyText: 'Henter informasjon', role: 'progressbar' },
    { id: 'uu--general-error', readyText: 'Beklager, noe gikk galt.', role: 'heading' },
    { id: 'uu--missing-access', readyText: 'Mangler tilgang', role: 'heading' },
    {
        id: 'uu--confirmation-error',
        readyText: 'Har personen vært i arbeid',
        role: 'radiogroup',
        notes: 'Select Ja or Nei in both groups and press Send inn to reveal the synthetic submission error.',
    },
    { id: 'uu--confirmation-empty', readyText: 'Ingen tilgjengelige bekreftelser' },
    {
        id: 'uu--context-switch',
        readyText: 'Valgt testkontekst',
        notes: 'Test-only context controls are inside the scanned shell; fixture names and IDs are synthetic.',
    },
    { id: 'uu--whats-new', readyText: 'Hva er nytt i registreringen for veileder?', role: 'button' },
];
