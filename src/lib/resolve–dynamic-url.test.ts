import resolveDynamicUrl from './resolve-dynamic-url';

describe('resolve-dynamic-url', () => {
    it('returnerer url når ingen slugs eller queries', () => {
        expect(resolveDynamicUrl('http://www.test.no')).toEqual('http://www.test.no');
    });

    it('legger til enkelt slug', () => {
        expect(resolveDynamicUrl('http://www.test.no/[slug]', 'xyz')).toEqual('http://www.test.no/xyz');
    });

    it('legger til en liste av slugs', () => {
        expect(resolveDynamicUrl('http://www.test.no/[slug]', ['xyz', '123'])).toEqual('http://www.test.no/xyz/123');
    });

    it('legger query params etter slugs', () => {
        expect(
            resolveDynamicUrl('http://www.test.no/[slug]', ['xyz'], {
                foo: 'bar',
                test: '42',
            }),
        ).toEqual('http://www.test.no/xyz?foo=bar&test=42');
    });

    it('legger til query params når ingen slugs', () => {
        expect(
            resolveDynamicUrl('http://www.test.no', undefined, {
                foo: 'bar',
            }),
        ).toEqual('http://www.test.no?foo=bar');
    });
});
