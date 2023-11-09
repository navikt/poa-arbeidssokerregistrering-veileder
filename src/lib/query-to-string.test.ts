import queryToString from './query-to-string';

describe('next-api-handler', () => {
    describe('queryToString', () => {
        it('returnerer tom streng for tomt objekt', () => {
            expect(queryToString({})).toEqual('');
        });

        it('lager query-string av gitt objeckt', () => {
            expect(queryToString({ fnr: '123', enhetId: '234' })).toEqual('?fnr=123&enhetId=234');
        });

        it('tar bare med nøkler med verdier', () => {
            expect(queryToString({ fnr: '123', enhetId: '', test: undefined, test2: null })).toEqual('?fnr=123');
        });
    });
});
