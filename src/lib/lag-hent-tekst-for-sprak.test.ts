import lagHentTekstForSprak, { erStottetSprak } from './lag-hent-tekst-for-sprak';

describe('Hent tekst for språk', () => {
    const TEKSTER = {
        nb: {
            test1: 'Test1 norsk',
            test2: 'Test2 norsk',
        },
        en: {
            test1: 'Test1 en',
        },
    };

    test('Henter engelsk tekst', () => {
        const tekst = lagHentTekstForSprak(TEKSTER, 'en');
        expect(tekst('test1')).toBe('Test1 en');
    });

    test('Fallbacker til norsk', () => {
        const tekst = lagHentTekstForSprak(TEKSTER, 'en');
        expect(tekst('test2')).toBe('Test2 norsk');
    });

    test('Fallbacker til norsk ved ikke-eksisterende språk', () => {
        const tekst = lagHentTekstForSprak(TEKSTER, 'pl');
        expect(tekst('test1')).toBe('Test1 norsk');
    });
});

describe('Er støttet språk', () => {
    test('Returnerer true for støttet språk', () => {
        expect(erStottetSprak('nb')).toBe(true);
    });

    test('Returnerer false for ikke støttet språk', () => {
        expect(erStottetSprak('de')).toBe(false);
    });

    test('Returnerer false for undefined', () => {
        expect(erStottetSprak()).toBe(false);
    });
});
