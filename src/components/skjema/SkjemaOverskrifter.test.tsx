// @vitest-environment jsdom

import { DinSituasjon as Jobbsituasjon, SporsmalId, Utdanningsnivaa } from '@navikt/arbeidssokerregisteret-utils';
import { render, screen } from '@testing-library/react';
import { GenereltOmSamtykke } from '@/app/registrering-arbeidssoker/components/GenereltOmSamtykke';
import { DinSituasjon } from '@/components/skjema/DinSituasjon';
import { Hindringer } from '@/components/skjema/Hindringer';
import { Utdanning } from '@/components/skjema/Utdanning';
import type { RegistreringState } from '@/model/registrering';

function renderUnderSidetittel(seksjon: React.ReactNode) {
    return render(
        <>
            <h1>Registrering</h1>
            {seksjon}
        </>,
    );
}

function expectSeksjonsoverskrift(tittel: string) {
    expect(screen.getByRole('heading', { level: 2, name: tittel })).toBeTruthy();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
}

describe('overskrifter i registreringsskjemaet', () => {
    it('bruker h2 for DinSituasjon under sidens h1', () => {
        renderUnderSidetittel(<DinSituasjon registrering={{}} setRegistrering={() => {}} doValidate={false} />);

        expectSeksjonsoverskrift('Din arbeidssøkersituasjon');
    });

    it('bruker h2 for Utdanning under sidens h1', () => {
        const registrering: RegistreringState = {
            [SporsmalId.dinSituasjon]: Jobbsituasjon.MISTET_JOBBEN,
            [SporsmalId.utdanning]: Utdanningsnivaa.VIDEREGAENDE_FAGBREV_SVENNEBREV,
        };

        renderUnderSidetittel(<Utdanning registrering={registrering} setRegistrering={() => {}} doValidate={false} />);

        expectSeksjonsoverskrift('Utdanning');
    });

    it('bruker h2 for Hindringer under sidens h1', () => {
        renderUnderSidetittel(<Hindringer registrering={{}} setRegistrering={() => {}} doValidate={false} />);

        expectSeksjonsoverskrift('Hindringer');
    });

    it('starter GenereltOmSamtykke med h2 under sidens h1', () => {
        renderUnderSidetittel(<GenereltOmSamtykke />);

        expectSeksjonsoverskrift('Før du registrerer arbeidssøkeren må du sørge for at:');
    });
});
