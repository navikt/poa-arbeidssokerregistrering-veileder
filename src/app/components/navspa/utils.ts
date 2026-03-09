/* istanbul ignore file */
export function createCustomEvent<T>(type: string, detail: T): Event {
    try {
        return new CustomEvent(type, { detail });
    } catch (e) {
        // IE11 fallback
        const event = document.createEvent('CustomEvent');
        event.initCustomEvent(type, false, false, detail);
        return event;
    }
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
export function getGlobal(): { NAVSPA: {}; 'NAVSPA-V2': {} } {
    if (typeof globalThis !== 'undefined') return globalThis as any;

    // IE11 fallback
    if (typeof self !== 'undefined') return self as any;
    if (typeof window !== 'undefined') return window as any;
    if (typeof global !== 'undefined') return global as any;
    throw new Error('Unable to locate globale object');
}
