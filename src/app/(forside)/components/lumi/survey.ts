import type { SurveyDocumentV1 } from '@navikt/lumi-survey';

export const survey = {
    authoringSchemaVersion: 1,
    pages: [
        {
            id: 'priority',
            questions: [
                {
                    id: 'priority',
                    maxSelections: 2,
                    options: [
                        {
                            label: 'Registrere en ny arbeidssøker',
                            value: 'registrere-arbeidssoker',
                        },
                        {
                            label: 'Se historikken til en registrert arbeidssøker',
                            value: 'se-historikken-til-en-registrert-arbeidssoker',
                        },
                        {
                            label: 'Se tidslinjen til en registrert arbeidssøker',
                            value: 'alternativ-815ae931-5b1a-4986-8ded-981a204295e3',
                        },
                        {
                            label: 'Se opplysningene til en registrert arbeidssøker',
                            value: 'alternativ-3c07d8c3-9790-4608-9892-124fa86d80e0',
                        },
                        {
                            label: 'Endre opplysningene til en registrert arbeidssøker',
                            value: 'alternativ-05c45e7e-12dc-49d9-8a14-984236623504',
                        },
                        {
                            label: 'Levere bekreftelse for en registrert arbeidssøker',
                            value: 'alternativ-69391e2d-14c5-4fd6-9e86-6e4ac18e6684',
                        },
                    ],
                    prompt: 'Hvilke oppgaver er vanligvis viktigst for deg når du kommer inn på denne siden?',
                    randomize: true,
                    required: true,
                    type: 'multiChoice',
                },
            ],
        },
    ],
    success: {
        body: 'Vi jobber kontinuerlig med å forbedre flyten i løsningene våre. Svaret ditt kan hjelpe oss å lage en bedre forside.',
        title: 'Takk for at du tok deg tid til å svare oss!',
    },
    type: 'taskPriority',
} satisfies SurveyDocumentV1;
