// @vitest-environment jsdom

import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ModiaProvider, useModiaContext } from '@/contexts/modia-context';
import { InternflateDecorator } from './decorator-intern';

const mockPush = vi.fn();
let mockPathname = '/';

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
    usePathname: () => mockPathname,
}));

function renderDecorator(initFnr: string | null = '10108000398') {
    const result = render(
        <ModiaProvider initFnr={initFnr} initEnhetId='0219'>
            <InternflateDecorator decoratorEnv='q2' />
        </ModiaProvider>,
    );
    const element = result.container.querySelector('internarbeidsflate-decorator');
    if (!element) throw new Error('Decorator element not found');
    return { ...result, element };
}

function renderDecoratorWithEnhet(initEnhetId: string, initFnr: string | null = '10108000398') {
    let capturedEnhetId: string | null = initEnhetId;

    const EnhetSpy = () => {
        const { enhetId } = useModiaContext();
        capturedEnhetId = enhetId;
        return null;
    };

    const result = render(
        <ModiaProvider initFnr={initFnr} initEnhetId={initEnhetId}>
            <InternflateDecorator decoratorEnv='q2' />
            <EnhetSpy />
        </ModiaProvider>,
    );
    const element = result.container.querySelector('internarbeidsflate-decorator');
    if (!element) throw new Error('Decorator element not found');
    return { ...result, element, getEnhetId: () => capturedEnhetId };
}

function dispatchFnrChanged(element: Element, fnr: string | null) {
    const event = new CustomEvent('fnr-changed', { detail: { fnr } });
    act(() => {
        element.dispatchEvent(event);
    });
}

function dispatchEnhetChanged(element: Element, enhet: string | null) {
    const event = new CustomEvent('enhet-changed', { detail: { enhet } });
    act(() => {
        element.dispatchEvent(event);
    });
}

describe('InternflateDecorator', () => {
    beforeEach(() => {
        mockPathname = '/';
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('oppdaterer fnr uten redirect når pathname ikke er i REDIRECT_PATHS', () => {
        mockPathname = '/';
        const { element } = renderDecorator('10108000398');

        dispatchFnrChanged(element, '12345678910');

        expect(mockPush).not.toHaveBeenCalled();
    });

    it('redirecter til / når fnr endres og pathname er i REDIRECT_PATHS', () => {
        mockPathname = '/registrering-arbeidssoeker-sjekk';
        const { element } = renderDecorator('10108000398');

        dispatchFnrChanged(element, '12345678910');

        expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('redirecter til / når pathname er /oppdater-opplysninger', () => {
        mockPathname = '/oppdater-opplysninger';
        const { element } = renderDecorator('10108000398');

        dispatchFnrChanged(element, '99887766554');

        expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('redirecter IKKE når fnr er lik nåværende', () => {
        mockPathname = '/registrering-arbeidssoeker-sjekk';
        const { element } = renderDecorator('10108000398');

        dispatchFnrChanged(element, '10108000398');

        expect(mockPush).not.toHaveBeenCalled();
    });

    it('setter fnr til null og redirecter når fnr er tom streng', () => {
        mockPathname = '/';
        const { element } = renderDecorator('10108000398');

        dispatchFnrChanged(element, '');

        expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('setter fnr til null og redirecter når fnr er null', () => {
        mockPathname = '/';
        const { element } = renderDecorator('10108000398');

        dispatchFnrChanged(element, null);

        expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('sender enhetId som enhet-attributt til dekoratøren', () => {
        const { element } = renderDecoratorWithEnhet('4154');

        expect(element.getAttribute('enhet')).toBe('4154');
    });

    it('oppdaterer enhetId i context når enhet-changed fires', () => {
        const { element, getEnhetId } = renderDecoratorWithEnhet('4154');

        dispatchEnhetChanged(element, '1824');

        expect(getEnhetId()).toBe('1824');
    });

    it('setter enhetId til null i context når enhet-changed fires med null', () => {
        const { element, getEnhetId } = renderDecoratorWithEnhet('4154');

        dispatchEnhetChanged(element, null);

        expect(getEnhetId()).toBeNull();
    });
});
