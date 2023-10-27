import hentKvitteringsUrl from './hent-kvitterings-url';
import { ErrorTypes } from '../model/error';

describe('hent-kvitterings-url', () => {
    it('returnerer "/kvittering/" for responser uten type', () => {
        expect(hentKvitteringsUrl()).toBe('/kvittering/');
    });

    it('returnerer "/kvittering-sykmeldt/ for sykmeldt-side', () => {
        expect(hentKvitteringsUrl('sykmeldt')).toBe('/kvittering-sykmeldt/');
    });
});
