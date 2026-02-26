import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';
import { loggAktivitet } from '@/lib/tracking';

interface ValgmenyProps {
    sisteArbeidssoekerperiodeId: string;
    manglerOpplysninger?: boolean;
}

function Valgmeny(props: ValgmenyProps) {
    const { sisteArbeidssoekerperiodeId, manglerOpplysninger } = props;

    if (!sisteArbeidssoekerperiodeId) return null;

    return (
        <ActionMenu>
            <ActionMenu.Trigger>
                <Button
                    variant='secondary-neutral'
                    icon={<ChevronDownIcon aria-hidden />}
                    iconPosition='right'
                    size={'xsmall'}
                >
                    Valg
                </Button>
            </ActionMenu.Trigger>
            <ActionMenu.Content>
                <ActionMenu.Group label='Valg for arbeidssøkerperioden'>
                    <ActionMenu.Item
                        onSelect={() => loggAktivitet({ aktivitet: 'Går til endre opplysninger' })}
                        as='a'
                        href={`/oppdater-opplysninger?periodeId=${sisteArbeidssoekerperiodeId}`}
                    >
                        {manglerOpplysninger ? 'Legg til opplysninger' : 'Endre opplysninger'}
                    </ActionMenu.Item>

                    <ActionMenu.Item
                        onSelect={() => loggAktivitet({ aktivitet: 'Går til avslutt arbeidssøkerperiode' })}
                        as='a'
                        href='/avslutt-arbeidssoekerperiode'
                    >
                        Avslutt arbeidssøkerperioden
                    </ActionMenu.Item>
                    <ActionMenu.Item
                        onSelect={() => loggAktivitet({ aktivitet: 'Går til slett arbeidssøkerperiode' })}
                        as='a'
                        href='/slett-arbeidssoekerperiode'
                    >
                        Slett arbeidssøkerperioden
                    </ActionMenu.Item>
                </ActionMenu.Group>
            </ActionMenu.Content>
        </ActionMenu>
    );
}

export { Valgmeny };
