import { oversettSluttaarsak } from './oversett-sluttaarsak';

describe('oversettSluttaarsak', () => {
    const oversett = oversettSluttaarsak('nb');
    it('returnerer Arbeidssøkerperioden er avsluttet i Arena for ISERV', () => {
        expect(oversett('ISERV')).toEqual('Arbeidssøkerperioden er avsluttet i Arena');
    });

    it('returnerer COWABUNGA for COWABUNGA', () => {
        expect(oversett('COWABUNGA')).toEqual('COWABUNGA');
    });

    it('returnerer Svarte "Nei" til å være arbeidssøker på bekreftelsen for [Bekreftelse] Ønsket ikke lenger å være arbeidssøker', () => {
        expect(oversett('[Bekreftelse] Ønsket ikke lenger å være arbeidssøker')).toEqual(
            'Svarte "Nei" til å være arbeidssøker på bekreftelsen',
        );
    });
});
