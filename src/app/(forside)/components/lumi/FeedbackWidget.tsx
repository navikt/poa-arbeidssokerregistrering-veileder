import { LumiSurveyDock } from '@navikt/lumi-survey/client';
import { survey } from './survey';

export function FeedbackWidget() {
    return (
        <LumiSurveyDock
            surveyId='viktigste-oppgave-for-veileder-som-kommer-inn'
            survey={survey}
            transport={{ endpoint: '/api/lumi/feedback' }}
        />
    );
}
