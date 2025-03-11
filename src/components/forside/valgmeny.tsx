import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';

import { useFeatureToggles } from '../../contexts/featuretoggle-context';

import { loggAktivitet } from '../../lib/amplitude';

interface ValgmenyProps {
    sisteArbeidssoekerperiodeId: string;
}

function Valgmeny(props: ValgmenyProps) {
    const { sisteArbeidssoekerperiodeId } = props;
    const { toggles } = useFeatureToggles();
    const brukStoppknapp = toggles['arbeidssokerregistrering-for-veileder.bruk-stoppknapp'];

    return (
        <ActionMenu>
            <ActionMenu.Trigger>
                <Button variant="secondary-neutral" icon={<ChevronDownIcon aria-hidden />} iconPosition="right">
                    Valg
                </Button>
            </ActionMenu.Trigger>
            <ActionMenu.Content>
                <ActionMenu.Group label="Valg for arbeidssøkerperioden">
                    <ActionMenu.Item
                        onSelect={() => loggAktivitet({ aktivitet: 'Går til endre opplysninger' })}
                        as="a"
                        href={`/oppdater-opplysninger?periodeId=${sisteArbeidssoekerperiodeId}`}
                    >
                        Endre opplysninger
                    </ActionMenu.Item>
                    {brukStoppknapp && (
                        <ActionMenu.Item
                            onSelect={() => loggAktivitet({ aktivitet: 'Går til avslutt arbeidssøkerperiode' })}
                            as="a"
                            href="/avslutt-arbeidssoekerperiode"
                        >
                            Avslutt arbeidssøkerperioden
                        </ActionMenu.Item>
                    )}
                    {brukStoppknapp && (
                        <ActionMenu.Item
                            onSelect={() => loggAktivitet({ aktivitet: 'Går til slett arbeidssøkerperiode' })}
                            as="a"
                            href="/slett-arbeidssoekerperiode"
                        >
                            Slett arbeidssøkerperioden
                        </ActionMenu.Item>
                    )}
                </ActionMenu.Group>
            </ActionMenu.Content>
        </ActionMenu>
    );
}

export default Valgmeny;
