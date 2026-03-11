// Stub for '@navikt/next-logger' used in test environment.
// Aliased in vitest.config.ts so tests don't need inline vi.mock() calls.
// Uses vi.fn() so tests can assert on logger calls (e.g. toHaveBeenCalledWith).

import { vi } from 'vitest';

export const logger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    trace: vi.fn(),
};
